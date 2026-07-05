import { useState, useCallback } from 'react';
import FastingTracker from './FastingTracker';
import HydrationCounter from './HydrationCounter';
import QuickLog from './QuickLog';
import FoodSearch from './FoodSearch';
import {
  getLog, getDailyTotals, deleteLogEntry, updateLogEntry,
  getFlagByValue, logMeal, MEAL_FLAGS,
} from '../utils/dailyLog';
import { saveFavorite } from '../utils/dailyLog';
import { storageGet, todayKey, formatTime } from '../utils/storage';
import { getMealScore, calcGL, calcFiber, calcCarbs, calcProtein, calcFat } from '../foodData';

// ── Shared sub-components ────────────────────────────────

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

// ── Meal edit modal ──────────────────────────────────────

function EditMealModal({ entry, onSave, onClose }) {
  const [items, setItems] = useState(() =>
    entry.items.map(i => ({
      food: {
        id: i.foodId,
        name: i.foodName,
        gi: i.gi,
        carbP100: i.carbP100,
        fiberP100: i.fiberP100,
        proteinP100: i.proteinP100,
        fatP100: i.fatP100,
        portions: [{ label: 'Logged portion', g: i.grams }],
      },
      grams: i.grams,
      portionIdx: 0,
      quantity: 1,
    }))
  );
  const [mealName, setMealName] = useState(entry.name);
  const [flag, setFlag] = useState(entry.flag || null);

  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const addItem = (item) => setItems(prev => [...prev, item]);

  const score = getMealScore(items);

  const handleSave = () => {
    const updated = {
      name: mealName,
      flag,
      items: items.map(i => ({
        foodId: i.food.id,
        foodName: i.food.name,
        grams: i.grams,
        portionIdx: i.portionIdx,
        gi: i.food.gi,
        carbP100: i.food.carbP100,
        fiberP100: i.food.fiberP100,
        proteinP100: i.food.proteinP100,
        fatP100: i.food.fatP100,
      })),
      score: score ? {
        netScore: score.netScore,
        totalGL: score.totalGL,
        totalFiber: score.totalFiber,
        totalCarbs: score.totalCarbs,
        totalProtein: score.totalProtein,
        totalFat: score.totalFat,
        avgGI: score.avgGI,
        fiberOffset: score.fiberOffset,
        rating: score.rating,
      } : entry.score,
    };
    onSave(updated);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end',
      justifyContent: 'center',
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#0F1923',
        border: '1px solid #1e2d3d',
        borderRadius: '12px 12px 0 0',
        width: '100%',
        maxWidth: 720,
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '20px 16px 32px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div className="label-sm" style={{ color: '#00C9A7', marginBottom: 4 }}>EDIT MEAL</div>
            <input
              value={mealName}
              onChange={e => setMealName(e.target.value)}
              style={{
                background: 'none', border: 'none',
                borderBottom: '1px solid #1e3a52',
                color: '#F0EDE6', fontSize: 16, fontWeight: 500,
                fontFamily: 'inherit', outline: 'none', padding: '2px 0',
                width: 200,
              }}
            />
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#5a7a96',
            fontSize: 24, cursor: 'pointer', lineHeight: 1,
          }}>×</button>
        </div>

        {/* Search to add foods */}
        <FoodSearch onAdd={addItem} />

        {/* Current items */}
        {items.map((item, idx) => {
          const gl = item.food.gi !== null ? calcGL(item.food, item.grams) : null;
          const carbs = calcCarbs(item.food, item.grams);
          const fiber = calcFiber(item.food, item.grams);
          return (
            <div key={idx} className="card" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#F0EDE6' }}>{item.food.name}</div>
                  <div style={{ fontSize: 11, color: '#5a7a96', marginTop: 2 }}>
                    {item.grams}g · C {carbs.toFixed(1)}g · F {fiber.toFixed(1)}g
                    {gl !== null && ` · GL ${gl.toFixed(1)}`}
                  </div>
                </div>
                <button onClick={() => removeItem(idx)} style={{
                  background: 'none', border: 'none', color: '#5a7a96',
                  fontSize: 18, cursor: 'pointer',
                }}>×</button>
              </div>
            </div>
          );
        })}

        {/* Flag selector */}
        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <div className="label-sm" style={{ marginBottom: 8 }}>Meal context</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button
              onClick={() => setFlag(null)}
              style={{
                padding: '4px 12px', borderRadius: 4, fontSize: 11,
                border: `1px solid ${!flag ? '#00C9A7' : '#1e3a52'}`,
                background: !flag ? '#0a2a25' : 'none',
                color: !flag ? '#00C9A7' : '#5a7a96',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >None</button>
            {MEAL_FLAGS.map(f => (
              <button key={f.value} onClick={() => setFlag(flag === f.value ? null : f.value)}
                style={{
                  padding: '4px 12px', borderRadius: 4, fontSize: 11,
                  border: `1px solid ${flag === f.value ? f.color : '#1e3a52'}`,
                  background: flag === f.value ? `${f.color}20` : 'none',
                  color: flag === f.value ? f.color : '#5a7a96',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >{f.icon} {f.label}</button>
            ))}
          </div>
        </div>

        {/* Live score preview */}
        {score && (
          <div style={{
            padding: '10px 12px', background: '#0d1b27',
            borderRadius: 6, marginBottom: 14,
            display: 'flex', gap: 16, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 12, color: '#5a7a96' }}>
              Net score: <strong style={{ color: score.netScore < 10 ? '#00C9A7' : score.netScore <= 20 ? '#F5A623' : '#E84545' }}>
                {score.netScore.toFixed(1)}
              </strong>
            </span>
            <span style={{ fontSize: 12, color: '#5a7a96' }}>P {score.totalProtein.toFixed(0)}g</span>
            <span style={{ fontSize: 12, color: '#5a7a96' }}>C {score.totalCarbs.toFixed(0)}g</span>
            <span style={{ fontSize: 12, color: '#5a7a96' }}>F {score.totalFat.toFixed(0)}g</span>
          </div>
        )}

        <button onClick={handleSave} style={{
          width: '100%', background: '#00C9A7', border: 'none',
          borderRadius: 6, color: '#0F1923', padding: '12px',
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Save changes
        </button>
      </div>
    </div>
  );
}

// ── Logged meal card ─────────────────────────────────────

function LoggedMealCard({ entry, onDelete, onUpdateTimestamp, onEdit, onFavorite }) {
  const [editingTime, setEditingTime] = useState(false);
  const [timeVal, setTimeVal] = useState('');
  const [favSaved, setFavSaved] = useState(false);
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
            <span style={{ fontSize: 14, fontWeight: 500, color: '#F0EDE6' }}>{entry.name}</span>
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

          {/* Timestamp editor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {editingTime ? (
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
            ) : (
              <button onClick={startEditTime} style={{
                background: 'none', border: 'none', color: '#5a7a96',
                fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                textDecoration: 'underline dotted', padding: 0,
              }}>
                {formatTime(entry.timestamp)}
              </button>
            )}
            <span style={{ fontSize: 10, color: '#3a5a76' }}>tap to edit time</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          {/* Favorite */}
          <button
            onClick={handleFavorite}
            title="Save as favorite"
            style={{
              background: favSaved ? '#0a2a25' : 'none',
              border: `1px solid ${favSaved ? '#00C9A7' : '#1e3a52'}`,
              borderRadius: 4, color: favSaved ? '#00C9A7' : '#5a7a96',
              fontSize: 14, cursor: 'pointer', padding: '3px 8px',
              transition: 'all 0.2s',
            }}
          >
            {favSaved ? '✓' : '⭐'}
          </button>
          {/* Edit */}
          <button
            onClick={() => onEdit(entry)}
            title="Edit meal"
            style={{
              background: 'none', border: '1px solid #1e3a52',
              borderRadius: 4, color: '#5a7a96',
              fontSize: 12, cursor: 'pointer', padding: '3px 8px',
            }}
          >
            ✎
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(entry.id)}
            title="Delete meal"
            style={{
              background: 'none', border: 'none', color: '#5a7a96',
              fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 4px',
            }}
          >×</button>
        </div>
      </div>
    </div>
  );
}

// ── Main DailyLog screen ─────────────────────────────────

export default function DailyLog({ profile, onNavigate }) {
  const [log, setLog]           = useState(() => getLog(todayKey()));
  const [activeTab, setActiveTab] = useState('log');
  const [editingEntry, setEditingEntry] = useState(null);
  const [refreshKey, setRefreshKey]     = useState(0);
  const [toast, setToast]               = useState(null);

  const savedProfile = profile || (() => {
    try {
      const p = localStorage.getItem('mis_profile');
      return p ? JSON.parse(p) : null;
    } catch { return null; }
  })();

  const targets = { calories: 2447, protein: 175, carbs: 196, fat: 107 };

  const showToast = (msg, color = '#00C9A7') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

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

  const handleEdit = (entry) => {
    setEditingEntry(entry);
  };

  const handleSaveEdit = (updates) => {
    updateLogEntry(todayKey(), editingEntry.id, updates);
    setEditingEntry(null);
    refresh();
    showToast('✓ Meal updated');
  };

  const handleFavorite = (entry) => {
    saveFavorite({
      name: entry.name,
      items: entry.items.map(i => ({
        food: {
          id: i.foodId,
          name: i.foodName,
          gi: i.gi,
          carbP100: i.carbP100,
          fiberP100: i.fiberP100,
          proteinP100: i.proteinP100,
          fatP100: i.fatP100,
          portions: [{ label: 'Logged portion', g: i.grams }],
        },
        grams: i.grams,
        portionIdx: 0,
      })),
    });
    showToast('⭐ Saved as favorite');
  };

  const handleQuickLog = (meal) => {
    logMeal(meal);
    refresh();
  };

  const totals = getDailyTotals(todayKey());
  const totalCals = Math.round((totals.protein * 4) + (totals.carbs * 4) + (totals.fat * 9));
  const avgScore  = totals.mealCount > 0 ? totals.netScore / totals.mealCount : null;
  const scoreColor = avgScore === null ? '#5a7a96'
    : avgScore < 10 ? '#00C9A7' : avgScore <= 20 ? '#F5A623' : '#E84545';

  const tabBtn = (id, label) => (
    <button onClick={() => setActiveTab(id)} style={{
      flex: 1, background: 'none', border: 'none',
      borderBottom: activeTab === id ? '2px solid #00C9A7' : '2px solid transparent',
      color: activeTab === id ? '#F0EDE6' : '#5a7a96',
      padding: '10px 4px', fontSize: 12, cursor: 'pointer',
      fontFamily: 'inherit', fontWeight: activeTab === id ? 600 : 400,
      transition: 'all 0.15s',
    }}>{label}</button>
  );

  return (
    <div className="screen">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#1a2d3d', border: `1px solid ${toast.color}`,
          borderRadius: 8, padding: '10px 20px', fontSize: 13,
          color: toast.color, fontWeight: 600, zIndex: 400,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
        }}>{toast.msg}</div>
      )}

      {/* Edit modal */}
      {editingEntry && (
        <EditMealModal
          entry={editingEntry}
          onSave={handleSaveEdit}
          onClose={() => setEditingEntry(null)}
        />
      )}

      {/* Header */}
      <div style={{ padding: '28px 0 16px', borderBottom: '1px solid #1e2d3d', marginBottom: 16 }}>
        <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Daily Log</h1>
      </div>

      {/* Summary cards */}
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

      {/* Tab nav */}
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
                  onEdit={handleEdit}
                  onFavorite={handleFavorite}
                />
              ))
          )}
        </div>
      )}

      {activeTab === 'fasting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FastingTracker key={refreshKey} profile={savedProfile} onRefresh={refresh} />
          <HydrationCounter onUpdate={refresh} />
        </div>
      )}

      {activeTab === 'quick' && (
        <QuickLog onLogMeal={handleQuickLog} onRefresh={refresh} />
      )}
    </div>
  );
}
