import { useState, useEffect } from 'react';
import { calcProfile } from '../utils/calculations';
import { signOut } from '../lib/auth';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_TYPES = [
  { value: 'training',  label: 'Training',  color: '#00C9A7' },
  { value: 'game',      label: 'Game Day',  color: '#F5A623' },
  { value: 'rest',      label: 'Rest',      color: '#5a7a96' },
  { value: 'recovery',  label: 'Recovery',  color: '#3a7a96' },
];

const DEFAULT_PROFILE = {
  name: '',
  sex: 'male',
  age: '',
  weightLbs: '',
  heightFeet: '',
  heightInches: '',
  bodyFatSource: 'direct',
  bodyFatPct: '',
  waist: '', neck: '', hip: '',
  activityLevel: 'moderately_active',
  goal: 'fat_loss',
  weekSchedule: {
    0: 'training', 1: 'training', 2: 'training',
    3: 'rest', 4: 'rest', 5: 'game', 6: 'recovery',
  },
};

function StatCard({ label, value, unit, note }) {
  return (
    <div style={{ background: '#0d1b27', border: '1px solid #1e2d3d', borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, color: '#5a7a96', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#F0EDE6', lineHeight: 1 }}>
        {value ?? '—'}{unit && <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 3 }}>{unit}</span>}
      </div>
      {note && <div style={{ fontSize: 10, color: '#3a5a76', marginTop: 3 }}>{note}</div>}
    </div>
  );
}

