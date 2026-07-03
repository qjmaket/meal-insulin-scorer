export default function DailyLog() {
  return (
    <div className="screen">
      <div style={{ padding: '28px 0 20px', borderBottom: '1px solid #1e2d3d', marginBottom: 20 }}>
        <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>TODAY</div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Daily Log</h1>
        <p style={{ fontSize: 13, color: '#5a7a96', marginTop: 6 }}>
          Coming in Layer 2 — meal logging, fasting window tracking, and daily macro totals.
        </p>
      </div>
      <div className="empty-state">
        <div style={{ fontSize: 28, marginBottom: 10 }}>≡</div>
        <div style={{ fontWeight: 500, marginBottom: 6, color: '#F0EDE6' }}>Daily log coming soon</div>
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
          Score a meal in the Meal Scorer —<br />
          a "Log This Meal" button will appear here once Layer 2 is built.
        </div>
      </div>
    </div>
  );
}
