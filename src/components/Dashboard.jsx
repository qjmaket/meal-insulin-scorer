import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardLogs, getBodyStats, upsertBodyStats,
  deleteBodyStats, getFastingWindow, getHydration, closeEatingWindow,
} from '../lib/db';
import { generateInsights } from '../utils/insights';
import { todayKey, formatDuration } from '../utils/storage';
import { getTodayDayType, getSuggestedTimes } from '../utils/dailyLog';

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// ── Score bar chart ───────────────────────────────────────

function ScoreBarChart({ weekData }) {
  const max = 30; // cap display at 30 for visual clarity

  return (
    <div>
      <div className="label-sm" style={{ marginBottom: 12 }}>7-day insulin score</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
        {weekData.map((day, i) => {
          const score = day.avgScore;
          const hasData = score !== null;
          const pct = hasData ? Math.min(score / max * 100, 100) : 0;
          const color = !hasData ? '#1e2d3d'
            : score < 10 ? '#00C9A7'
            : score <= 20 ? '#F5A623'
            : '#E84545';
          // Parse "YYYY-MM-DD" as LOCAL date components — new Date(str) would
          // parse it as UTC midnight, then getDay() could roll it back a
          // calendar day depending on the user's timezone offset.
          const [y, m, d] = day.date.split('-').map(Number);
          const date = new Date(y, m - 1, d);
          const isToday = day.date === todayKey();

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {hasData && (
                <div style={{ fontSize: 9, color, fontWeight: 600 }}>
                  {score.toFixed(1)}
                </div>
              )}
              <div style={{
                width: '100%', height: 60,
                display: 'flex', alignItems: 'flex-end',
              }}>
                <div style={{
                  width: '100%',
                  height: hasData ? `${Math.max(pct, 4)}%` : '4%',
                  background: color,
                  borderRadius: '3px 3px 0 0',
                  opacity: hasData ? 1 : 0.3,
                  transition: 'height 0.4s ease',
                  minHeight: 3,
                }} />
              </div>
              <div style={{
                fontSize: 10,
                color: isToday ? '#00C9A7' : '#5a7a96',
                fontWeight: isToday ? 600 : 400,
                lineHeight: 1.3,
                textAlign: 'center',
              }}>
                <div>{DAYS_SHORT[date.getDay()]}</div>
                <div style={{ fontSize: 9, opacity: 0.75 }}>{date.getDate()}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
        {[['< 10', 'Low', '#00C9A7'], ['10–20', 'Moderate', '#F5A623'], ['> 20', 'High', '#E84545']].map(([range, label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 10, color: '#5a7a96' }}>{range} {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Macro adherence bars ──────────────────────────────────

function MacroAdherence({ weekData, targets }) {
  if (!targets) return null;

  const daysWithData = weekData.filter(d => d.totals?.mealCount > 0);
  if (!daysWithData.length) return (
    <div style={{ fontSize: 12, color: '#5a7a96', padding: '8px 0' }}>Log meals to see macro adherence.</div>
  );

  const avg = {
    protein: Math.round(daysWithData.reduce((s, d) => s + d.totals.protein, 0) / daysWithData.length),
    carbs:   Math.round(daysWithData.reduce((s, d) => s + d.totals.carbs,   0) / daysWithData.length),
    fat:     Math.round(daysWithData.reduce((s, d) => s + d.totals.fat,     0) / daysWithData.length),
  };

  return (
    <div>
      <div className="label-sm" style={{ marginBottom: 12 }}>7-day avg macros</div>
      {[
        { label: 'Protein', avg: avg.protein, target: targets.protein, color: '#00C9A7' },
        { label: 'Carbs',   avg: avg.carbs,   target: targets.carbs,   color: '#F5A623' },
        { label: 'Fat',     avg: avg.fat,      target: targets.fat,     color: '#5a7a96' },
      ].map(m => {
        const pct = Math.min((m.avg / m.target) * 100, 100);
        const over = m.avg > m.target;
        return (
          <div key={m.label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#5a7a96' }}>{m.label}</span>
              <span style={{ fontSize: 12 }}>
                <span style={{ color: over ? '#E84545' : '#F0EDE6', fontWeight: 500 }}>{m.avg}g</span>
                <span style={{ color: '#3a5a76' }}> avg / {m.target}g target</span>
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%`, background: over ? '#E84545' : m.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Weight sparkline ──────────────────────────────────────

function WeightSparkline({ bodyStats }) {
  const entries = bodyStats
    .filter(s => s.weight_lbs)
    .sort((a, b) => new Date(a.log_date) - new Date(b.log_date))
    .slice(-30);

  if (entries.length < 2) return null;

  const weights = entries.map(e => e.weight_lbs);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const W = 200, H = 40;
  const points = entries.map((e, i) => {
    const x = (i / (entries.length - 1)) * W;
    const y = H - ((e.weight_lbs - min) / range) * H;
    return `${x},${y}`;
  }).join(' ');

  const first = entries[0].weight_lbs;
  const last  = entries[entries.length - 1].weight_lbs;
  const diff  = Math.round((last - first) * 10) / 10;
  const color = diff <= 0 ? '#00C9A7' : '#E84545';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#F0EDE6', lineHeight: 1 }}>
            {last} <span style={{ fontSize: 13, fontWeight: 400, color: '#5a7a96' }}>lbs</span>
          </div>
          <div style={{ fontSize: 11, color, marginTop: 2 }}>
            {diff <= 0 ? `↓ ${Math.abs(diff)} lbs` : `↑ ${diff} lbs`} from first entry
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#5a7a96' }}>Body fat</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#F0EDE6' }}>
            {entries[entries.length - 1].body_fat_pct ?? '—'}%
          </div>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Last point dot */}
        {entries.length > 0 && (() => {
          const last = entries[entries.length - 1];
          const x = W;
          const y = H - ((last.weight_lbs - min) / range) * H;
          return <circle cx={x} cy={y} r="3" fill={color} />;
        })()}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 10, color: '#3a5a76' }}>{entries[0].log_date}</span>
        <span style={{ fontSize: 10, color: '#3a5a76' }}>{entries[entries.length-1].log_date}</span>
      </div>
    </div>
  );
}

// ── Body comp log entry form ──────────────────────────────

function BodyCompForm({ userId, onSave, onCancel }) {
  const [form, setForm] = useState({
    log_date:     todayKey(),
    weight_lbs:   '',
    body_fat_pct: '',
    waist_in:     '',
    hip_in:       '',
    neck_in:      '',
    notes:        '',
  });
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.weight_lbs && !form.body_fat_pct) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{
        background: '#0F1923', border: '1px solid #1e2d3d',
        borderRadius: '12px 12px 0 0', width: '100%', maxWidth: 720,
        padding: '20px 16px 32px', maxHeight: '80vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div className="label-sm" style={{ color: '#00C9A7', marginBottom: 4 }}>LOG BODY STATS</div>
            <div style={{ fontSize: 13, color: '#5a7a96' }}>Enter your ZOZOFIT scan results</div>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#5a7a96', fontSize: 24, cursor: 'pointer' }}>×</button>
        </div>

        <div className="form-grid" style={{ marginBottom: 14 }}>
          <div className="form-group">
            <label>Date</label>
            <input className="input" type="date" value={form.log_date}
              onChange={e => update('log_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Weight (lbs)</label>
            <input className="input" type="number" step="0.1" value={form.weight_lbs}
              onChange={e => update('weight_lbs', e.target.value)} placeholder="226.0" />
          </div>
          <div className="form-group">
            <label>Body Fat % (ZOZOFIT)</label>
            <input className="input" type="number" step="0.1" value={form.body_fat_pct}
              onChange={e => update('body_fat_pct', e.target.value)} placeholder="22.8" />
          </div>
          <div className="form-group">
            <label>Waist (inches)</label>
            <input className="input" type="number" step="0.5" value={form.waist_in}
              onChange={e => update('waist_in', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Hip (inches)</label>
            <input className="input" type="number" step="0.5" value={form.hip_in}
              onChange={e => update('hip_in', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Neck (inches)</label>
            <input className="input" type="number" step="0.5" value={form.neck_in}
              onChange={e => update('neck_in', e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Notes (optional)</label>
            <input className="input" value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Post-scan notes, conditions, etc." />
          </div>
        </div>

        <button className="btn-primary" onClick={handleSave}
          disabled={saving || (!form.weight_lbs && !form.body_fat_pct)}
          style={{ width: '100%' }}>
          {saving ? 'Saving…' : 'Save entry'}
        </button>
      </div>
    </div>
  );
}

// ── Insights panel ────────────────────────────────────────

function InsightsPanel({ insights }) {
  if (!insights.length) return null;

  const bg = { positive: '#0a2a25', warning: '#2a2010', info: '#0d1b27' };
  const color = { positive: '#00C9A7', warning: '#F5A623', info: '#5a7a96' };

  return (
    <div>
      <div className="label-sm" style={{ marginBottom: 10 }}>Weekly insights</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{
            padding: '10px 14px',
            background: bg[ins.type] || '#0d1b27',
            borderRadius: 8,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 14, color: color[ins.type], flexShrink: 0, marginTop: 1 }}>
              {ins.icon}
            </span>
            <span style={{ fontSize: 13, color: '#F0EDE6', lineHeight: 1.5 }}>
              {ins.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────

export default function Dashboard({ profile, targets, user, onNavigate }) {
  const [weekData, setWeekData]       = useState([]);
  const [bodyStats, setBodyStats]     = useState([]);
  const [todayFasting, setTodayFasting] = useState(null);
  const [todayHydration, setTodayHydration] = useState(0);
  const [insights, setInsights]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showBodyForm, setShowBodyForm]   = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [closing, setClosing]             = useState(false);
  const [now, setNow]                     = useState(Date.now());

  const userId = user?.id;
  const today  = todayKey();

  // Live clock for fasting display
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const handleCloseWindow = async (confirmedTime) => {
    setClosing(true);
    const date = todayKey();
    await closeEatingWindow(userId, date, confirmedTime);
    setClosing(false);
    setShowCloseConfirm(false);
    loadData(); // refresh fasting status on dashboard
  };

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const [weekRes, bodyRes, fastingRes, hydrationRes] = await Promise.all([
      getDashboardLogs(userId, 7),
      getBodyStats(userId, 30),
      getFastingWindow(userId, today),
      getHydration(userId, today),
    ]);

    const week = weekRes.data || [];
    const body = bodyRes.data || [];

    setWeekData(week);
    setBodyStats(body);
    setTodayFasting(fastingRes.data);
    setTodayHydration(hydrationRes.data || 0);
    setInsights(generateInsights(week, targets, body));
    setLoading(false);
  }, [userId, today, targets]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleBodyStatsSave = async (entry) => {
    const { error } = await upsertBodyStats(userId, entry);
    if (!error) {
      setShowBodyForm(false);
      loadData();
    }
  };

  // Fasting status derived from today's fasting window
  const firstMeal   = todayFasting?.first_meal;
  const windowClose = todayFasting?.window_close;
  const inWindow    = firstMeal && !windowClose;
  const windowOpen  = firstMeal
    ? Math.round((now - new Date(firstMeal)) / 60000) : null;
  const fastingSince = windowClose || todayFasting?.last_meal;
  const fastingMins  = fastingSince
    ? Math.round((now - new Date(fastingSince)) / 60000) : null;

  const dayType    = getTodayDayType(profile);
  const suggested  = getSuggestedTimes(dayType);
  const dayTypeLabel = dayType.charAt(0).toUpperCase() + dayType.slice(1).replace('_', ' ');

  // Today's totals from weekData
  const todayData = weekData.find(d => d.date === today);
  const todayTotals = todayData?.totals;
  const todayScore  = todayData?.avgScore;
  const scoreColor  = todayScore === null || todayScore === undefined ? '#5a7a96'
    : todayScore < 10 ? '#00C9A7' : todayScore <= 20 ? '#F5A623' : '#E84545';

  const CloseWindowModal = () => {
    const now2 = new Date();
    const defaultTime = `${String(now2.getHours()).padStart(2,'0')}:${String(now2.getMinutes()).padStart(2,'0')}`;
    const [closeTime, setCloseTime] = useState(defaultTime);
    const confirm = () => {
      const [h, m] = closeTime.split(':').map(Number);
      const d = new Date(); d.setHours(h, m, 0, 0);
      handleCloseWindow(d.toISOString());
    };
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        onClick={e => e.target === e.currentTarget && setShowCloseConfirm(false)}>
        <div style={{ background: '#0F1923', border: '1px solid #1e2d3d', borderRadius: 12, padding: 24, width: '100%', maxWidth: 360 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#F0EDE6', marginBottom: 8 }}>Close eating window?</div>
          <div style={{ fontSize: 13, color: '#5a7a96', marginBottom: 20, lineHeight: 1.5 }}>
            This will start your fasting clock. Set the time your last meal ended.
          </div>
          <div style={{ marginBottom: 20 }}>
            <div className="label-sm" style={{ marginBottom: 6 }}>Window close time</div>
            <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)}
              style={{ background: '#1a2d3d', border: '1px solid #1e3a52', borderRadius: 6, color: '#F0EDE6', padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowCloseConfirm(false)} style={{ flex: 1, background: 'none', border: '1px solid #1e3a52', borderRadius: 6, color: '#5a7a96', padding: '10px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={confirm} disabled={closing} style={{ flex: 1, background: '#E84545', border: 'none', borderRadius: 6, color: '#fff', padding: '10px', fontSize: 13, fontWeight: 600, cursor: closing ? 'default' : 'pointer', fontFamily: 'inherit', opacity: closing ? 0.7 : 1 }}>
              {closing ? 'Closing…' : '■ Close window'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="screen">
      {showCloseConfirm && <CloseWindowModal />}
      {showBodyForm && (
        <BodyCompForm
          userId={userId}
          onSave={handleBodyStatsSave}
          onCancel={() => setShowBodyForm(false)}
        />
      )}

      {/* Header */}
      <div style={{ padding: '28px 0 20px', borderBottom: '1px solid #1e2d3d', marginBottom: 20 }}>
        <div className="label-sm" style={{ marginBottom: 6, color: '#00C9A7' }}>
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
          {dayTypeLabel && <span style={{ marginLeft: 8, color: '#3a5a76' }}>· {dayTypeLabel}</span>}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>
          {profile?.name ? `Hi, ${profile.name}` : 'Dashboard'}
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#5a7a96', fontSize: 13 }}>
          Loading your data…
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Fasting status */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="label-sm" style={{ marginBottom: 4 }}>Fasting status</div>
                {inWindow ? (
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 500, color: '#F5A623' }}>
                      Eating window open
                    </div>
                    <div style={{ fontSize: 12, color: '#5a7a96', marginTop: 2 }}>
                      {windowOpen !== null && `Open for ${formatDuration(windowOpen)}`}
                      {suggested.closeWindow && ` · suggested close ${suggested.closeWindow}`}
                    </div>
                  </div>
                ) : fastingMins ? (
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 500, color: '#00C9A7' }}>
                      Fasting · {formatDuration(fastingMins)}
                    </div>
                    <div style={{ fontSize: 12, color: '#5a7a96', marginTop: 2 }}>
                      Target fast: {suggested.fastTarget} · Break fast at {suggested.breakFast}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 16, color: '#5a7a96' }}>No meals logged yet today</div>
                    <div style={{ fontSize: 12, color: '#3a5a76', marginTop: 2 }}>
                      Suggested first meal: {suggested.breakFast}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onNavigate('scorer')}
                    style={{
                      background: '#00C9A7', border: 'none', borderRadius: 6,
                      color: '#0F1923', fontSize: 12, fontWeight: 600,
                      padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    New meal
                  </button>
                  <button
                    onClick={() => onNavigate('log', { tab: 'quick' })}
                    style={{
                      background: 'none', border: '1px solid #1e3a52', borderRadius: 6,
                      color: '#F0EDE6', fontSize: 12, fontWeight: 500,
                      padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Quick log
                  </button>
                </div>
                <button
                  onClick={() => setShowCloseConfirm(true)}
                  style={{
                    background: 'none', border: '1px solid #E84545', borderRadius: 6,
                    color: '#E84545', fontSize: 11, fontWeight: 600,
                    padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ■ Close window
                </button>
              </div>
            </div>
          </div>

          {/* Today summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#5a7a96', marginBottom: 4 }}>Avg score</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: scoreColor }}>
                {todayScore !== null && todayScore !== undefined ? todayScore.toFixed(1) : '—'}
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#5a7a96', marginBottom: 4 }}>Protein</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#F0EDE6' }}>
                {todayTotals ? `${Math.round(todayTotals.protein)}g` : '—'}
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#5a7a96', marginBottom: 4 }}>Hydration</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: todayHydration >= 64 ? '#00C9A7' : '#F0EDE6' }}>
                {todayHydration}oz
              </div>
            </div>
          </div>

          {/* 7-day trend */}
          <div className="card">
            <ScoreBarChart weekData={weekData} />
          </div>

          {/* Macro adherence */}
          <div className="card">
            <MacroAdherence weekData={weekData} targets={targets} />
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="card">
              <InsightsPanel insights={insights} />
            </div>
          )}

          {/* Body composition */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="label-sm">Body composition</div>
              <button
                onClick={() => setShowBodyForm(true)}
                className="btn-ghost"
                style={{ fontSize: 12, padding: '4px 12px' }}
              >
                + Log scan
              </button>
            </div>

            {bodyStats.length === 0 ? (
              <div style={{ fontSize: 13, color: '#5a7a96', lineHeight: 1.6 }}>
                No body stats logged yet. Log your first ZOZOFIT scan to start tracking your composition trend.
              </div>
            ) : (
              <>
                <WeightSparkline bodyStats={bodyStats} />
                <div style={{ marginTop: 16 }}>
                  <div className="label-sm" style={{ marginBottom: 8 }}>Recent entries</div>
                  {bodyStats.slice(0, 5).map(entry => (
                    <div key={entry.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '8px 0', borderBottom: '1px solid #1e2d3d',
                      fontSize: 13,
                    }}>
                      <span style={{ color: '#5a7a96' }}>{entry.log_date}</span>
                      <div style={{ display: 'flex', gap: 14 }}>
                        {entry.weight_lbs && (
                          <span style={{ color: '#F0EDE6' }}>{entry.weight_lbs} lbs</span>
                        )}
                        {entry.body_fat_pct && (
                          <span style={{ color: '#5a7a96' }}>{entry.body_fat_pct}% bf</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
