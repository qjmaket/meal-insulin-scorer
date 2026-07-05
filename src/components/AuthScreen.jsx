import { useState } from 'react';
import { signInWithMagicLink, signInWithPassword, signUp } from '../lib/auth';

export default function AuthScreen() {
  const [mode, setMode]       = useState('magic'); // 'magic' | 'password' | 'signup'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { text, type: 'success'|'error' }

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
    if (type === 'success') {
      setTimeout(() => setMessage(null), 8000);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) { showMessage('Enter your email address.'); return; }
    setLoading(true);
    const { error } = await signInWithMagicLink(email.trim());
    setLoading(false);
    if (error) {
      showMessage(error.message || 'Failed to send magic link. Try again.');
    } else {
      showMessage(
        `Check your email — we sent a sign-in link to ${email.trim()}. Click it to access your account.`,
        'success'
      );
    }
  };

  const handlePasswordSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) { showMessage('Enter email and password.'); return; }
    setLoading(true);
    const { error } = await signInWithPassword(email.trim(), password);
    setLoading(false);
    if (error) showMessage(error.message || 'Sign in failed. Check your credentials.');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) { showMessage('Enter email and password.'); return; }
    if (password.length < 8) { showMessage('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    setLoading(false);
    if (error) {
      showMessage(error.message || 'Sign up failed. Try again.');
    } else {
      showMessage(
        'Account created. Check your email to confirm, then sign in.',
        'success'
      );
      setMode('password');
    }
  };

  const inputStyle = {
    width: '100%', background: '#0d1b27',
    border: '1px solid #1e3a52', borderRadius: 6,
    color: '#F0EDE6', padding: '12px 14px',
    fontSize: 15, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
  };

  const btnPrimary = {
    width: '100%', background: loading ? '#1a2d3d' : '#00C9A7',
    border: 'none', borderRadius: 6, color: loading ? '#5a7a96' : '#0F1923',
    padding: '13px', fontSize: 15, fontWeight: 600,
    cursor: loading ? 'default' : 'pointer',
    fontFamily: 'inherit', transition: 'background 0.2s',
    marginTop: 8,
  };

  const linkBtn = {
    background: 'none', border: 'none', color: '#00C9A7',
    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
    textDecoration: 'underline', padding: 0,
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0F1923',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo / header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.12em', color: '#00C9A7',
            fontWeight: 600, marginBottom: 12,
          }}>
            INSULIN IMPACT · MEAL ANALYZER
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#F0EDE6', margin: 0 }}>
            Meal Insulin Scorer
          </h1>
          <p style={{ fontSize: 13, color: '#5a7a96', marginTop: 8, lineHeight: 1.5 }}>
            Track your daily insulin impact.<br />
            Sign in to access your personal data.
          </p>
        </div>

        {/* Auth card */}
        <div style={{
          background: '#0d1b27', border: '1px solid #1e2d3d',
          borderRadius: 12, padding: 28,
        }}>

          {/* Mode tabs */}
          <div style={{ display: 'flex', marginBottom: 24, borderBottom: '1px solid #1e2d3d' }}>
            {[
              { id: 'magic',    label: 'Magic link' },
              { id: 'password', label: 'Password' },
              { id: 'signup',   label: 'Create account' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setMode(tab.id); setMessage(null); }}
                style={{
                  flex: 1, background: 'none', border: 'none',
                  borderBottom: mode === tab.id ? '2px solid #00C9A7' : '2px solid transparent',
                  color: mode === tab.id ? '#F0EDE6' : '#5a7a96',
                  padding: '8px 4px', fontSize: 12, cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: mode === tab.id ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding: '10px 14px', borderRadius: 6, marginBottom: 16,
              background: message.type === 'success' ? '#0a2a25' : '#2a1010',
              color: message.type === 'success' ? '#00C9A7' : '#E84545',
              fontSize: 13, lineHeight: 1.5,
            }}>
              {message.text}
            </div>
          )}

          {/* Magic link form */}
          {mode === 'magic' && (
            <form onSubmit={handleMagicLink}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: '#5a7a96', display: 'block', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle} required
                />
              </div>
              <button type="submit" style={btnPrimary} disabled={loading}>
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
              <p style={{ fontSize: 12, color: '#5a7a96', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
                We'll email you a sign-in link. No password needed.
              </p>
            </form>
          )}

          {/* Password sign in */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordSignIn}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#5a7a96', display: 'block', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle} required
                />
              </div>
              <div style={{ marginBottom: 4 }}>
                <label style={{ fontSize: 12, color: '#5a7a96', display: 'block', marginBottom: 6 }}>
                  Password
                </label>
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  style={inputStyle} required
                />
              </div>
              <button type="submit" style={btnPrimary} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          {/* Sign up */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#5a7a96', display: 'block', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle} required
                />
              </div>
              <div style={{ marginBottom: 4 }}>
                <label style={{ fontSize: 12, color: '#5a7a96', display: 'block', marginBottom: 6 }}>
                  Password (min 8 characters)
                </label>
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password"
                  style={inputStyle} required minLength={8}
                />
              </div>
              <button type="submit" style={btnPrimary} disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 12, color: '#3a5a76', marginTop: 20, lineHeight: 1.6 }}>
          Your data is private and encrypted.<br />
          Only you can access your meals and health data.
        </p>
      </div>
    </div>
  );
}
