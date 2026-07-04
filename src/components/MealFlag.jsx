import { MEAL_FLAGS } from '../utils/dailyLog';

export default function MealFlag({ selected, onChange }) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
        color: '#5a7a96', marginBottom: 8, textTransform: 'uppercase',
      }}>
        Meal context
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <button
          onClick={() => onChange(null)}
          style={{
            padding: '4px 12px', borderRadius: 4, fontSize: 11,
            border: `1px solid ${!selected ? '#00C9A7' : '#1e3a52'}`,
            background: !selected ? '#0a2a25' : 'none',
            color: !selected ? '#00C9A7' : '#5a7a96',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
        >
          None
        </button>
        {MEAL_FLAGS.map(flag => {
          const isSelected = selected === flag.value;
          return (
            <button
              key={flag.value}
              onClick={() => onChange(isSelected ? null : flag.value)}
              style={{
                padding: '4px 12px', borderRadius: 4, fontSize: 11,
                border: `1px solid ${isSelected ? flag.color : '#1e3a52'}`,
                background: isSelected ? `${flag.color}20` : 'none',
                color: isSelected ? flag.color : '#5a7a96',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {flag.icon} {flag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
