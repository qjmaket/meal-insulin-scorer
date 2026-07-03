import { useState } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import MealScorer from './components/MealScorer';
import DailyLog from './components/DailyLog';
import Profile from './components/Profile';

export default function App() {
  const [screen, setScreen] = useState('scorer');

  const screens = {
    dashboard: <Dashboard />,
    scorer:    <MealScorer />,
    log:       <DailyLog />,
    profile:   <Profile />,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F1923', paddingBottom: 64 }}>
      {screens[screen] ?? <MealScorer />}
      <NavBar active={screen} onNav={setScreen} />
    </div>
  );
}
