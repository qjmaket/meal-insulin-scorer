import { useState, useCallback } from 'react';
import FoodSearch from './FoodSearch';
import MealItem from './MealItem';
import ScorePanel from './ScorePanel';
import MealFlag from './MealFlag';
import { getMealScore, FOOD_DB } from '../foodData';
import { insertMealLog, insertSavedMeal } from '../lib/db';

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

export default function MealScorer({ profile, user, onNavigate }) {
  const [items, setItems]               = useState([]);
  const [mealName, setMealName]         = useState('My Meal');
  const [editingName, setEditingName]   = useState(false);
  const [flag, setFlag]                 = useState(null);
  const [showLogPanel, setShowLogPanel] = useState(false);
  const [logTimestamp, setLogTimestamp] = useState('');
  const [toast, setToast]               = useState(null);
  const [logging, setLogging]           = useState(false);

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
    setMealName('My Meal');
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
    });

    setLogging(false);
    if (error) {
      showToast('Failed to log meal. Try again.', '#E84545');
    } else {
      showToast('✓ Meal logged to Daily Log');
      setShowLogPanel(false);
      setLogTimestamp('');
    }
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

  return (
    <div className="screen">
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

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 220px', gap: 24, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            {editingName ? (
              <input autoFocus value={mealName}
                onChange={e => setMealName(e.target.value)}
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

        <div style={{ position: 'sticky', top: 16 }}>
          <ScorePanel score={score} />
        </div>
      </div>
    </div>
  );
}