function MacroBar({ label, value, target, unit = 'g', color = '#00C9A7' }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#5a7a96' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#F0EDE6' }}>{target}{unit} <span style={{ color: '#3a5a76' }}>target</span></span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Profile({ profile: initialProfile, user, onSave }) {
  const [profile, setProfile] = useState(() => ({
    ...DEFAULT_PROFILE,
    ...(initialProfile || {}),
  }));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('stats');

  // Sync if parent profile changes (e.g. loaded from DB after mount)
  useEffect(() => {
    if (initialProfile) {
      setProfile(prev => ({ ...DEFAULT_PROFILE, ...initialProfile }));
    }
  }, [initialProfile]);

  const calc = calcProfile(profile);

  const update = (field, value) => setProfile(prev => ({ ...prev, [field]: value }));

  const updateSchedule = (dayIdx, type) => setProfile(prev => ({
    ...prev,
    weekSchedule: { ...prev.weekSchedule, [dayIdx]: type },
  }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(profile);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const sectionBtn = (id, label) => (
    <button onClick={() => setActiveSection(id)} style={{
      flex: 1, background: activeSection === id ? '#1a2d3d' : 'none',
      border: 'none', borderBottom: activeSection === id ? '2px solid #00C9A7' : '2px solid transparent',
      color: activeSection === id ? '#F0EDE6' : '#5a7a96',
      padding: '10px 8px', fontSize: 13,
      fontWeight: activeSection === id ? 600 : 400,
      cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
    }}>{label}</button>
  );

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '28px 0 20px', borderBottom: '1px solid #1e2d3d', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>YOUR PROFILE</div>
            <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>
              {profile.name || 'My Profile'}
            </h1>
            {user?.email && (
              <div style={{ fontSize: 12, color: '#5a7a96', marginTop: 4 }}>{user.email}</div>
            )}
          </div>
          <button onClick={handleSignOut} style={{
            background: 'none', border: '1px solid #1e3a52', borderRadius: 6,
            color: '#5a7a96', fontSize: 12, padding: '6px 12px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e2d3d', marginBottom: 20 }}>
        {sectionBtn('stats', 'Body Stats')}
        {sectionBtn('schedule', 'Schedule')}
        {sectionBtn('results', 'My Targets')}
      </div>

      {/* ── BODY STATS ─────────────────────────────────── */}
      {activeSection === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="label-sm" style={{ marginBottom: 12 }}>Personal</div>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Name</label>
                <input className="input" value={profile.name}
                  onChange={e => update('name', e.target.value)} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Sex</label>
                <select className="select" style={{ width: '100%' }}
                  value={profile.sex} onChange={e => update('sex', e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Age</label>
                <input className="input" type="number" value={profile.age}
                  onChange={e => update('age', e.target.value)} placeholder="48" />
              </div>
              <div className="form-group">
                <label>Weight (lbs)</label>
                <input className="input" type="number" value={profile.weightLbs}
                  onChange={e => update('weightLbs', e.target.value)} placeholder="226" />
              </div>
              <div className="form-group">
                <label>Height</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input className="input" type="number" value={profile.heightFeet}
                    onChange={e => update('heightFeet', e.target.value)}
                    placeholder="5" style={{ width: 70 }} />
                  <span style={{ alignSelf: 'center', color: '#5a7a96', fontSize: 12 }}>ft</span>
                  <input className="input" type="number" value={profile.heightInches}
                    onChange={e => update('heightInches', e.target.value)}
                    placeholder="11.5" style={{ width: 80 }} />
                  <span style={{ alignSelf: 'center', color: '#5a7a96', fontSize: 12 }}>in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="label-sm" style={{ marginBottom: 12 }}>Body Composition</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[['direct', 'ZOZOFIT / Direct %'], ['navy', 'Navy Method']].map(([val, lbl]) => (
                <button key={val} onClick={() => update('bodyFatSource', val)} style={{
                  flex: 1, padding: '8px 10px', borderRadius: 6, fontFamily: 'inherit',
                  border: `1px solid ${profile.bodyFatSource === val ? '#00C9A7' : '#1e3a52'}`,
                  background: profile.bodyFatSource === val ? '#0a2a25' : 'none',
                  color: profile.bodyFatSource === val ? '#00C9A7' : '#5a7a96',
                  fontSize: 12, cursor: 'pointer',
                }}>{lbl}</button>
              ))}
            </div>
            {profile.bodyFatSource === 'direct' ? (
              <div className="form-group">
                <label>Body Fat % (from ZOZOFIT scan)</label>
                <input className="input" type="number" step="0.1"
                  value={profile.bodyFatPct}
                  onChange={e => update('bodyFatPct', e.target.value)} placeholder="22.8" />
              </div>
            ) : (
              <div className="form-grid">
                <div className="form-group">
                  <label>Waist (inches)</label>
                  <input className="input" type="number" step="0.5" value={profile.waist}
                    onChange={e => update('waist', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Neck (inches)</label>
                  <input className="input" type="number" step="0.5" value={profile.neck}
                    onChange={e => update('neck', e.target.value)} />
                </div>
                {profile.sex === 'female' && (
                  <div className="form-group">
                    <label>Hip (inches)</label>
                    <input className="input" type="number" step="0.5" value={profile.hip}
                      onChange={e => update('hip', e.target.value)} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <div className="label-sm" style={{ marginBottom: 12 }}>Goals</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Activity level</label>
                <select className="select" style={{ width: '100%' }}
                  value={profile.activityLevel} onChange={e => update('activityLevel', e.target.value)}>
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly active</option>
                  <option value="moderately_active">Moderately active</option>
                  <option value="very_active">Very active</option>
                </select>
              </div>
              <div className="form-group">
                <label>Goal</label>
                <select className="select" style={{ width: '100%' }}
                  value={profile.goal} onChange={e => update('goal', e.target.value)}>
                  <option value="fat_loss">Fat loss (−18% TDEE)</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="muscle_gain">Muscle gain (+15% TDEE)</option>
                </select>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={handleSave}
            disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Profile'}
          </button>
        </div>
      )}

      {/* ── SCHEDULE ───────────────────────────────────── */}
      {activeSection === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div className="label-sm" style={{ marginBottom: 4 }}>Weekly Schedule</div>
            <p style={{ fontSize: 12, color: '#5a7a96', marginBottom: 16, lineHeight: 1.5 }}>
              Set each day type to get accurate fasting window suggestions and meal timing guidance.
            </p>
            {DAYS.map((day, i) => {
              const current = profile.weekSchedule?.[i] || 'rest';
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 0', borderBottom: i < 6 ? '1px solid #1e2d3d' : 'none',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#F0EDE6', minWidth: 32 }}>{day}</span>
                  <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
                    {DAY_TYPES.map(dt => (
                      <button key={dt.value} onClick={() => updateSchedule(i, dt.value)} style={{
                        padding: '4px 12px', borderRadius: 4, fontFamily: 'inherit',
                        border: `1px solid ${current === dt.value ? dt.color : '#1e3a52'}`,
                        background: current === dt.value ? `${dt.color}20` : 'none',
                        color: current === dt.value ? dt.color : '#5a7a96',
                        fontSize: 11, fontWeight: current === dt.value ? 600 : 400,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}>{dt.label}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn-primary" onClick={handleSave}
            disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Schedule'}
          </button>
        </div>
      )}

      {/* ── RESULTS ────────────────────────────────────── */}
      {activeSection === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!calc ? (
            <div className="empty-state">
              Complete your body stats to see your calculated targets.
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <StatCard label="Body Fat %" value={calc.bfPct} unit="%" note="ZOZOFIT" />
                <StatCard label="Lean Mass" value={calc.macros?.leanMass} unit="lbs" />
                <StatCard label="BMR" value={calc.bmr} unit="cal" note="at rest" />
                <StatCard label="TDEE" value={calc.tdee} unit="cal" note="with activity" />
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="label-sm" style={{ marginBottom: 4 }}>Daily Calorie Target</div>
                    <div style={{ fontSize: 32, fontWeight: 600, color: '#00C9A7' }}>
                      {calc.calorieTarget}
                    </div>
                    <div style={{ fontSize: 12, color: '#5a7a96', marginTop: 2 }}>
                      calories/day · {profile.goal === 'fat_loss' ? '−18% TDEE'
                        : profile.goal === 'muscle_gain' ? '+15% TDEE' : 'maintenance'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#5a7a96' }}>Implied deficit</div>
                    <div style={{ fontSize: 16, color: '#F0EDE6', fontWeight: 500 }}>
                      {Math.round(calc.tdee - calc.calorieTarget)} cal/day
                    </div>
                    <div style={{ fontSize: 11, color: '#5a7a96' }}>
                      ~{Math.round((calc.tdee - calc.calorieTarget) / 500 * 10) / 10} lbs/week
                    </div>
                  </div>
                </div>
              </div>

              {calc.macros && (
                <div className="card">
                  <div className="label-sm" style={{ marginBottom: 14 }}>Daily Macro Targets</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                    {[
                      { label: 'Protein', value: calc.macros.protein, color: '#00C9A7', note: '1g/lb lean' },
                      { label: 'Carbs',   value: calc.macros.carbs,   color: '#F5A623', note: '45% remaining' },
                      { label: 'Fat',     value: calc.macros.fat,     color: '#5a7a96', note: '55% remaining' },
                    ].map(m => (
                      <div key={m.label} style={{
                        background: '#0d1b27', borderRadius: 8, padding: '10px', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 600, color: m.color }}>{m.value}g</div>
                        <div style={{ fontSize: 11, color: '#5a7a96', marginTop: 2 }}>{m.label}</div>
                        <div style={{ fontSize: 10, color: '#3a5a76' }}>{m.note}</div>
                      </div>
                    ))}
                  </div>
                  <MacroBar label="Protein" value={0} target={calc.macros.protein} color="#00C9A7" />
                  <MacroBar label="Carbs"   value={0} target={calc.macros.carbs}   color="#F5A623" />
                  <MacroBar label="Fat"     value={0} target={calc.macros.fat}     color="#5a7a96" />
                </div>
              )}

              <div className="card">
                <div className="label-sm" style={{ marginBottom: 8 }}>Daily Insulin Score Target</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 32, fontWeight: 600, color: '#00C9A7' }}>{'< 10'}</div>
                  <div style={{ fontSize: 13, color: '#5a7a96', lineHeight: 1.5 }}>
                    Daily average net insulin score. Achievable with whole foods,
                    adequate fiber, and minimizing refined carbs — consistent with
                    established metabolic research.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
