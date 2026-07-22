import { useState, useCallback, useEffect } from 'react';
import FoodSearch from './FoodSearch';
import MealItem from './MealItem';
import ScorePanel from './ScorePanel';
import MealFlag from './MealFlag';
import { getMealScore, FOOD_DB } from '../foodData';
import {
  insertMealLog, insertSavedMeal, updateFastingWindowFromMeal, closeEatingWindow,
  getMealLogs, getHydration, upsertHydration,
} from '../lib/db';
import { localDateKey, todayKey } from '../utils/storage';

const PRESET_MEALS = [
  {
    name: 'High-Insulin Breakfast',
    color: '#E84545',
    items: [
      { food: FOOD_DB.find(f => f.id === 8),   portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 202),  portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 3),   portionIdx: 1 },
    ],
  },
  {
    name: 'Low-Insulin Breakfast',
    color: '#00C9A7',
    items: [
      { food: FOOD_DB.find(f => f.id === 7),   portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 34),  portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 166), portionIdx: 0 },
      { food: FOOD_DB.find(f => f.id === 100), portionIdx: 0 },
    ],
  },
  {
    name: "Athlete's Dinner",
    color: '#F5A623',
    items: [
      { food: FOOD_DB.find(f => f.id === 31),  portionIdx: 2 },
      { food: FOOD_DB.find(f => f.id === 2),   portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 61),  portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 186), portionIdx: 1 },
    ],
  },
];

function buildItems(preset) {
  return preset.items
    .filter(i => i.food)
    .map(i => ({
      food: i.food,
      portionIdx: i.portionIdx,
      grams: i.food.portions[i.portionIdx]?.g ?? i.food.portions[0].g,
      quantity: 1,
    }));
}

function getEffectiveItems(items) {
  return items.map(i => ({
    ...i,
    grams: i.grams * (i.quantity ?? 1),
  }));
}

