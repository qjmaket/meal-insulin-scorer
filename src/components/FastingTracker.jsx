import { useState, useEffect } from 'react';
import {
  getFastingWindow, getSuggestedTimes, getTodayDayType,
  setFastBreak, setWindowClose,
} from '../utils/dailyLog';
import { formatTime, formatDuration, minutesSince, minutesBetween, todayKey } from '../utils/storage';

function TimeDisplay({ label, time, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState('');

  const startEdit = () => {
    const now = time ? new Date(time) : new Date();
    setVal(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`);
    setEditing(true);
  };

  const commit = () => {
    if (!val) { setEditing(false); return; }
    const [h, m] = val.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    onEdit(d.toISOString());
    setEditing(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e2d3d' }}>
      <span style={{ fontSize: 12, color: '#5a7a96' }}>{label}</span>
      {editing ? (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            type="time"
            value={val}
            onChange={e => setVal(e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === 'Enter' && commit()}
            autoFocus
            style={{
              background: '#1a2d3d', border: '1px solid #00C9A7',
              borderRadius: 4, color: '#F0EDE6', padding: '3px 8px',
              fontSize: 13, fontFamily: 'inherit',
            }}
          />
        </div>
      ) : (
        <button
          onClick={startEdit}
          style={{
            background: 'none', border: 'none',
            color: time ? '#F0EDE6' : '#5a7a96',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'inherit',
            textDecoration: 'underline dotted',
          }}
        >
          {time ? formatTime(time) : 'tap to set'}
        </button>
      )}
    </div>
  );
}

export default function FastingTracker({ profile, onRefresh }) {
  const [window, setWindow] = useState(getFastingWindow(todayKey()));
  const [now, setNow] = useState(Date.now());

  // Update live clock every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const refresh = () => {
    setWindow(getFastingWindow(todayKey()));
    onRefresh?.();
  };

  const dayType = getTodayDayType(profile);
  const suggested = getSuggestedTimes(dayType);
  const dayTypeLabel = dayType.charAt(0).toUpperCase() + dayType.slice(1).replace('_', ' ');

  // Live fasting/window status
  const { firstMeal, lastMeal, windowClose } = window;
  const inEatingWindow = firstMeal && !windowClose;
  const windowOpen = firstMeal
    ? Math.round((now - new Date(firstMeal)) / 60000)
    : null;
  const fastingSince = lastMeal || windowClose;
  const currentFast = fastingSince
    ? Math.round((now - new Date(fastingSince)) / 60000)
    : null;

  const handleSetFastBreak = (ts) => {
    setFastBreak(todayKey(), ts);
    refresh();
  };

  const handleSetWindowClose = (ts) => {
    setWindowClose(todayKey(), ts);
    refresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Live status */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div className="label-sm" style={{ marginBottom: 4 }}>Fasting status</div>
            <div style={{ fontSize: 11, color: '#5a7a96' }}>{dayTypeLabel} · {suggested.fastTarget} target</div>
          </div>
          <div style={{
            padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
            background: inEatingWindow ? '#2a2010' : '#0a2a25',
            color: inEatingWindow ? '#F5A623' : '#00C9A7',
          }}>
            {inEatingWindow ? '● Eating window open' : '● Fasting'}
          </div>
        </div>

        {inEatingWindow && windowOpen !== null && (
          <div style={{ marginBottom: 12, padding: '10px 12px', background: '#2a2010', borderRadius: 6 }}>
            <span style={{ fontSize: 13, color: '#F5A623' }}>
              Window open for <strong>{formatDuration(windowOpen)}</strong>
            </span>
            {suggested.closeWindow && (
              <span style={{ fontSize: 11, color: '#5a7a96', marginLeft: 8 }}>
                · suggested close {suggested.closeWindow}
              </span>
            )}
          </div>
        )}

        {!inEatingWindow && currentFast !== null && (
          <div style={{ marginBottom: 12, padding: '10px 12px', background: '#0a2a25', borderRadius: 6 }}>
            <span style={{ fontSize: 13, color: '#00C9A7' }}>
              Fasting for <strong>{formatDuration(currentFast)}</strong>
            </span>
          </div>
        )}

        {!firstMeal && (
          <div style={{ fontSize: 12, color: '#5a7a96', marginBottom: 12 }}>
            No meals logged today. Log your first meal to start tracking your eating window.
          </div>
        )}

        <TimeDisplay
          label="Fast broken"
          time={firstMeal}
          onEdit={handleSetFastBreak}
        />
        <TimeDisplay
          label="Window closed"
          time={windowClose || lastMeal}
          onEdit={handleSetWindowClose}
        />
        {window.fastingMinutes && (
          <div style={{ padding: '8px 0', fontSize: 12, color: '#5a7a96' }}>
            Fast before this window: <span style={{ color: '#00C9A7' }}>{formatDuration(window.fastingMinutes)}</span>
          </div>
        )}
      </div>

      {/* Suggested meal times */}
      <div className="card">
        <div className="label-sm" style={{ marginBottom: 10 }}>
          Suggested times · {dayTypeLabel}
        </div>
        {suggested.meals.map((time, i) => {
          const labels = ['Meal 1 (break fast)', 'Meal 2', 'Meal 3', 'Meal 4'];
          return (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '7px 0', borderBottom: '1px solid #1e2d3d',
              fontSize: 13,
            }}>
              <span style={{ color: '#5a7a96' }}>{labels[i] || `Meal ${i + 1}`}</span>
              <span style={{ color: '#F0EDE6', fontWeight: 500 }}>{time}</span>
            </div>
          );
        })}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '7px 0', fontSize: 13,
        }}>
          <span style={{ color: '#5a7a96' }}>Close window</span>
          <span style={{ color: '#F0EDE6', fontWeight: 500 }}>{suggested.closeWindow}</span>
        </div>
        <p style={{ fontSize: 11, color: '#3a5a76', marginTop: 8, lineHeight: 1.5 }}>
          Suggestions adjust by day type. Edit in Profile → Schedule.
        </p>
      </div>
    </div>
  );
}
