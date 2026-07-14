import { useState, useRef, useEffect, useCallback } from 'react';
import { searchFoods, calcGL } from '../foodData';
import { searchOpenFoodFacts } from '../utils/openFoodFacts';

function glBadgeClass(gl) {
  if (gl < 10) return 'gl-low';
  if (gl <= 20) return 'gl-med';
  return 'gl-high';
}

function glLabel(gl) {
  if (gl < 10) return 'Low GL';
  if (gl <= 20) return 'Med GL';
  return 'High GL';
}

export default function FoodSearch({ onAdd }) {
  const [query, setQuery]             = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [offResults, setOffResults]   = useState([]);
  const [offLoading, setOffLoading]   = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portionIdx, setPortionIdx]   = useState(0);
  const [open, setOpen]               = useState(false);
  const ref = useRef(null);
  const offTimer = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback((q) => {
    setQuery(q);
    setSelectedFood(null);

    if (q.length < 2) {
      setLocalResults([]);
      setOffResults([]);
      setOpen(false);
      return;
    }

    // Instant local results
    const local = searchFoods(q);
    setLocalResults(local);
    setOpen(true);

    // Debounced OFF search (500ms)
    clearTimeout(offTimer.current);
    offTimer.current = setTimeout(async () => {
      setOffLoading(true);
      try {
        const off = await searchOpenFoodFacts(q);
        setOffResults(off);
      } finally {
        setOffLoading(false);
      }
    }, 500);
  }, []);

  const handleSelect = (food) => {
    setSelectedFood(food);
    setQuery(food.name);
    setPortionIdx(0);
    setOpen(false);
  };

  const handleAdd = () => {
    if (!selectedFood) return;
    const grams = selectedFood.portions[portionIdx].g;
    onAdd({ food: selectedFood, grams, portionIdx });
    setQuery('');
    setSelectedFood(null);
    setPortionIdx(0);
    setOpen(false);
    setLocalResults([]);
    setOffResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && selectedFood) handleAdd();
    if (e.key === 'Escape') setOpen(false);
  };

  const allResults = [
    ...localResults.slice(0, 5),
    ...offResults.filter(o => !localResults.some(l =>
      l.name.toLowerCase() === o.name.toLowerCase()
    )).slice(0, 4),
  ];

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => allResults.length && setOpen(true)}
          placeholder="Search foods or brands…"
        />
        {selectedFood && (
          <select
            className="select"
            value={portionIdx}
            onChange={e => setPortionIdx(parseInt(e.target.value))}
            style={{ minWidth: 160 }}
          >
            {selectedFood.portions.map((p, i) => (
              <option key={i} value={i}>{p.label}</option>
            ))}
          </select>
        )}
        <button
          className="btn-primary"
          onClick={handleAdd}
          disabled={!selectedFood}
          style={{ whiteSpace: 'nowrap' }}
        >
          Add
        </button>
      </div>

      {/* Dropdown */}
      {open && (query.length >= 2) && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
          background: '#0d1b27',
          border: '1px solid #1e3a52',
          borderRadius: 6,
          marginTop: 4,
          overflow: 'hidden',
          maxHeight: 380,
          overflowY: 'auto',
        }}>
          {/* Local results section */}
          {localResults.length > 0 && (
            <>
              <div style={{
                padding: '6px 14px 4px',
                fontSize: 10,
                color: '#3a5a76',
                fontWeight: 600,
                letterSpacing: '0.08em',
                background: '#0a1620',
              }}>
                DATABASE
              </div>
              {localResults.slice(0, 5).map(food => {
                const gl = calcGL(food, food.portions[0].g);
                const bc = glBadgeClass(gl);
                return (
                  <div
                    key={food.id}
                    onClick={() => handleSelect(food)}
                    style={{
                      padding: '10px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #1a2d3d',
                      fontSize: 14,
                      color: '#F0EDE6',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1a2d3d'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <div>
                      <span>{food.name}</span>
                      <span style={{ fontSize: 11, color: '#5a7a96', marginLeft: 8 }}>
                        GI {food.gi} · {food.category}
                      </span>
                    </div>
                    <span className={`gl-badge ${bc}`} style={{ fontSize: 11 }}>
                      {glLabel(gl)}
                    </span>
                  </div>
                );
              })}
            </>
          )}

          {/* OFF results section */}
          {(offResults.length > 0 || offLoading) && (
            <>
              <div style={{
                padding: '6px 14px 4px',
                fontSize: 10,
                color: '#3a5a76',
                fontWeight: 600,
                letterSpacing: '0.08em',
                background: '#0a1620',
              }}>
                {offLoading ? 'SEARCHING OPEN FOOD FACTS…' : 'OPEN FOOD FACTS'}
              </div>
              {offResults
                .filter(o => !localResults.some(l =>
                  l.name.toLowerCase() === o.name.toLowerCase()
                ))
                .slice(0, 4)
                .map(food => {
                  const hasGI = food.gi !== null;
                  const gl = hasGI ? calcGL(food, food.portions[0].g) : null;
                  const sourceLabel = food.giSource === 'lookup'    ? 'GI verified'
                    : food.giSource === 'estimated' ? 'GI estimated'
                    : 'GI unknown';
                  const sourceColor = food.giSource === 'lookup'    ? '#00C9A7'
                    : food.giSource === 'estimated' ? '#F5A623'
                    : '#5a7a96';
                  return (
                    <div
                      key={food.id}
                      onClick={() => handleSelect(food)}
                      style={{
                        padding: '10px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #1a2d3d',
                        fontSize: 14,
                        color: '#F0EDE6',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1a2d3d'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <div>
                        <span>{food.name}</span>
                        <span style={{ fontSize: 11, color: '#5a7a96', marginLeft: 8 }}>
                          {hasGI ? `GI ${food.gi}` : 'no carbs data'} · Open Food Facts
                        </span>
                        <div style={{ fontSize: 10, color: sourceColor, fontWeight: 600, marginTop: 2 }}>
                          {sourceLabel}
                        </div>
                      </div>
                      {gl !== null ? (
                        <span className={`gl-badge ${glBadgeClass(gl)}`} style={{ fontSize: 11 }}>
                          {glLabel(gl)}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 11, padding: '3px 8px', borderRadius: 4,
                          background: '#1a2d3d', color: '#5a7a96',
                        }}>
                          No GI
                        </span>
                      )}
                    </div>
                  );
                })}
            </>
          )}

          {/* Empty state */}
          {!offLoading && allResults.length === 0 && query.length >= 2 && (
            <div style={{ padding: '16px 14px', fontSize: 13, color: '#5a7a96', textAlign: 'center' }}>
              No results found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