// ── Hydration counter (moved here from Daily Log — lives on the Meal
// Scorer tab now since that's where meals get logged) ────────────────
function SupabaseHydrationCounter({ userId }) {
  const [oz, setOz]           = useState(0);
  const [loading, setLoading] = useState(true);
  const GOAL = 64;

  useEffect(() => {
    if (!userId) return;
    getHydration(userId, todayKey()).then(({ data }) => {
      setOz(data || 0);
      setLoading(false);
    });
  }, [userId]);

  const add = async (amount) => {
    const updated = oz + amount;
    setOz(updated);
    await upsertHydration(userId, todayKey(), updated);
  };

  const reset = async () => {
    setOz(0);
    await upsertHydration(userId, todayKey(), 0);
  };

  const pct = Math.min((oz / GOAL) * 100, 100);
  const color = pct >= 100 ? '#00C9A7' : pct >= 50 ? '#F5A623' : '#5a7a96';

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div className="label-sm" style={{ marginBottom: 4 }}>Hydration</div>
          <div style={{ fontSize: 11, color: '#5a7a96' }}>Daily goal: {GOAL} oz / {GOAL / 8} cups</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color, lineHeight: 1 }}>{loading ? '…' : oz} oz</div>
          <div style={{ fontSize: 11, color: '#5a7a96' }}>{Math.round(oz / 8 * 10) / 10} cups</div>
        </div>
      </div>
      <div className="progress-track" style={{ marginBottom: 14 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[8, 12, 16, 20].map(amt => (
          <button key={amt} onClick={() => add(amt)} style={{
            flex: 1, background: '#1a2d3d', border: '1px solid #1e3a52',
            borderRadius: 6, color: '#F0EDE6', padding: '8px 4px',
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          }}>+{amt} oz</button>
        ))}
        <button onClick={reset} style={{
          background: 'none', border: '1px solid #1e3a52', borderRadius: 6,
          color: '#5a7a96', padding: '8px 12px', fontSize: 12,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>Reset</button>
      </div>
      {pct >= 100 && (
        <div style={{ marginTop: 10, padding: '6px 10px', background: '#0a2a25', borderRadius: 6, fontSize: 11, color: '#00C9A7' }}>
          ✓ Daily hydration goal reached
        </div>
      )}
    </div>
  );
}

export default function MealScorer({ profile, targets, user, onNavigate, preloadMeal, onPreloadConsumed }) {
  const [items, setItems]               = useState([]);
  const [mealName, setMealName]         = useState('My Meal');
  const [editingName, setEditingName]   = useState(false);
  const [flag, setFlag]                 = useState(null);
  const [showLogPanel, setShowLogPanel] = useState(false);
  const [logTimestamp, setLogTimestamp] = useState('');
  const [fastingSafe, setFastingSafe]   = useState(false);
  const [toast, setToast]               = useState(null);
  const [logging, setLogging]           = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [closing, setClosing]             = useState(false);
  const [mealCount, setMealCount]         = useState(null); // # meals already logged today
  const [nameTouched, setNameTouched]     = useState(false); // user manually edited the name

  const nextMealName = (count) => `Meal #${(count ?? 0) + 1}`;

  // On mount (and whenever the user changes), find out how many meals are
  // already logged today so the scorer can default to "Meal #N" instead of
  // always "My Meal" — this is what was causing every unrenamed meal to
  // look identical in the Daily Log.
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    getMealLogs(user.id, localDateKey()).then(({ data }) => {
      if (cancelled) return;
      const count = data?.length || 0;
      setMealCount(count);
      if (!nameTouched && !preloadMeal) setMealName(nextMealName(count));
    });
    return () => { cancelled = true; };
  }, [user?.id]);

  // Consume preloaded meal from Quick Log or Dashboard
  useEffect(() => {
    if (!preloadMeal) return;
    setItems((preloadMeal.items || []).map(i => ({ ...i, quantity: i.quantity || 1 })));
    setMealName(preloadMeal.name || 'My Meal');
    setNameTouched(true); // treat a loaded meal's name as intentional, don't clobber it
    setFlag(null);
    setShowLogPanel(false);
    onPreloadConsumed?.();
  }, [preloadMeal]);

  const score = getMealScore(getEffectiveItems(items));

  const showToast = (msg, color = '#00C9A7') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const addItem = useCallback((item) => {
    setItems(prev => [...prev, { ...item, quantity: 1 }]);
  }, []);

  const removeItem = useCallback((idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const changePortion = useCallback((idx, portionIdx) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      return { ...item, portionIdx, grams: item.food.portions[portionIdx]?.g ?? item.grams };
    }));
  }, []);

  const changeQuantity = useCallback((idx, quantity) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      return { ...item, quantity };
    }));
  }, []);

  const swapIngredient = useCallback((idx, newFood) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      return { food: newFood, portionIdx: 0, grams: newFood.portions[0].g, quantity: item.quantity ?? 1 };
    }));
  }, []);

  const loadPreset = (preset) => {
    setItems(buildItems(preset));
    setMealName(preset.name);
    setFlag(null);
    setShowLogPanel(false);
  };

  const clearMeal = () => {
    setItems([]);
    setMealName(nextMealName(mealCount));
    setNameTouched(false);
    setFlag(null);
    setShowLogPanel(false);
  };

  const handleLogMeal = async () => {
    if (!items.length || !user?.id) return;
    setLogging(true);

    const ts = logTimestamp
      ? (() => {
          const [h, m] = logTimestamp.split(':').map(Number);
          const d = new Date(); d.setHours(h, m, 0, 0);
          return d.toISOString();
        })()
      : new Date().toISOString();

    const { error } = await insertMealLog(user.id, {
      name: mealName,
      items: getEffectiveItems(items),
      flag,
      timestamp: ts,
      fastingSafe,
    });

    setLogging(false);
    if (error) {
      showToast('Failed to log meal. Try again.', '#E84545');
    } else {
      // Update fasting window — skipped automatically if fastingSafe is true
      const date = localDateKey(new Date(ts));
      await updateFastingWindowFromMeal(user.id, date, ts, fastingSafe);
      showToast(fastingSafe ? '✓ Logged — fast window preserved' : '✓ Meal logged to Daily Log');

      // Full reset of the scorer for the next meal, with the name
      // auto-advanced to the next meal number for today.
      const newCount = (mealCount ?? 0) + 1;
      setMealCount(newCount);
      setItems([]);
      setFlag(null);
      setMealName(nextMealName(newCount));
      setNameTouched(false);
      setShowLogPanel(false);
      setLogTimestamp('');
      setFastingSafe(false);
    }
  };

  const handleCloseWindow = async (confirmedTime) => {
    if (!user?.id) return;
    setClosing(true);
    const date = localDateKey();
    await closeEatingWindow(user.id, date, confirmedTime);
    setClosing(false);
    setShowCloseConfirm(false);
    showToast('■ Eating window closed — fasting clock started');
  };

  const handleSaveFavorite = async () => {
    if (!items.length || !user?.id) return;
    const { error } = await insertSavedMeal(user.id, {
      name: mealName,
      items: getEffectiveItems(items),
    }, 'favorite');
    if (error) {
      showToast('Failed to save favorite.', '#E84545');
    } else {
      showToast('⭐ Saved as favorite');
    }
  };

  const handleSaveTemplate = async () => {
    if (!items.length || !user?.id) return;
    const { error } = await insertSavedMeal(user.id, {
      name: mealName,
      items: getEffectiveItems(items),
    }, 'template');
    if (error) {
      showToast('Failed to save template.', '#E84545');
    } else {
      showToast('📋 Saved as template');
    }
  };


  // ── Close window confirmation modal ─────────────────────
  const CloseWindowModal = () => {
    const now = new Date();
    const defaultTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const [closeTime, setCloseTime] = useState(defaultTime);

    const confirm = () => {
      const [h, m] = closeTime.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      handleCloseWindow(d.toISOString());
    };

    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }} onClick={e => e.target === e.currentTarget && setShowCloseConfirm(false)}>
        <div style={{
          background: '#0F1923', border: '1px solid #1e2d3d',
          borderRadius: 12, padding: 24, width: '100%', maxWidth: 360,
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#F0EDE6', marginBottom: 8 }}>
            Close eating window?
          </div>
          <div style={{ fontSize: 13, color: '#5a7a96', marginBottom: 20, lineHeight: 1.5 }}>
            This will start your fasting clock. Set the time your last meal ended.
          </div>
          <div style={{ marginBottom: 20 }}>
            <div className="label-sm" style={{ marginBottom: 6 }}>Window close time</div>
            <input type="time" value={closeTime}
              onChange={e => setCloseTime(e.target.value)}
              style={{
                background: '#1a2d3d', border: '1px solid #1e3a52',
                borderRadius: 6, color: '#F0EDE6', padding: '10px 14px',
                fontSize: 14, fontFamily: 'inherit', width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowCloseConfirm(false)} style={{
              flex: 1, background: 'none', border: '1px solid #1e3a52',
              borderRadius: 6, color: '#5a7a96', padding: '10px',
              fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}>Cancel</button>
            <button onClick={confirm} disabled={closing} style={{
              flex: 1, background: '#E84545', border: 'none',
              borderRadius: 6, color: '#fff', padding: '10px',
              fontSize: 13, fontWeight: 600, cursor: closing ? 'default' : 'pointer',
              fontFamily: 'inherit', opacity: closing ? 0.7 : 1,
            }}>
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
          color: toast.color, fontWeight: 600, zIndex: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
        }}>{toast.msg}</div>
      )}

      <div style={{ padding: '28px 0 20px', borderBottom: '1px solid #1e2d3d', marginBottom: 20 }}>
        <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>
          INSULIN IMPACT · MEAL ANALYZER
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Meal Insulin Scorer</h1>
        <p style={{ fontSize: 13, color: '#5a7a96', marginTop: 6, lineHeight: 1.5 }}>
          Build a meal and watch your net insulin impact score update in real time.
        </p>
      </div>

      {/* Responsive layout — single column on mobile, two columns on wider screens */}
      <style>{`
        @media (max-width: 640px) {
          .meal-scorer-grid { grid-template-columns: 1fr !important; }
          .score-panel-sticky { position: static !important; margin-top: 24px; }
        }
      `}</style>
      <div className="meal-scorer-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 220px', gap: 24, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            {editingName ? (
              <input autoFocus value={mealName}
                onChange={e => { setMealName(e.target.value); setNameTouched(true); }}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: '1px solid #00C9A7',
                  color: '#F0EDE6', fontSize: 16, fontWeight: 500,
                  fontFamily: 'inherit', outline: 'none', padding: '2px 0',
                }}
              />
            ) : (
              <span onClick={() => setEditingName(true)} title="Click to rename"
                style={{ fontSize: 16, fontWeight: 500, cursor: 'pointer', color: '#F0EDE6' }}>
                {mealName}
              </span>
            )}
            {items.length > 0 && (
              <button className="btn-ghost" onClick={clearMeal}
                style={{ marginLeft: 'auto', fontSize: 12, padding: '4px 10px' }}>
                Clear
              </button>
            )}
          </div>

          <FoodSearch onAdd={addItem} />

          {items.length === 0 ? (
            <div className="empty-state">
              Search for foods above to build your meal,<br />or load a preset below.
            </div>
          ) : (
            items.map((item, idx) => (
              <MealItem key={idx} item={item} idx={idx}
                onRemove={removeItem} onChangePortion={changePortion}
                onChangeQuantity={changeQuantity} onSwap={swapIngredient} />
            ))
          )}

          {items.length > 0 && score && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#0d1b27', border: '1px solid #1e2d3d', borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => setShowLogPanel(!showLogPanel)} style={{
                  width: '100%', background: '#00C9A7', border: 'none',
                  color: '#0F1923', padding: '12px 16px', fontSize: 14,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>▶ Log This Meal</button>

                {showLogPanel && (
                  <div style={{ padding: '14px 16px' }}>
                    <MealFlag selected={flag} onChange={setFlag} />
                    <div style={{ marginTop: 14 }}>
                      <div className="label-sm" style={{ marginBottom: 6 }}>Time</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="time" value={logTimestamp}
                          onChange={e => setLogTimestamp(e.target.value)}
                          style={{
                            background: '#1a2d3d', border: '1px solid #1e3a52',
                            borderRadius: 4, color: '#F0EDE6', padding: '6px 10px',
                            fontSize: 13, fontFamily: 'inherit',
                          }}
                        />
                        <span style={{ fontSize: 11, color: '#5a7a96' }}>leave blank for now</span>
                      </div>
                    </div>
                    {/* Fasting-safe toggle */}
                    <div
                      onClick={() => setFastingSafe(f => !f)}
                      style={{
                        marginTop: 14, padding: '10px 12px',
                        background: fastingSafe ? '#0a2a25' : '#0d1b27',
                        border: `1px solid ${fastingSafe ? '#00C9A7' : '#1e3a52'}`,
                        borderRadius: 6, cursor: 'pointer',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                      }}
                    >
                      <div style={{
                        width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                        border: `2px solid ${fastingSafe ? '#00C9A7' : '#3a5a76'}`,
                        background: fastingSafe ? '#00C9A7' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: 1,
                        transition: 'all 0.15s',
                      }}>
                        {fastingSafe && <span style={{ fontSize: 10, color: '#0F1923', fontWeight: 700 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: fastingSafe ? '#00C9A7' : '#5a7a96' }}>
                          Fasting-safe supplement
                        </div>
                        <div style={{ fontSize: 11, color: '#3a5a76', marginTop: 2, lineHeight: 1.4 }}>
                          Log without breaking your fast window. Use for supplements with negligible insulin impact (e.g. amino acids, electrolytes).
                        </div>
                      </div>
                    </div>

                    <button onClick={handleLogMeal} disabled={logging} style={{
                      marginTop: 14, width: '100%',
                      background: logging ? '#1a2d3d' : '#00C9A7',
                      border: 'none', borderRadius: 6,
                      color: logging ? '#5a7a96' : '#0F1923',
                      padding: '10px', fontSize: 13,
                      fontWeight: 600, cursor: logging ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                    }}>
                      {logging ? 'Logging…' : 'Confirm log'}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ghost" onClick={handleSaveFavorite} style={{ flex: 1, fontSize: 12 }}>
                  ⭐ Save as favorite
                </button>
                <button className="btn-ghost" onClick={handleSaveTemplate} style={{ flex: 1, fontSize: 12 }}>
                  📋 Save as template
                </button>
              </div>
              <button
                onClick={() => setShowCloseConfirm(true)}
                style={{
                  background: 'none', border: '1px solid #E84545',
                  borderRadius: 6, color: '#E84545', padding: '10px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit', width: '100%',
                }}
              >
                ■ Close eating window
              </button>
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <div className="label-sm" style={{ marginBottom: 10 }}>Load a preset meal</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PRESET_MEALS.map(p => (
                <button key={p.name} className="btn-ghost" onClick={() => loadPreset(p)}
                  style={{ fontSize: 12, borderColor: `${p.color}40`, color: p.color }}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="score-panel-sticky" style={{ position: 'sticky', top: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ScorePanel score={score} />
          {user?.id && <SupabaseHydrationCounter userId={user.id} />}
        </div>
      </div>
    </div>
  );
}
