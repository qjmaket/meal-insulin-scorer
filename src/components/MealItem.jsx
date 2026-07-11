import { useState, useRef, useEffect } from 'react';
import { searchFoods, calcGL, calcFiber, calcCarbs, calcProtein, calcFat } from '../foodData';
import { searchOpenFoodFacts } from '../utils/openFoodFacts';

function glBadgeClass(gl) {
  if (gl === null || gl === undefined) return '';
  if (gl < 10) return 'gl-low';
  if (gl <= 20) return 'gl-med';
  return 'gl-high';
}

export default function MealItem({ item, idx, onRemove, onChangePortion, onChangeQuantity, onSwap }) {
  const [swapping, setSwapping]       = useState(false);
  const [swapQuery, setSwapQuery]     = useState('');
  const [swapLocal, setSwapLocal]     = useState([]);
  const [swapOff, setSwapOff]         = useState([]);
  const [swapLoading, setSwapLoading] = useState(false);
  const swapTimer = useRef(null);

  // quantity defaults to 1 if not set
  const quantity = item.quantity ?? 1;
  const effectiveGrams = item.grams * quantity;

  // The input's displayed text is kept separate from the committed
  // numeric quantity. Without this, deleting "1" to type ".5" would
  // pass through an empty string, which used to immediately snap the
  // field back to "1" before a decimal point could be typed.
  const [qtyText, setQtyText] = useState(String(quantity));

  useEffect(() => {
    setQtyText(String(quantity));
  }, [item.quantity]);

  const gl      = item.food.gi !== null && item.food.gi !== undefined
    ? calcGL(item.food, effectiveGrams) : null;
  const fiber   = calcFiber(item.food, effectiveGrams);
  const carbs   = calcCarbs(item.food, effectiveGrams);
  const protein = calcProtein(item.food, effectiveGrams);
  const glClass = glBadgeClass(gl);

  const handleSwapSearch = async (q) => {
    setSwapQuery(q);
    if (q.length < 2) { setSwapLocal([]); setSwapOff([]); return; }
    setSwapLocal(searchFoods(q));
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(async () => {
      setSwapLoading(true);
      try {
        const off = await searchOpenFoodFacts(q);
        setSwapOff(off);
      } finally {
        setSwapLoading(false);
      }
    }, 500);
  };

  const doSwap = (newFood) => {
    onSwap(idx, newFood);
    setSwapping(false);
    setSwapQuery('');
    setSwapLocal([]);
    setSwapOff([]);
  };

  const swapResults = [
    ...swapLocal.slice(0, 4),
    ...swapOff.filter(o => !swapLocal.some(l =>
      l.name.toLowerCase() === o.name.toLowerCase()
    )).slice(0, 3),
  ];

  const handleQuantityInput = (val) => {
    // Always let the user type freely — including '', '.', '0.', etc. —
    // without forcing the field back to a committed value mid-edit.
    setQtyText(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onChangeQuantity(idx, num);
    }
  };

  const handleQuantityBlur = () => {
    const num = parseFloat(qtyText);
    if (isNaN(num) || num <= 0) {
      setQtyText('1');
      onChangeQuantity(idx, 1);
    } else {
      setQtyText(String(num));
    }
  };

  return (
    <div className="card" style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name and GL badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#F0EDE6' }}>
              {item.food.name}
            </span>
            {gl !== null ? (
              <span className={`gl-badge ${glClass}`}>GL {gl.toFixed(1)}</span>
            ) : (
              <span style={{
                fontSize: 11, padding: '3px 8px', borderRadius: 4,
                background: '#1a2d3d', color: '#5a7a96',
              }}>GI unknown</span>
            )}
          </div>

          {/* Macro line */}
          <div style={{ fontSize: 12, color: '#5a7a96', marginTop: 3, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {item.food.gi !== null && item.food.gi !== undefined && <span>GI {item.food.gi}</span>}
            <span>C {carbs.toFixed(1)}g</span>
            <span>F {fiber.toFixed(1)}g</span>
            <span>P {protein.toFixed(1)}g</span>
            {quantity !== 1 && (
              <span style={{ color: '#00C9A7' }}>× {quantity} = {effectiveGrams.toFixed(0)}g total</span>
            )}
          </div>

          {/* Portion controls */}
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Portion dropdown */}
            <select
              className="select"
              value={item.portionIdx}
              onChange={e => {
                onChangePortion(idx, parseInt(e.target.value));
              }}
              style={{ fontSize: 12, padding: '3px 8px' }}
            >
              {item.food.portions.map((p, i) => (
                <option key={i} value={i}>{p.label}</option>
              ))}
            </select>

            {/* Quantity multiplier */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, color: '#5a7a96' }}>×</span>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                value={qtyText}
                onChange={e => handleQuantityInput(e.target.value)}
                onBlur={handleQuantityBlur}
                style={{
                  background: '#1a2d3d',
                  border: '1px solid #1e3a52',
                  borderRadius: 4,
                  color: '#F0EDE6',
                  padding: '3px 6px',
                  fontSize: 12,
                  width: 56,
                  fontFamily: 'inherit',
                  textAlign: 'center',
                }}
                title="Quantity multiplier — e.g. enter 4 for 4 eggs, or .5 for half"
              />
              <span style={{ fontSize: 10, color: '#3a5a76' }}>qty</span>
            </div>

            {/* Swap button */}
            <button
              className="btn-ghost"
              onClick={() => setSwapping(!swapping)}
              style={{
                fontSize: 12, padding: '3px 10px',
                color: swapping ? '#00C9A7' : '#5a7a96',
                borderColor: swapping ? '#00C9A7' : '#1e3a52',
              }}
            >
              ⇄ Swap
            </button>
          </div>
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(idx)}
          style={{
            background: 'none', border: 'none', color: '#5a7a96',
            fontSize: 20, lineHeight: 1, padding: '0 4px',
            cursor: 'pointer', flexShrink: 0,
          }}
          aria-label={`Remove ${item.food.name}`}
        >×</button>
      </div>

      {/* Swap panel */}
      {swapping && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1a2d3d' }}>
          <div style={{ fontSize: 12, color: '#5a7a96', marginBottom: 6 }}>Swap with:</div>
          <input
            autoFocus
            className="input"
            value={swapQuery}
            onChange={e => handleSwapSearch(e.target.value)}
            placeholder="Search replacement…"
            style={{ fontSize: 13 }}
          />
          {(swapResults.length > 0 || swapLoading) && (
            <div style={{
              marginTop: 4, border: '1px solid #1e3a52', borderRadius: 6,
              overflow: 'hidden', maxHeight: 300, overflowY: 'auto',
            }}>
              {swapLoading && swapResults.length === 0 && (
                <div style={{ padding: '10px 12px', fontSize: 12, color: '#5a7a96' }}>Searching…</div>
              )}
              {swapResults.map(food => {
                const newGL = food.gi !== null && food.gi !== undefined
                  ? calcGL(food, food.portions[0].g) : null;
                const currentGL = gl ?? 0;
                const diff = newGL !== null ? newGL - currentGL : null;
                const diffColor = diff === null ? '#5a7a96'
                  : diff < -0.5 ? '#00C9A7' : diff > 0.5 ? '#E84545' : '#5a7a96';
                const diffLabel = diff === null ? 'No GI'
                  : diff > 0.5 ? `+${diff.toFixed(1)} GL`
                  : diff < -0.5 ? `${diff.toFixed(1)} GL` : '≈ same GL';
                return (
                  <div
                    key={food.id}
                    onClick={() => doSwap(food)}
                    style={{
                      padding: '9px 12px', cursor: 'pointer', fontSize: 13,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      color: '#F0EDE6', borderBottom: '1px solid #1a2d3d',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1a2d3d'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <span>{food.name}</span>
                    <span style={{ fontSize: 11, color: diffColor, fontWeight: 600 }}>{diffLabel}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
