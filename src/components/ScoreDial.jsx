export default function ScoreDial({ score = 0, maxScore = 40, size = 140 }) {
  const radius = size * 0.386;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = size * 0.071;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / maxScore, 1);
  const dash = pct * circumference;
  const color = score < 10 ? '#00C9A7' : score <= 20 ? '#F5A623' : '#E84545';
  const trackColor = '#1e2d3d';

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.5s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: size * 0.2,
          fontWeight: 600,
          color,
          lineHeight: 1,
          transition: 'color 0.4s',
        }}>
          {score.toFixed(1)}
        </div>
        <div style={{
          fontSize: size * 0.079,
          color: '#5a7a96',
          marginTop: 3,
          letterSpacing: '0.07em',
          fontWeight: 500,
        }}>
          NET SCORE
        </div>
      </div>
    </div>
  );
}
