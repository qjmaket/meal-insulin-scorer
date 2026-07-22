import { useState, useEffect, useCallback } from 'react';
import FastingTracker from './FastingTracker';
import QuickLog from './QuickLog';
import {
  getMealLogs, deleteMealLog, updateMealLog,
  insertMealLog, insertSavedMeal, calcDailyTotals,
  getFastingWindow, upsertFastingWindow,
  getSavedMeals, deleteSavedMeal, updateSavedMealName,
  getRecentMealLogs, updateFastingWindowFromMeal, closeEatingWindow,
} from '../lib/db';
import { MEAL_FLAGS, getFlagByValue } from '../utils/dailyLog';
import { todayKey, formatTime, localDateKey } from '../utils/storage';
import { getMealScore } from '../foodData';

// ── Shared sub-components ────────────────────────────────

function MacroBar({ label, value, target, color }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const over = value > target;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#5a7a96' }}>{label}</span>
        <span style={{ fontSize: 12 }}>
          <span style={{ color: over ? '#E84545' : '#F0EDE6', fontWeight: 500 }}>{Math.round(value)}</span>
          <span style={{ color: '#3a5a76' }}> / {target}g</span>
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: over ? '#E84545' : color }} />
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

function LoggedMealCard({ entry, onDelete, onUpdateTimestamp, onFavorite }) {
  const [editingTime, setEditingTime] = useState(false);
  const [timeVal, setTimeVal]         = useState('');
  const [favSaved, setFavSaved]       = useState(false);
  const [deleting, setDeleting]       = useState(false);
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

  const handleFavorite = () => {
    onFavorite(entry);
    setFavSaved(true);
    setTimeout(() => setFavSaved(false), 2000);
  };

  const ratingColor = !entry.score ? '#5a7a96'
    : entry.score.rating === 'Low' ? '#00C9A7'
    : entry.score.rating === 'Moderate' ? '#F5A623' : '#E84545';

  const ratingBg = !entry.score ? '#1a2d3d'
    : entry.score.rating === 'Low' ? '#0a2a25'
    : entry.score.rating === 'Moderate' ? '#2a2010' : '#2a1010';

  return (
    <div className="card" style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#F0EDE6' }}>{entry.name}</span>
            {entry.score && (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: ratingBg, color: ratingColor, fontWeight: 600 }}>
                {entry.score.netScore.toFixed(1)}
              </span>
            )}
            {flag && (
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${flag.color}20`, color: flag.color, fontWeight: 600 }}>
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
              <input type="time" value={timeVal}
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
            ) : (
              <button onClick={startEditTime} style={{
                background: 'none', border: 'none', color: '#5a7a96',
                fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                textDecoration: 'underline dotted', padding: 0,
              }}>{formatTime(entry.timestamp)}</button>
            )}
            <span style={{ fontSize: 10, color: '#3a5a76' }}>tap to edit time</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <button onClick={handleFavorite} title="Save as favorite" style={{
            background: favSaved ? '#0a2a25' : 'none',
            border: `1px solid ${favSaved ? '#00C9A7' : '#1e3a52'}`,
            borderRadius: 4, color: favSaved ? '#00C9A7' : '#5a7a96',
            fontSize: 14, cursor: 'pointer', padding: '3px 8px', transition: 'all 0.2s',
          }}>{favSaved ? '✓' : '⭐'}</button>
          <button onClick={() => onDelete(entry.id)} title="Delete meal" style={{
            background: 'none', border: 'none', color: '#5a7a96',
            fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 4px',
          }}>×</button>
        </div>
      </div>
    </div>
  );
}

// ── Supabase-backed QuickLog ──────────────────────────────

function SupabaseQuickLog({ userId, onLogMeal, onLoadInScorer }) {
  const [tab, setTab]             = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [recent, setRecent]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [favRes, tmplRes, recentRes] = await Promise.all([
      getSavedMeals(userId, 'favorite'),
      getSavedMeals(userId, 'template'),
      getRecentMealLogs(userId, 7),
    ]);
    setFavorites(favRes.data || []);
    setTemplates(tmplRes.data || []);
    setRecent(recentRes.data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await deleteSavedMeal(userId, id);
    load();
  };

  const handleLog = (meal) => {
    onLogMeal({
      name: meal.name,
      items: (meal.items || []).map(i => ({
        food: i.food || { id: i.foodId, name: i.foodName, gi: 0, carbP100: 0, fiberP100: 0, proteinP100: 0, fatP100: 0, portions: [{ label: 'serving', g: i.grams }] },
        grams: i.grams,
        portionIdx: i.portionIdx || 0,
      })),
    });
  };

  const handleLoadInScorer = (meal) => {
    onLoadInScorer?.({
      name: meal.name,
      items: (meal.items || []).map(i => ({
        food: i.food || { id: i.foodId, name: i.foodName, gi: 0, carbP100: 0, fiberP100: 0, proteinP100: 0, fatP100: 0, portions: [{ label: 'serving', g: i.grams }] },
        grams: i.grams,
        portionIdx: i.portionIdx || 0,
        quantity: i.quantity || 1,
      })),
    });
  };

  const startRename = (meal) => {
    setRenamingId(meal.id);
    setRenameVal(meal.name);
  };

  const commitRename = async (id) => {
    if (!renameVal.trim()) { setRenamingId(null); return; }
    await updateSavedMealName(userId, id, renameVal.trim());
    setRenamingId(null);
    load();
  };

  const scoreColor = (score) => {
    if (!score) return '#5a7a96';
    return score.rating === 'Low' ? '#00C9A7' : score.rating === 'Moderate' ? '#F5A623' : '#E84545';
  };

  const scoreBg = (score) => {
    if (!score) return '#1a2d3d';
    return score.rating === 'Low' ? '#0a2a25' : score.rating === 'Moderate' ? '#2a2010' : '#2a1010';
  };

  const SavedMealRow = ({ meal, onLog, onDelete, onLoad, showLoad }) => (
    <div style={{ padding: '10px 0', borderBottom: '1px solid #1e2d3d' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        {/* Inline rename */}
        {renamingId === meal.id ? (
          <input
            autoFocus
            value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onBlur={() => commitRename(meal.id)}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(meal.id); if (e.key === 'Escape') setRenamingId(null); }}
            style={{
              flex: 1, background: '#1a2d3d', border: '1px solid #00C9A7',
              borderRadius: 4, color: '#F0EDE6', padding: '3px 8px',
              fontSize: 13, fontFamily: 'inherit',
            }}
          />
        ) : (
          <button
            onClick={() => startRename(meal)}
            title="Tap to rename"
            style={{
              flex: 1, background: 'none', border: 'none', textAlign: 'left',
              color: '#F0EDE6', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'inherit', padding: 0,
            }}
          >
            {meal.name}
            <span style={{ fontSize: 10, color: '#3a5a76', marginLeft: 6 }}>✎</span>
          </button>
        )}
        {meal.score && (
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: scoreBg(meal.score), color: scoreColor(meal.score), fontWeight: 600, flexShrink: 0 }}>
            {meal.score.netScore?.toFixed(1)}
          </span>
        )}
      </div>
      {meal.score && (
        <div style={{ fontSize: 11, color: '#5a7a96', display: 'flex', gap: 8, marginBottom: 6 }}>
          <span>P {meal.score.totalProtein?.toFixed(0)}g</span>
          <span>C {meal.score.totalCarbs?.toFixed(0)}g</span>
          <span>F {meal.score.totalFat?.toFixed(0)}g</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => onLog(meal)} style={{
          background: '#00C9A7', border: 'none', borderRadius: 4,
          color: '#0F1923', fontSize: 11, fontWeight: 600,
          padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit',
        }}>Log now</button>
        {showLoad && (
          <button onClick={() => onLoad(meal)} style={{
            background: 'none', border: '1px solid #1e3a52', borderRadius: 4,
            color: '#5a7a96', fontSize: 11,
            padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit',
          }}>Edit in scorer ↗</button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(meal.id)} style={{
            background: 'none', border: 'none', color: '#3a5a76',
            fontSize: 16, cursor: 'pointer', marginLeft: 'auto',
          }}>×</button>
        )}
      </div>
    </div>
  );

  const RecentRow = ({ meal }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #1e2d3d' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#F0EDE6', marginBottom: 2 }}>{meal.name}</div>
        {meal.score && (
          <div style={{ fontSize: 11, color: '#5a7a96', display: 'flex', gap: 8 }}>
            <span>P {meal.score.totalProtein?.toFixed(0)}g</span>
            <span>C {meal.score.totalCarbs?.toFixed(0)}g</span>
          </div>
        )}
      </div>
      {meal.score && (
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: scoreBg(meal.score), color: scoreColor(meal.score), fontWeight: 600 }}>
          {meal.score.netScore?.toFixed(1)}
        </span>
      )}
      <button onClick={() => handleLog(meal)} style={{
        background: '#00C9A7', border: 'none', borderRadius: 4,
        color: '#0F1923', fontSize: 11, fontWeight: 600,
        padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit',
      }}>Log</button>
    </div>
  );

  const tabs = [
    { id: 'favorites', label: `⭐ Favorites (${favorites.length})` },
    { id: 'templates', label: `📋 Templates (${templates.length})` },
    { id: 'recent',    label: '🕐 Recent' },
  ];

  return (
    <div className="card">
      <div className="label-sm" style={{ marginBottom: 12 }}>Quick log</div>
      <div style={{ display: 'flex', borderBottom: '1px solid #1e2d3d', marginBottom: 12 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, background: 'none', border: 'none',
            borderBottom: tab === t.id ? '2px solid #00C9A7' : '2px solid transparent',
            color: tab === t.id ? '#F0EDE6' : '#5a7a96',
            padding: '6px 4px', fontSize: 11, cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: tab === t.id ? 600 : 400,
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {loading && <div style={{ fontSize: 12, color: '#5a7a96', padding: '12px 0', textAlign: 'center' }}>Loading…</div>}
        {!loading && tab === 'favorites' && (
          favorites.length === 0
            ? <div style={{ fontSize: 12, color: '#5a7a96', padding: '12px 0', textAlign: 'center', lineHeight: 1.6 }}>No favorites yet.<br />Score a meal and tap ⭐ Save as favorite.</div>
            : favorites.map(m => <SavedMealRow key={m.id} meal={m} onLog={handleLog} onDelete={handleDelete} onLoad={handleLoadInScorer} showLoad={!!onLoadInScorer} />)
        )}
        {!loading && tab === 'templates' && (
          templates.length === 0
            ? <div style={{ fontSize: 12, color: '#5a7a96', padding: '12px 0', textAlign: 'center', lineHeight: 1.6 }}>No templates yet.<br />Score a meal and tap 📋 Save as template.</div>
            : templates.map(m => <SavedMealRow key={m.id} meal={m} onLog={handleLog} onDelete={handleDelete} onLoad={handleLoadInScorer} showLoad={!!onLoadInScorer} />)
        )}
        {!loading && tab === 'recent' && (
          recent.length === 0
            ? <div style={{ fontSize: 12, color: '#5a7a96', padding: '12px 0', textAlign: 'center' }}>No meals logged in the last 7 days.</div>
            : recent.map(m => <RecentRow key={m.id} meal={m} />)
        )}
      </div>
    </div>
  );
}

// ── Main DailyLog screen ─────────────────────────────────
// Note: hydration tracking now lives on the Meal Scorer tab
// (SupabaseHydrationCounter moved to MealScorer.jsx).

export default function DailyLog({ profile, targets: propTargets, user, onNavigate, initialTab, onInitialTabConsumed }) {
  const [log, setLog]             = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab || 'log');

  // Clear initialTab in App.jsx after consuming it so repeat visits
  // don't keep forcing the same tab
  useEffect(() => {
    if (initialTab) onInitialTabConsumed?.();
  }, []);
  const [toast, setToast]           = useState(null);
  const [refreshKey, setRefreshKey]   = useState(0);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [closing, setClosing]         = useState(false);

  const today = todayKey();
  const userId = user?.id;

  // Use calculated targets from App.jsx, fall back to hardcoded defaults
  const targets = propTargets || {
    calories: 2447,
    protein: 175,
    carbs: 196,
    fat: 107,
  };

  const showToast = (msg, color = '#00C9A7') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const loadLog = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await getMealLogs(userId, today);
    setLog(data || []);
    setLoading(false);
  }, [userId, today]);

  useEffect(() => { loadLog(); }, [loadLog, refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  const handleDelete = async (entryId) => {
    const { error } = await deleteMealLog(userId, entryId);
    if (error) { showToast('Failed to delete meal.', '#E84545'); return; }
    setLog(prev => prev.filter(e => e.id !== entryId));
  };

  const handleUpdateTimestamp = async (entryId, newTs) => {
    const { error } = await updateMealLog(userId, entryId, { timestamp: newTs });
    if (error) { showToast('Failed to update time.', '#E84545'); return; }
    setLog(prev => prev.map(e => e.id === entryId ? { ...e, timestamp: newTs } : e));
  };

  const handleFavorite = async (entry) => {
    const { error } = await insertSavedMeal(userId, {
      name: entry.name,
      items: (entry.items || []).map(i => ({
        food: { id: i.foodId, name: i.foodName, gi: i.gi, carbP100: i.carbP100, fiberP100: i.fiberP100, proteinP100: i.proteinP100, fatP100: i.fatP100, portions: [{ label: 'serving', g: i.grams }] },
        grams: i.grams,
        portionIdx: 0,
      })),
    }, 'favorite');
    if (error) { showToast('Failed to save favorite.', '#E84545'); return; }
    showToast('⭐ Saved as favorite');
  };

  const handleQuickLog = async (meal) => {
    const ts = new Date().toISOString();
    const { error } = await insertMealLog(userId, {
      ...meal,
      timestamp: ts,
      fastingSafe: meal.fastingSafe || false,
    });
    if (error) { showToast('Failed to log meal.', '#E84545'); return; }
    // Update fasting window — skipped if fastingSafe
    const date = localDateKey(new Date(ts));
    await updateFastingWindowFromMeal(userId, date, ts, meal.fastingSafe || false);
    refresh();
    showToast('✓ Meal logged');
  };

  const handleCloseWindow = async (confirmedTime) => {
    setClosing(true);
    await closeEatingWindow(userId, today, confirmedTime);
    setClosing(false);
    setShowCloseConfirm(false);
    setRefreshKey(k => k + 1);
    showToast('■ Eating window closed — fasting clock started');
  };

  const totals = calcDailyTotals(log);
  const totalCals = Math.round((totals.protein * 4) + (totals.carbs * 4) + (totals.fat * 9));
  const avgScore  = totals.mealCount > 0 ? totals.netScore / totals.mealCount : null;
  const scoreColor = avgScore === null ? '#5a7a96'
    : avgScore < 10 ? '#00C9A7' : avgScore <= 20 ? '#F5A623' : '#E84545';

  const tabBtn = (id, label) => (
    <button onClick={() => {
      setActiveTab(id);
      // Re-fetch fasting window whenever user opens the Fasting tab,
      // so meals logged from MealScorer are reflected immediately.
      if (id === 'fasting') setRefreshKey(k => k + 1);
    }} style={{
      flex: 1, background: 'none', border: 'none',
      borderBottom: activeTab === id ? '2px solid #00C9A7' : '2px solid transparent',
      color: activeTab === id ? '#F0EDE6' : '#5a7a96',
      padding: '10px 4px', fontSize: 12, cursor: 'pointer',
      fontFamily: 'inherit', fontWeight: activeTab === id ? 600 : 400,
      transition: 'all 0.15s',
    }}>{label}</button>
  );

  const CloseWindowModal = () => {
    const now = new Date();
    const defaultTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const [closeTime, setCloseTime] = useState(defaultTime);
    const confirm = () => {
      const [h, m] = closeTime.split(':').map(Number);
      const d = new Date(); d.setHours(h, m, 0, 0);
      handleCloseWindow(d.toISOString());
    };
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }} onClick={e => e.target === e.currentTarget && setShowCloseConfirm(false)}>
        <div style={{ background: '#0F1923', border: '1px solid #1e2d3d', borderRadius: 12, padding: 24, width: '100%', maxWidth: 360 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#F0EDE6', marginBottom: 8 }}>Close eating window?</div>
          <div style={{ fontSize: 13, color: '#5a7a96', marginBottom: 20, lineHeight: 1.5 }}>
            This will start your fasting clock. Set the time your last meal ended.
          </div>
          <div style={{ marginBottom: 20 }}>
            <div className="label-sm" style={{ marginBottom: 6 }}>Window close time</div>
            <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)}
              style={{ background: '#1a2d3d', border: '1px solid #1e3a52', borderRadius: 6, color: '#F0EDE6', padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowCloseConfirm(false)} style={{ flex: 1, background: 'none', border: '1px solid #1e3a52', borderRadius: 6, color: '#5a7a96', padding: '10px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={confirm} disabled={closing} style={{ flex: 1, background: '#E84545', border: 'none', borderRadius: 6, color: '#fff', padding: '10px', fontSize: 13, fontWeight: 600, cursor: closing ? 'default' : 'pointer', fontFamily: 'inherit', opacity: closing ? 0.7 : 1 }}>
              {closing ? 'Closing…' : '■ Close window'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="screen">
      {showCloseConfirm && <CloseWindowModal />}
      {toast && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#1a2d3d', border: `1px solid ${toast.color}`,
          borderRadius: 8, padding: '10px 20px', fontSize: 13,
          color: toast.color, fontWeight: 600, zIndex: 400,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
        }}>{toast.msg}</div>
      )}

      <div style={{ padding: '28px 0 16px', borderBottom: '1px solid #1e2d3d', marginBottom: 16 }}>
        <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Daily Log</h1>
      </div>

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

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="label-sm" style={{ marginBottom: 12 }}>Today's progress</div>
        <CalorieBar value={totalCals} target={targets.calories} />
        <MacroBar label="Protein" value={totals.protein} target={targets.protein} color="#00C9A7" />
        <MacroBar label="Carbs"   value={totals.carbs}   target={targets.carbs}   color="#F5A623" />
        <MacroBar label="Fat"     value={totals.fat}     target={targets.fat}     color="#5a7a96" />
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #1e2d3d', marginBottom: 16 }}>
        {tabBtn('log',     `Meals (${log.length})`)}
        {tabBtn('fasting', 'Fasting')}
        {tabBtn('quick',   'Quick log')}
      </div>

      {activeTab === 'log' && (
        <div>
          {loading ? (
            <div style={{ fontSize: 13, color: '#5a7a96', textAlign: 'center', padding: '24px 0' }}>Loading meals…</div>
          ) : log.length === 0 ? (
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
                  onFavorite={handleFavorite}
                />
              ))
          )}
        </div>
      )}

      {activeTab === 'fasting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FastingTracker
            key={refreshKey}
            profile={profile}
            userId={userId}
            onRefresh={refresh}
          />
          <button
            onClick={() => setShowCloseConfirm(true)}
            style={{
              background: 'none', border: '1px solid #E84545',
              borderRadius: 6, color: '#E84545', padding: '12px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', width: '100%',
            }}
          >
            ■ Close eating window
          </button>
        </div>
      )}

      {activeTab === 'quick' && userId && (
        <SupabaseQuickLog userId={userId} onLogMeal={handleQuickLog} onLoadInScorer={(meal) => onNavigate('scorer', meal)} />
      )}
    </div>
  );
}
