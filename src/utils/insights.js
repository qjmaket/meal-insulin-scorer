// ─────────────────────────────────────────────────────────
// WEEKLY INSIGHTS ENGINE
// Hardcoded pattern matching against real user data.
// No external API. No ML. Deterministic and fast.
// Each rule takes the 7-day dashboard data and returns
// an insight object or null if the pattern doesn't apply.
//
// Insight shape: { text, type: 'positive'|'warning'|'info', icon }
// ─────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Get day name from a YYYY-MM-DD date string
 */
function dayName(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return DAYS[new Date(y, m - 1, d).getDay()];
}

/**
 * Rule 1: Best day of the week by avg insulin score
 * Fires when at least 4 days have logged meals
 */
function bestDayRule(weekData) {
  const daysWithData = weekData.filter(d => d.avgScore !== null && d.avgScore >= 0);
  if (daysWithData.length < 4) return null;

  const best = daysWithData.reduce((a, b) => a.avgScore < b.avgScore ? a : b);
  if (best.avgScore > 15) return null; // not worth calling out if best day is still high

  return {
    text: `${dayName(best.date)} was your best day this week — average insulin score of ${best.avgScore.toFixed(1)}.`,
    type: 'positive',
    icon: '↓',
  };
}

/**
 * Rule 2: Worst day of the week by avg insulin score
 * Only fires if worst day is meaningfully worse than average
 */
function worstDayRule(weekData) {
  const daysWithData = weekData.filter(d => d.avgScore !== null);
  if (daysWithData.length < 4) return null;

  const worst = daysWithData.reduce((a, b) => a.avgScore > b.avgScore ? a : b);
  const mean = daysWithData.reduce((s, d) => s + d.avgScore, 0) / daysWithData.length;

  if (worst.avgScore < 20) return null; // not high enough to flag
  if (worst.avgScore < mean * 1.3) return null; // not meaningfully worse than average

  return {
    text: `${dayName(worst.date)} had your highest insulin impact this week (avg ${worst.avgScore.toFixed(1)}). Consider what drove that day's meals.`,
    type: 'warning',
    icon: '↑',
  };
}

/**
 * Rule 3: Protein target consistency
 * Fires when logged days show consistent protein undershoot
 */
function proteinRule(weekData, targets) {
  if (!targets?.protein) return null;
  const daysWithData = weekData.filter(d => d.totals?.mealCount > 0);
  if (daysWithData.length < 3) return null;

  const underDays = daysWithData.filter(d => d.totals.protein < targets.protein * 0.85);
  if (underDays.length < 3) return null;

  const avgProtein = Math.round(
    daysWithData.reduce((s, d) => s + d.totals.protein, 0) / daysWithData.length
  );

  return {
    text: `Your average protein was ${avgProtein}g this week — ${Math.round(targets.protein - avgProtein)}g below your ${targets.protein}g target. Protein is the priority macro for preserving lean mass.`,
    type: 'warning',
    icon: '⚠',
  };
}

/**
 * Rule 4: Consistent low insulin performance
 * Fires when majority of logged days are in Low range
 */
function consistencyRule(weekData) {
  const daysWithData = weekData.filter(d => d.avgScore !== null);
  if (daysWithData.length < 4) return null;

  const lowDays = daysWithData.filter(d => d.avgScore < 10);
  if (lowDays.length < Math.ceil(daysWithData.length * 0.7)) return null;

  return {
    text: `${lowDays.length} of ${daysWithData.length} logged days this week were in the Low insulin range. Strong consistency.`,
    type: 'positive',
    icon: '✓',
  };
}

/**
 * Rule 5: Logging streak
 * Fires when user has logged every day this week
 */
function streakRule(weekData) {
  const loggedDays = weekData.filter(d => d.logs?.length > 0);
  if (loggedDays.length < 7) return null;

  return {
    text: `You logged meals every day this week. Daily logging is the single strongest predictor of long-term adherence.`,
    type: 'positive',
    icon: '🔥',
  };
}

/**
 * Rule 6: No data this week
 * Fires when fewer than 2 days logged — encourages logging
 */
function noDataRule(weekData) {
  const loggedDays = weekData.filter(d => d.logs?.length > 0);
  if (loggedDays.length >= 2) return null;

  return {
    text: `Log meals this week to see your insulin impact patterns. Even 3–4 days of data reveals meaningful trends.`,
    type: 'info',
    icon: '○',
  };
}

/**
 * Rule 7: Body composition trend
 * Fires when at least 2 weight entries exist
 */
function bodyCompRule(bodyStats) {
  if (!bodyStats || bodyStats.length < 2) return null;

  const sorted = [...bodyStats]
    .filter(s => s.weight_lbs)
    .sort((a, b) => new Date(a.log_date) - new Date(b.log_date));

  if (sorted.length < 2) return null;

  const first = sorted[0].weight_lbs;
  const last  = sorted[sorted.length - 1].weight_lbs;
  const diff  = Math.round((last - first) * 10) / 10;

  if (diff === 0) return null;

  if (diff < 0) {
    return {
      text: `You're down ${Math.abs(diff)} lbs since your first logged weigh-in. Keep the eating window tight on rest days.`,
      type: 'positive',
      icon: '↓',
    };
  } else {
    return {
      text: `Your weight is up ${diff} lbs since your first logged weigh-in. Check rest day insulin scores — that's typically where the pattern shows.`,
      type: 'warning',
      icon: '↑',
    };
  }
}

/**
 * Rule 8: Fiber intake
 * Fires when avg fiber is consistently low across logged days
 */
function fiberRule(weekData) {
  const daysWithData = weekData.filter(d => d.totals?.mealCount > 0);
  if (daysWithData.length < 3) return null;

  const avgFiber = daysWithData.reduce((s, d) => s + (d.totals.fiber || 0), 0) / daysWithData.length;
  // Flag if avg daily fiber below 15g — well below adequate intake for an adult male
  if (avgFiber >= 15) return null;

  return {
    text: `Your average fiber intake was ${Math.round(avgFiber)}g/day this week. Higher fiber directly reduces your net insulin score. Add legumes, leafy greens, or chia seeds.`,
    type: 'warning',
    icon: '⚠',
  };
}

/**
 * Generate all insights for the week
 * Returns array of up to 3 most relevant insights
 */
export function generateInsights(weekData, targets, bodyStats) {
  if (!weekData || !weekData.length) return [];

  const rules = [
    noDataRule(weekData),
    streakRule(weekData),
    consistencyRule(weekData),
    bestDayRule(weekData),
    worstDayRule(weekData),
    proteinRule(weekData, targets),
    fiberRule(weekData),
    bodyCompRule(bodyStats),
  ];

  return rules
    .filter(Boolean)
    .slice(0, 3); // cap at 3 — avoid overwhelming the dashboard
}
