const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◎' },
  { id: 'scorer',    label: 'Meal Scorer', icon: '⊕' },
  { id: 'log',       label: 'Daily Log',   icon: '≡' },
  { id: 'profile',   label: 'Profile',     icon: '○' },
];

export default function NavBar({ active, onNav }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#0a1620',
      borderTop: '1px solid #1e2d3d',
      display: 'flex',
      zIndex: 100,
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNav(tab.id)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              padding: '10px 4px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
              color: isActive ? '#00C9A7' : '#5a7a96',
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, letterSpacing: '0.04em' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
