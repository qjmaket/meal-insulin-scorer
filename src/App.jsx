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
  const [screen, setScreen]     = useState('dashboard');
  const [session, setSession]   = useState(null);
  const [profile, setProfile]   = useState(null);
  const [targets, setTargets]   = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Auth state management ──────────────────────────────
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

  // Reload profile when user navigates screens
  useEffect(() => {
    if (session?.user?.id) fetchProfile(session.user.id);
  }, [screen]);

  const fetchProfile = async (userId) => {
    const { data } = await loadProfile(userId);
    if (data) {
      setProfile(data);
      // Derive macro targets from raw profile data
      // calcProfile returns { calorieTarget, macros: { protein, carbs, fat }, bfPct, bmr, tdee }
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
    // Recalculate targets immediately after save
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

  const handleNav = (id) => setScreen(id);

  // ── Loading state ──────────────────────────────────────
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

  // ── Not authenticated ──────────────────────────────────
  if (!session) return <AuthScreen />;

  // ── Authenticated ──────────────────────────────────────
  const user = session.user;

  const screens = {
    dashboard: <Dashboard profile={profile} targets={targets} user={user} onNavigate={handleNav} />,
    scorer:    <MealScorer profile={profile} targets={targets} user={user} onNavigate={handleNav} />,
    log:       <DailyLog  profile={profile} targets={targets} user={user} onNavigate={handleNav} />,
    profile:   <Profile   profile={profile} user={user} onSave={handleProfileSave} />,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F1923', paddingBottom: 64 }}>
      {screens[screen] ?? <MealScorer profile={profile} targets={targets} user={user} />}
      <NavBar active={screen} onNav={handleNav} />
    </div>
  );
}
