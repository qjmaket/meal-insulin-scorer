import { useState, useCallback } from 'react';
import FastingTracker from './FastingTracker';
import HydrationCounter from './HydrationCounter';
import QuickLog from './QuickLog';
import {
  getLog, getDailyTotals, deleteLogEntry, updateLogEntry,
  getFlagByValue, logMeal,
} from '../utils/dailyLog';
import { storageGet, todayKey, formatTime } from '../utils/storage';

function MacroBar({ label, value, target, color }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const over = value > target;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#5a7a96' }}>{label}</span>
        <span style={{ fontSize: 12 }}>
          <span style={{ color: over ? '#E84545' : '#F0EDE6', fontWeight: 500 }}>
            {Math.round(value)}
          </span>
          <span style={{ color: '#3a5a76' }}> / {target}g</span>
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{
          width: `${pct}%`,
          background: over ? '#E84545' : color,
        }} />
      </div>
    </div>
  );
}

function CalorieBar({ value, target }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const over = value > target;
  const color = over ? '#E84545' : pct > 80 ? '#F5A623' : '#00C9A7';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: '#5a7a96' }}>Calories</span>
        <span style={{ fontSize: 13 }}>
          <span style={{ color, fontWeight: 600 }}>{Math.round(value)}</span>
          <span style={{ color: '#3a5a76' }}> / {target}</span>
        </span>
      </div>
      <div className="progress-track" style={{ height: 8 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function LoggedMealCard({ entry, onDelete, onUpdateTimestamp }) {
  const [editingTime, setEditingTime] = useState(false);
  const [timeVal, setTimeVal] = useState('');
  const flag = entry.flag ? getFlagByValue(entry.flag) : null;

  const startEditTime = () => {
    const d = new Date(entry.timestamp);
    setTimeVal(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`);
    setEditingTime(true);
  };

  const commitTime = () => {
    if (!timeVal) { setEditingTime(false); return; }
    const [h, m] = timeVal.split(':').map(Number);
    const d = new Date(entry.timestamp);
    d.setHours(h, m, 0, 0);
    onUpdateTimestamp(entry.id, d.toISOString());
    setEditingTime(false);
  };

  const ratingColor = !entry.score ? '#5a7a96'
    : entry.score.rating === 'Low' ? '#00C9A7'
    : entry.score.rating === 'Moderate' ? '#F5A623'
    : '#E84545';

  const ratingBg = !entry.score ? '#1a2d3d'
    : entry.score.rating === 'Low' ? '#0a2a25'
    : entry.score.rating === 'Moderate' ? '#2a2010'
    : '#2a1010';

  return (
    <div className="card" style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#F0EDE6' }}>
              {entry.name}
            </span>
            {entry.score && (
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 4,
                background: ratingBg, color: ratingColor, fontWeight: 600,
              }}>
                {entry.score.netScore.toFixed(1)}
              </span>
            )}
            {flag && (
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 4,
                background: `${flag.color}20`, color: flag.color, fontWeight: 600,
              }}>
                {flag.icon} {flag.label}
              </span>
            )}
          </div>

          {entry.score && (
            <div style={{ fontSize: 11, color: '#5a7a96', display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <span>P {entry.score.totalProtein?.toFixed(0)}g</span>
              <span>C {entry.score.totalCarbs?.toFixed(0)}g</span>
              <span>F {entry.score.totalFat?.toFixed(0)}g</span>
              <span>GL {entry.score.totalGL?.toFixed(1)}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {editingTime ? (
              <>
                <input
                  type="time" value={timeVal}
                  onChange={e => setTimeVal(e.target.value)}
                  onBlur={commitTime}
                  onKeyDown={e => e.key === 'Enter' && commitTime()}
                  autoFocus
                  style={{
                    background: '#1a2d3d', border: '1px solid #00C9A7',
                    borderRadius: 4, color: '#F0EDE6', padding: '2px 6px',
                    fontSize: 12, fontFamily: 'inherit',
                  }}
                />
              </>
            ) : (
              <button
                onClick={startEditTime}
                style={{
                  background: 'none', border: 'none', color: '#5a7a96',
                  fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                  textDecoration: 'underline dotted', padding: 0,
                }}
              >
                {formatTime(entry.timestamp)}
              </button>
            )}
            <span style={{ fontSize: 10, color: '#3a5a76' }}>tap to edit</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(entry.id)}
          style={{
            background: 'none', border: 'none', color: '#5a7a96',
            fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 4px',
          }}
          aria-label="Delete meal"
        >×</button>
      </div>
    </div>
  );
}

export default function DailyLog({ profile, onLogFromQuickLog }) {
  const [log, setLog] = useState(() => getLog(todayKey()));
  const [activeTab, setActiveTab] = useState('log'); // 'log' | 'fasting' | 'quick'
  const [refreshKey, setRefreshKey] = useState(0);

  const savedProfile = profile || (() => {
    try {
      const p = localStorage.getItem('mis_profile');
      return p ? JSON.parse(p) : null;
    } catch { return null; }
  })();

  const targets = {
    calories: 2447,
    protein: 175,
    carbs: 196,
    fat: 107,
  };

  // Try to get targets from profile calc if available
  // (simplified — Layer 4 will pull from profile store directly)

  const refresh = useCallback(() => {
    setLog(getLog(todayKey()));
    setRefreshKey(k => k + 1);
  }, []);

  const handleDelete = (entryId) => {
    deleteLogEntry(todayKey(), entryId);
    refresh();
  };

  const handleUpdateTimestamp = (entryId, newTs) => {
    updateLogEntry(todayKey(), entryId, { timestamp: newTs });
    refresh();
  };

  const handleQuickLog = (meal) => {
    logMeal(meal);
    refresh();
  };

  const totals = getDailyTotals(todayKey());
  const totalCals = Math.round(
    (totals.protein * 4) + (totals.carbs * 4) + (totals.fat * 9)
  );

  const avgScore = totals.mealCount > 0
    ? totals.netScore / totals.mealCount : null;

  const scoreColor = avgScore === null ? '#5a7a96'
    : avgScore < 10 ? '#00C9A7'
    : avgScore <= 20 ? '#F5A623'
    : '#E84545';

  const tabBtn = (id, label) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        flex: 1, background: 'none', border: 'none',
        borderBottom: activeTab === id ? '2px solid #00C9A7' : '2px solid transparent',
        color: activeTab === id ? '#F0EDE6' : '#5a7a96',
        padding: '10px 4px', fontSize: 12, cursor: 'pointer',
        fontFamily: 'inherit', fontWeight: activeTab === id ? 600 : 400,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '28px 0 16px', borderBottom: '1px solid #1e2d3d', marginBottom: 16 }}>
        <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Daily Log</h1>
      </div>

      {/* Daily summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#5a7a96', marginBottom: 4 }}>Meals logged</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#F0EDE6' }}>{totals.mealCount}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#5a7a96', marginBottom: 4 }}>Avg insulin score</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: scoreColor }}>
            {avgScore !== null ? avgScore.toFixed(1) : '—'}
          </div>
        </div>
      </div>

      {/* Macro progress */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="label-sm" style={{ marginBottom: 12 }}>Today's progress</div>
        <CalorieBar value={totalCals} target={targets.calories} />
        <MacroBar label="Protein" value={totals.protein} target={targets.protein} color="#00C9A7" />
        <MacroBar label="Carbs"   value={totals.carbs}   target={targets.carbs}   color="#F5A623" />
        <MacroBar label="Fat"     value={totals.fat}     target={targets.fat}     color="#5a7a96" />
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e2d3d', marginBottom: 16 }}>
        {tabBtn('log',     `Meals (${log.length})`)}
        {tabBtn('fasting', 'Fasting')}
        {tabBtn('quick',   'Quick log')}
      </div>

      {/* Tab content */}
      {activeTab === 'log' && (
        <div>
          {log.length === 0 ? (
            <div className="empty-state">
              No meals logged today.<br />
              Score a meal in the Meal Scorer, then tap <strong>Log This Meal</strong>.
            </div>
          ) : (
            [...log]
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
              .map(entry => (
                <LoggedMealCard
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDelete}
                  onUpdateTimestamp={handleUpdateTimestamp}
                />
              ))
          )}
        </div>
      )}

      {activeTab === 'fasting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FastingTracker
            key={refreshKey}
            profile={savedProfile}
            onRefresh={refresh}
          />
          <HydrationCounter onUpdate={refresh} />
        </div>
      )}

      {activeTab === 'quick' && (
        <QuickLog
          onLogMeal={handleQuickLog}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}
