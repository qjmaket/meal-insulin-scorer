import { useState } from 'react';
import { getHydration, addHydration, setHydration } from '../utils/dailyLog';
import { todayKey } from '../utils/storage';

const GOAL_OZ = 64; // 8 cups / 64 oz daily target

export default function HydrationCounter({ onUpdate }) {
  const [oz, setOz] = useState(() => getHydration(todayKey()));

  const add = (amount) => {
    const updated = addHydration(amount, todayKey());
    setOz(updated);
    onUpdate?.();
  };

  const reset = () => {
    setHydration(0, todayKey());
    setOz(0);
    onUpdate?.();
  };

  const pct = Math.min((oz / GOAL_OZ) * 100, 100);
  const cups = Math.round(oz / 8 * 10) / 10;
  const color = pct >= 100 ? '#00C9A7' : pct >= 50 ? '#F5A623' : '#5a7a96';

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div className="label-sm" style={{ marginBottom: 4 }}>Hydration</div>
          <div style={{ fontSize: 11, color: '#5a7a96' }}>Daily goal: {GOAL_OZ} oz / {GOAL_OZ / 8} cups</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color, lineHeight: 1 }}>{oz} oz</div>
          <div style={{ fontSize: 11, color: '#5a7a96' }}>{cups} cups</div>
        </div>
      </div>

      <div className="progress-track" style={{ marginBottom: 14 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[8, 12, 16, 20].map(amt => (
          <button
            key={amt}
            onClick={() => add(amt)}
            style={{
              flex: 1,
              background: '#1a2d3d',
              border: '1px solid #1e3a52',
              borderRadius: 6,
              color: '#F0EDE6',
              padding: '8px 4px',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1e3a52'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a2d3d'}
          >
            +{amt} oz
          </button>
        ))}
        <button
          onClick={reset}
          style={{
            background: 'none',
            border: '1px solid #1e3a52',
            borderRadius: 6,
            color: '#5a7a96',
            padding: '8px 12px',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Reset
        </button>
      </div>

      {pct >= 100 && (
        <div style={{
          marginTop: 10, padding: '6px 10px',
          background: '#0a2a25', borderRadius: 6,
          fontSize: 11, color: '#00C9A7',
        }}>
          ✓ Daily hydration goal reached
        </div>
      )}
    </div>
  );
}
