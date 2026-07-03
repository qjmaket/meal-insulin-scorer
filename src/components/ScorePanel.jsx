import ScoreDial from './ScoreDial';

function MetricRow({ label, value, note }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '5px 0',
      borderBottom: '1px solid #1e2d3d',
    }}>
      <div>
        <span style={{ fontSize: 12, color: '#5a7a96' }}>{label}</span>
        {note && <span style={{ fontSize: 10, color: '#3a5a76', marginLeft: 5 }}>{note}</span>}
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: '#F0EDE6' }}>{value}</span>
    </div>
  );
}

export default function ScorePanel({ score }) {
  if (!score) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '32px 16px' }}>
        <div style={{ fontSize: 13, color: '#5a7a96', lineHeight: 1.6 }}>
          Add foods to see<br />your meal score
        </div>
      </div>
    );
  }

  const { netScore, totalGL, totalFiber, fiberOffset, avgGI, totalCarbs, totalProtein, totalFat, rating, color } = score;

  const ratingBg = rating === 'Low' ? '#0a2a25' : rating === 'Moderate' ? '#2a2010' : '#2a1010';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="card">
        <ScoreDial score={netScore} />

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: 4,
            background: ratingBg,
            color,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}>
            {rating.toUpperCase()} INSULIN IMPACT
          </span>
        </div>

        <div style={{ marginTop: 16 }}>
          <MetricRow label="Avg glycemic index" value={Math.round(avgGI)} note="by carbs" />
          <MetricRow label="Total GL"            value={totalGL.toFixed(1)}       note="raw" />
          <MetricRow label="Fiber"               value={`${totalFiber.toFixed(1)}g`} note="antidote" />
          <MetricRow label="Fiber offset"        value={`−${fiberOffset.toFixed(1)}`} note="GL reduced" />
          <MetricRow label="Carbs"               value={`${totalCarbs.toFixed(0)}g`}   />
          <MetricRow label="Protein"             value={`${totalProtein.toFixed(0)}g`} />
          <MetricRow label="Fat"                 value={`${totalFat.toFixed(0)}g`}     />
        </div>

        {totalFiber >= 5 && (
          <div style={{
            marginTop: 12, padding: '8px 10px',
            background: '#0a2a25', borderRadius: 6,
            fontSize: 11, color: '#00C9A7', lineHeight: 1.5,
          }}>
            ✓ High-fiber meal — fiber offset reduces net score by {fiberOffset.toFixed(1)} GL points.
          </div>
        )}
        {rating === 'High' && (
          <div style={{
            marginTop: 8, padding: '8px 10px',
            background: '#2a1010', borderRadius: 6,
            fontSize: 11, color: '#E84545', lineHeight: 1.5,
          }}>
            ↑ High impact. Swap refined carbs or add fiber-rich foods to lower the score.
          </div>
        )}
      </div>

      {/* Scale reference */}
      <div className="card" style={{ padding: '12px 14px' }}>
        <div className="label-sm" style={{ marginBottom: 8 }}>Score scale</div>
        {[
          ['< 10',  'Low',      '#00C9A7', '#0a2a25'],
          ['10–20', 'Moderate', '#F5A623', '#2a2010'],
          ['> 20',  'High',     '#E84545', '#2a1010'],
        ].map(([range, label, c, bg]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 3,
              background: bg, color: c, fontWeight: 600, minWidth: 36, textAlign: 'center',
            }}>{range}</span>
            <span style={{ fontSize: 11, color: '#5a7a96' }}>{label} insulin impact</span>
          </div>
        ))}
      </div>
    </div>
  );
}
