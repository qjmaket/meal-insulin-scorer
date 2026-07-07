import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import MealScorer from './components/MealScorer';
import DailyLog from './components/DailyLog';
import Profile from './components/Profile';
import AuthScreen from './components/AuthScreen';
import { onAuthStateChange, getSession } from './lib/auth';
import { loadProfile, saveProfile } from './lib/db';
import { calcProfile } from './utils/calculations';

export default function App() {
  const [screen, setScreen]         = useState('dashboard');
  const [session, setSession]       = useState(null);
  const [profile, setProfile]       = useState(null);
  const [targets, setTargets]       = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [preloadMeal, setPreloadMeal] = useState(null);
  const [initialTab, setInitialTab]   = useState(null);

  useEffect(() => {
    getSession().then(({ session }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setAuthLoading(false);
    });

    const unsubscribe = onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setTargets(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (session?.user?.id) fetchProfile(session.user.id);
  }, [screen]);

  const fetchProfile = async (userId) => {
    const { data } = await loadProfile(userId);
    if (data) {
      setProfile(data);
      const calc = calcProfile(data);
      if (calc?.macros) {
        setTargets({
          calories: calc.calorieTarget,
          protein:  calc.macros.protein,
          carbs:    calc.macros.carbs,
          fat:      calc.macros.fat,
        });
      }
    }
  };

  const handleProfileSave = async (profileData) => {
    if (!session?.user?.id) return;
    await saveProfile(session.user.id, profileData);
    setProfile(profileData);
    const calc = calcProfile(profileData);
    if (calc?.macros) {
      setTargets({
        calories: calc.calorieTarget,
        protein:  calc.macros.protein,
        carbs:    calc.macros.carbs,
        fat:      calc.macros.fat,
      });
    }
  };

  /**
   * Navigate to a screen with optional context.
   * @param {string} id - screen name
   * @param {Object} [options]
   * @param {Object} [options.meal]  - meal to preload into MealScorer
   * @param {string} [options.tab]   - initial tab to open in DailyLog
   *
   * Legacy call pattern handleNav('scorer', mealObject) is also supported
   * for backward compatibility with existing Quick Log callers.
   */
  const handleNav = (id, options = null) => {
    // Support legacy call pattern: handleNav('scorer', mealObject)
    if (options && !options.meal && !options.tab && options.items) {
      // options is actually a raw meal object — legacy pattern
      setPreloadMeal(options);
      setInitialTab(null);
    } else {
      setPreloadMeal(options?.meal || null);
      setInitialTab(options?.tab || null);
    }
    setScreen(id);
  };

  const handleMealPreloadConsumed = () => setPreloadMeal(null);
  const handleInitialTabConsumed = () => setInitialTab(null);

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0F1923',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#00C9A7', fontWeight: 600, marginBottom: 12 }}>
            MEAL INSULIN SCORER
          </div>
          <div style={{ fontSize: 13, color: '#5a7a96' }}>Loading…</div>
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  const user = session.user;

  const screens = {
    dashboard: <Dashboard profile={profile} targets={targets} user={user} onNavigate={handleNav} />,
    scorer:    <MealScorer
                 profile={profile} targets={targets} user={user} onNavigate={handleNav}
                 preloadMeal={preloadMeal} onPreloadConsumed={handleMealPreloadConsumed}
               />,
    log:       <DailyLog
                 profile={profile} targets={targets} user={user}
                 onNavigate={handleNav} initialTab={initialTab}
                 onInitialTabConsumed={handleInitialTabConsumed}
               />,
    profile:   <Profile profile={profile} user={user} onSave={handleProfileSave} />,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F1923', paddingBottom: 64 }}>
      {screens[screen] ?? <MealScorer profile={profile} targets={targets} user={user} />}
      <NavBar active={screen} onNav={handleNav} />
    </div>
  );
}
