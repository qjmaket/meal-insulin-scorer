import { useState, useEffect } from 'react';
import { calcProfile } from '../utils/calculations';

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
  bodyFatSource: 'direct', // 'direct' or 'navy'
  bodyFatPct: '',
  waist: '', neck: '', hip: '',
  activityLevel: 'moderately_active',
  goal: 'fat_loss',
  weekSchedule: {
    0: 'training',  // Sun
    1: 'training',  // Mon
    2: 'training',  // Tue
    3: 'rest',      // Wed
    4: 'rest',      // Thu
    5: 'game',      // Fri
    6: 'recovery',  // Sat
  },
};

function StatCard({ label, value, unit, note }) {
  return (
    <div style={{
      background: '#0d1b27',
      border: '1px solid #1e2d3d',
      borderRadius: 8,
      padding: '12px 14px',
    }}>
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
        <span style={{ fontSize: 12, color: '#F0EDE6' }}>
          {target}{unit} <span style={{ color: '#3a5a76' }}>target</span>
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('mis_profile');
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch { return DEFAULT_PROFILE; }
  });
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('stats'); // 'stats' | 'schedule' | 'results'

  const calc = calcProfile(profile);

  const update = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateSchedule = (dayIdx, type) => {
    setProfile(prev => ({
      ...prev,
      weekSchedule: { ...prev.weekSchedule, [dayIdx]: type },
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('mis_profile', JSON.stringify(profile));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };

  const sectionBtn = (id, label) => (
    <button
      onClick={() => setActiveSection(id)}
      style={{
        flex: 1,
        background: activeSection === id ? '#1a2d3d' : 'none',
        border: 'none',
        borderBottom: activeSection === id ? '2px solid #00C9A7' : '2px solid transparent',
        color: activeSection === id ? '#F0EDE6' : '#5a7a96',
        padding: '10px 8px',
        fontSize: 13,
        fontWeight: activeSection === id ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '28px 0 20px', borderBottom: '1px solid #1e2d3d', marginBottom: 20 }}>
        <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>YOUR PROFILE</div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>
          {profile.name || 'My Profile'}
        </h1>
        <p style={{ fontSize: 13, color: '#5a7a96', marginTop: 6 }}>
          Body stats, macro targets, and weekly schedule.
        </p>
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
          {/* Name & basics */}
          <div className="card">
            <div className="label-sm" style={{ marginBottom: 12 }}>Personal</div>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Name</label>
                <input className="input" value={profile.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Your name" />
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
                  onChange={e => update('weightLbs', e.target.value)} placeholder="227" />
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

          {/* Body fat */}
          <div className="card">
            <div className="label-sm" style={{ marginBottom: 12 }}>Body Composition</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[['direct', 'ZOZOFIT / Direct %'], ['navy', 'Navy Method (circumferences)']].map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => update('bodyFatSource', val)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: `1px solid ${profile.bodyFatSource === val ? '#00C9A7' : '#1e3a52'}`,
                    background: profile.bodyFatSource === val ? '#0a2a25' : 'none',
                    color: profile.bodyFatSource === val ? '#00C9A7' : '#5a7a96',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {profile.bodyFatSource === 'direct' ? (
              <div className="form-group">
                <label>Body Fat % (from ZOZOFIT scan)</label>
                <input className="input" type="number" step="0.1"
                  value={profile.bodyFatPct}
                  onChange={e => update('bodyFatPct', e.target.value)}
                  placeholder="22.8" />
              </div>
            ) : (
              <div className="form-grid">
                <div className="form-group">
                  <label>Waist (inches)</label>
                  <input className="input" type="number" step="0.5"
                    value={profile.waist} onChange={e => update('waist', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Neck (inches)</label>
                  <input className="input" type="number" step="0.5"
                    value={profile.neck} onChange={e => update('neck', e.target.value)} />
                </div>
                {profile.sex === 'female' && (
                  <div className="form-group">
                    <label>Hip (inches)</label>
                    <input className="input" type="number" step="0.5"
                      value={profile.hip} onChange={e => update('hip', e.target.value)} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Goal & activity */}
          <div className="card">
            <div className="label-sm" style={{ marginBottom: 12 }}>Goals</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Activity level</label>
                <select className="select" style={{ width: '100%' }}
                  value={profile.activityLevel}
                  onChange={e => update('activityLevel', e.target.value)}>
                  <option value="sedentary">Sedentary (desk job, no exercise)</option>
                  <option value="lightly_active">Lightly active (1–3 days/week)</option>
                  <option value="moderately_active">Moderately active (3–5 days/week)</option>
                  <option value="very_active">Very active (6–7 days/week)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Goal</label>
                <select className="select" style={{ width: '100%' }}
                  value={profile.goal}
                  onChange={e => update('goal', e.target.value)}>
                  <option value="fat_loss">Fat loss (−18% TDEE)</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="muscle_gain">Muscle gain (+15% TDEE)</option>
                </select>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={handleSave} style={{ width: '100%' }}>
            {saved ? '✓ Saved' : 'Save Profile'}
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
                  padding: '10px 0',
                  borderBottom: i < 6 ? '1px solid #1e2d3d' : 'none',
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 500, color: '#F0EDE6',
                    minWidth: 32,
                  }}>{day}</span>
                  <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
                    {DAY_TYPES.map(dt => (
                      <button
                        key={dt.value}
                        onClick={() => updateSchedule(i, dt.value)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 4,
                          border: `1px solid ${current === dt.value ? dt.color : '#1e3a52'}`,
                          background: current === dt.value ? `${dt.color}20` : 'none',
                          color: current === dt.value ? dt.color : '#5a7a96',
                          fontSize: 11,
                          fontWeight: current === dt.value ? 600 : 400,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s',
                        }}
                      >
                        {dt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Suggested windows preview */}
          <div className="card">
            <div className="label-sm" style={{ marginBottom: 12 }}>Suggested Eating Windows</div>
            {[
              { type: 'training',  window: '7:00am – 11:00pm', fast: '~8h' },
              { type: 'game',      window: '6:00am – 10:00pm', fast: '~8h' },
              { type: 'rest',      window: '10:00am – 9:00pm', fast: '~13h' },
              { type: 'recovery',  window: '11:00am – 11:00pm', fast: '~12h' },
            ].map(row => {
              const dt = DAY_TYPES.find(d => d.value === row.type);
              return (
                <div key={row.type} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid #1e2d3d', fontSize: 13,
                }}>
                  <span style={{ color: dt?.color }}>{dt?.label}</span>
                  <span style={{ color: '#F0EDE6' }}>{row.window}</span>
                  <span style={{ color: '#5a7a96', fontSize: 11 }}>Fast: {row.fast}</span>
                </div>
              );
            })}
            <p style={{ fontSize: 11, color: '#3a5a76', marginTop: 10, lineHeight: 1.5 }}>
              These are suggestions based on Fung's framework — deeper fasting on rest days,
              earlier break-fast on game and training days. All times are editable when logging meals.
            </p>
          </div>

          <button className="btn-primary" onClick={handleSave} style={{ width: '100%' }}>
            {saved ? '✓ Saved' : 'Save Schedule'}
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
              {/* Key stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <StatCard label="Body Fat %" value={calc.bfPct} unit="%" note="ZOZOFIT" />
                <StatCard label="Lean Mass" value={calc.macros?.leanMass} unit="lbs" />
                <StatCard label="BMR" value={calc.bmr} unit="cal" note="at rest" />
                <StatCard label="TDEE" value={calc.tdee} unit="cal" note="with activity" />
              </div>

              {/* Calorie target */}
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

              {/* Macro targets */}
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
                        background: '#0d1b27', borderRadius: 8,
                        padding: '10px', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 600, color: m.color }}>{m.value}g</div>
                        <div style={{ fontSize: 11, color: '#5a7a96', marginTop: 2 }}>{m.label}</div>
                        <div style={{ fontSize: 10, color: '#3a5a76' }}>{m.note}</div>
                      </div>
                    ))}
                  </div>
                  <MacroBar label="Protein" value={0} target={calc.macros.protein} color="#00C9A7" />
                  <MacroBar label="Carbs"   value={0} target={calc.macros.carbs}   color="#F5A623" />
                  <MacroBar label="Fat"     value={0} target={calc.macros.fat}      color="#5a7a96" />
                  <p style={{ fontSize: 11, color: '#3a5a76', marginTop: 8, lineHeight: 1.5 }}>
                    Progress bars will fill as you log meals. Targets recalculate automatically if you update your stats.
                  </p>
                </div>
              )}

              {/* Insulin target */}
              <div className="card">
                <div className="label-sm" style={{ marginBottom: 8 }}>Daily Insulin Score Target</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 32, fontWeight: 600, color: '#00C9A7' }}>{'< 10'}</div>
                  <div style={{ fontSize: 13, color: '#5a7a96', lineHeight: 1.5 }}>
                    Daily average net insulin score. Achievable with whole foods,
                    adequate fiber, and minimizing refined carbs per Fung's framework.
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
