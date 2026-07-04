import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import MealScorer from './components/MealScorer';
import DailyLog from './components/DailyLog';
import Profile from './components/Profile';

function loadProfile() {
  try {
    const saved = localStorage.getItem('mis_profile');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [screen, setScreen]   = useState('scorer');
  const [profile, setProfile] = useState(loadProfile);

  // Reload profile whenever user navigates to a screen
  // (in case they saved updated stats in Profile tab)
  useEffect(() => {
    setProfile(loadProfile());
  }, [screen]);

  const handleNav = (id) => {
    setScreen(id);
  };

  const screens = {
    dashboard: <Dashboard profile={profile} onNavigate={handleNav} />,
    scorer:    <MealScorer profile={profile} onNavigate={handleNav} />,
    log:       <DailyLog profile={profile} onNavigate={handleNav} />,
    profile:   <Profile onSave={() => setProfile(loadProfile())} />,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F1923', paddingBottom: 64 }}>
      {screens[screen] ?? <MealScorer />}
      <NavBar active={screen} onNav={handleNav} />
    </div>
  );
}
