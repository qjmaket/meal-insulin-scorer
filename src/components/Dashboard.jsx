export default function Dashboard() {
  return (
    <div className="screen">
      <div style={{ padding: '28px 0 20px', borderBottom: '1px solid #1e2d3d', marginBottom: 20 }}>
        <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>OVERVIEW</div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#5a7a96', marginTop: 6 }}>
          Coming in Layer 4 — 7-day insulin trend, macro adherence, and body composition tracking.
        </p>
      </div>
      <div className="empty-state">
        <div style={{ fontSize: 28, marginBottom: 10 }}>◎</div>
        <div style={{ fontWeight: 500, marginBottom: 6, color: '#F0EDE6' }}>Dashboard coming soon</div>
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
          Start by building a meal in the Meal Scorer,<br />
          then set up your profile to unlock your personal targets.
        </div>
      </div>
    </div>
  );
}
