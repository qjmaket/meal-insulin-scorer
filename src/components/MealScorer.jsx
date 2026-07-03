import { useState, useCallback } from 'react';
import FoodSearch from './FoodSearch';
import MealItem from './MealItem';
import ScorePanel from './ScorePanel';
import { getMealScore, calcGL, calcFiber, calcCarbs, FOOD_DB } from '../foodData';

const PRESET_MEALS = [
  {
    name: 'High-Insulin Breakfast',
    color: '#E84545',
    items: [
      { food: FOOD_DB.find(f => f.id === 8),  portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 202), portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 3),  portionIdx: 1 },
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
      { food: FOOD_DB.find(f => f.id === 31), portionIdx: 2 },
      { food: FOOD_DB.find(f => f.id === 2),  portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 61), portionIdx: 1 },
      { food: FOOD_DB.find(f => f.id === 186),portionIdx: 1 },
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
    }));
}

export default function MealScorer() {
  const [items, setItems]         = useState([]);
  const [mealName, setMealName]   = useState('My Meal');
  const [editingName, setEditingName] = useState(false);

  const score = getMealScore(items);

  const addItem = useCallback((item) => {
    setItems(prev => [...prev, item]);
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

  const swapIngredient = useCallback((idx, newFood) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      return { food: newFood, portionIdx: 0, grams: newFood.portions[0].g };
    }));
  }, []);

  const loadPreset = (preset) => {
    setItems(buildItems(preset));
    setMealName(preset.name);
  };

  const clearMeal = () => { setItems([]); setMealName('My Meal'); };

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '28px 0 20px', borderBottom: '1px solid #1e2d3d', marginBottom: 20 }}>
        <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>
          INSULIN IMPACT · MEAL ANALYZER
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Meal Insulin Scorer</h1>
        <p style={{ fontSize: 13, color: '#5a7a96', marginTop: 6, lineHeight: 1.5 }}>
          Build a meal and watch your net insulin impact score update in real time.
        </p>
      </div>

      {/* Two-column layout on wider screens */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 220px',
        gap: 24,
        alignItems: 'start',
      }}>
        {/* Left: meal builder */}
        <div>
          {/* Meal name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            {editingName ? (
              <input
                autoFocus
                value={mealName}
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
              <span
                onClick={() => setEditingName(true)}
                title="Click to rename"
                style={{
                  fontSize: 16, fontWeight: 500, cursor: 'pointer',
                  color: '#F0EDE6', borderBottom: '1px solid transparent',
                }}
              >
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
              <MealItem
                key={idx}
                item={item}
                idx={idx}
                onRemove={removeItem}
                onChangePortion={changePortion}
                onSwap={swapIngredient}
              />
            ))
          )}

          {/* Presets */}
          <div style={{ marginTop: 24 }}>
            <div className="label-sm" style={{ marginBottom: 10 }}>Load a preset meal</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PRESET_MEALS.map(p => (
                <button
                  key={p.name}
                  className="btn-ghost"
                  onClick={() => loadPreset(p)}
                  style={{ fontSize: 12, borderColor: `${p.color}40`, color: p.color }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: score panel */}
        <div style={{ position: 'sticky', top: 16 }}>
          <ScorePanel score={score} />
        </div>
      </div>

      {/* Mobile: score panel below on narrow screens */}
      <style>{`
        @media (max-width: 600px) {
          .meal-grid { grid-template-columns: 1fr !important; }
          .score-sticky { position: static !important; }
        }
      `}</style>
    </div>
  );
}
