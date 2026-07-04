// ─────────────────────────────────────────────────────────
// DAILY LOG DATA MANAGEMENT
// All log operations go through these functions.
// Storage keys:
//   log_{date}        — array of meal log entries for a date
//   hydration_{date}  — hydration oz count for a date
//   fasting_{date}    — fasting window data for a date
//   favorites         — saved favorite meals array
//   templates         — saved meal templates array
// ─────────────────────────────────────────────────────────

import { storageGet, storageSet, storageDel, todayKey } from './storage';
import { getMealScore } from '../foodData';

// ── Meal log ────────────────────────────────────────────

/**
 * Get all logged meals for a date (default today)
 */
export function getLog(date) {
  const key = date || todayKey();
  return storageGet(`log_${key}`) || [];
}

/**
 * Log a meal entry
 * @param {Object} meal - { name, items, flag, timestamp }
 * items: array of { food, grams, portionIdx }
 */
export function logMeal(meal) {
  const date = meal.timestamp
    ? new Date(meal.timestamp).toISOString().split('T')[0]
    : todayKey();

  const log = getLog(date);
  const score = getMealScore(meal.items);

  const entry = {
    id: Date.now().toString(),
    userId: 'local_user', // Layer 3: replace with auth user id
    name: meal.name || 'Meal',
    flag: meal.flag || null,
    timestamp: meal.timestamp || new Date().toISOString(),
    items: meal.items.map(i => ({
      foodId: i.food.id,
      foodName: i.food.name,
      grams: i.grams,
      portionIdx: i.portionIdx,
      gi: i.food.gi,
      carbP100: i.food.carbP100,
      fiberP100: i.food.fiberP100,
      proteinP100: i.food.proteinP100,
      fatP100: i.food.fatP100,
    })),
    score: score ? {
      netScore: score.netScore,
      totalGL: score.totalGL,
      totalFiber: score.totalFiber,
      totalCarbs: score.totalCarbs,
      totalProtein: score.totalProtein,
      totalFat: score.totalFat,
      avgGI: score.avgGI,
      fiberOffset: score.fiberOffset,
      rating: score.rating,
    } : null,
  };

  log.push(entry);
  storageSet(`log_${date}`, log);

  // Update fasting window
  updateFastingWindow(date, entry.timestamp);

  return entry;
}

/**
 * Update a logged meal's timestamp or flag
 */
export function updateLogEntry(date, entryId, updates) {
  const log = getLog(date);
  const idx = log.findIndex(e => e.id === entryId);
  if (idx === -1) return false;
  log[idx] = { ...log[idx], ...updates };
  storageSet(`log_${date}`, log);

  // Recalculate fasting window if timestamp changed
  if (updates.timestamp) {
    recalcFastingWindow(date);
  }
  return true;
}

/**
 * Delete a logged meal entry
 */
export function deleteLogEntry(date, entryId) {
  const log = getLog(date).filter(e => e.id !== entryId);
  storageSet(`log_${date}`, log);
  recalcFastingWindow(date);
  return true;
}

/**
 * Get daily totals from today's log
 */
export function getDailyTotals(date) {
  const log = getLog(date);
  if (!log.length) return { calories: 0, protein: 0, carbs: 0, fat: 0, netScore: 0, mealCount: 0 };

  return log.reduce((totals, entry) => {
    if (!entry.score) return totals;
    const kcal = (entry.score.totalProtein * 4) +
                 (entry.score.totalCarbs * 4) +
                 (entry.score.totalFat * 9);
    return {
      calories: totals.calories + kcal,
      protein:  totals.protein  + entry.score.totalProtein,
      carbs:    totals.carbs    + entry.score.totalCarbs,
      fat:      totals.fat      + entry.score.totalFat,
      netScore: totals.netScore + entry.score.netScore,
      mealCount: totals.mealCount + 1,
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, netScore: 0, mealCount: 0 });
}

/**
 * Get average daily insulin score (total / meal count)
 */
export function getDailyAvgScore(date) {
  const totals = getDailyTotals(date);
  if (!totals.mealCount) return null;
  return totals.netScore / totals.mealCount;
}

// ── Fasting window ───────────────────────────────────────

const FASTING_KEY = (date) => `fasting_${date}`;

/**
 * Get fasting window data for a date
 * Returns { firstMeal, lastMeal, windowMinutes, fastingMinutes }
 */
export function getFastingWindow(date) {
  const key = date || todayKey();
  return storageGet(FASTING_KEY(key)) || {
    firstMeal: null,
    lastMeal: null,
    windowMinutes: null,
    fastingMinutes: null,
  };
}

/**
 * Update fasting window when a meal is logged
 */
function updateFastingWindow(date, timestamp) {
  const current = getFastingWindow(date);
  const ts = new Date(timestamp).getTime();

  const firstMeal = current.firstMeal
    ? Math.min(new Date(current.firstMeal).getTime(), ts)
    : ts;
  const lastMeal = current.lastMeal
    ? Math.max(new Date(current.lastMeal).getTime(), ts)
    : ts;

  const windowMinutes = (lastMeal - firstMeal) / 60000;

  // Get yesterday's last meal to calculate fasting duration
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().split('T')[0];
  const yWindow = getFastingWindow(yKey);

  let fastingMinutes = null;
  if (yWindow.lastMeal && current.firstMeal === null) {
    fastingMinutes = (ts - new Date(yWindow.lastMeal).getTime()) / 60000;
  } else if (yWindow.lastMeal && firstMeal) {
    fastingMinutes = (firstMeal - new Date(yWindow.lastMeal).getTime()) / 60000;
  }

  storageSet(FASTING_KEY(date), {
    firstMeal: new Date(firstMeal).toISOString(),
    lastMeal: new Date(lastMeal).toISOString(),
    windowMinutes: Math.round(windowMinutes),
    fastingMinutes: fastingMinutes ? Math.round(fastingMinutes) : null,
  });
}

/**
 * Recalculate fasting window from scratch for a date
 * Used after edit or delete
 */
function recalcFastingWindow(date) {
  const log = getLog(date);
  storageDel(FASTING_KEY(date));
  if (!log.length) return;
  const sorted = [...log].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );
  sorted.forEach(entry => updateFastingWindow(date, entry.timestamp));
}

/**
 * Manually set fast break time (without logging a meal)
 */
export function setFastBreak(date, timestamp) {
  const key = date || todayKey();
  const current = getFastingWindow(key);
  storageSet(FASTING_KEY(key), {
    ...current,
    firstMeal: timestamp,
    manualFastBreak: true,
  });
}

/**
 * Manually set window close time
 */
export function setWindowClose(date, timestamp) {
  const key = date || todayKey();
  const current = getFastingWindow(key);
  storageSet(FASTING_KEY(key), {
    ...current,
    windowClose: timestamp,
    manualWindowClose: true,
  });
}

// ── Suggested meal times ─────────────────────────────────

const SUGGESTED = {
  training: {
    breakFast: '07:00',
    meals: ['07:00', '13:00', '19:00'],
    closeWindow: '23:00',
    fastTarget: '8h',
  },
  game: {
    breakFast: '06:00',
    meals: ['06:00', '12:30', '19:30', '21:00'],
    closeWindow: '22:00',
    fastTarget: '8h',
  },
  rest: {
    breakFast: '10:00',
    meals: ['10:00', '13:30', '18:00'],
    closeWindow: '21:00',
    fastTarget: '13h',
  },
  recovery: {
    breakFast: '11:00',
    meals: ['11:00', '14:00', '19:00'],
    closeWindow: '23:00',
    fastTarget: '12h',
  },
};

export function getSuggestedTimes(dayType) {
  return SUGGESTED[dayType] || SUGGESTED.rest;
}

export function getTodayDayType(profile) {
  const dow = new Date().getDay(); // 0=Sun
  return profile?.weekSchedule?.[dow] || 'rest';
}

// ── Hydration ────────────────────────────────────────────

export function getHydration(date) {
  return storageGet(`hydration_${date || todayKey()}`) || 0;
}

export function addHydration(oz, date) {
  const key = date || todayKey();
  const current = getHydration(key);
  const updated = current + (oz || 8);
  storageSet(`hydration_${key}`, updated);
  return updated;
}

export function setHydration(oz, date) {
  const key = date || todayKey();
  storageSet(`hydration_${key}`, oz);
  return oz;
}

// ── Favorites ────────────────────────────────────────────

export function getFavorites() {
  return storageGet('favorites') || [];
}

export function saveFavorite(meal) {
  const favs = getFavorites();
  const entry = {
    id: Date.now().toString(),
    name: meal.name || 'Saved Meal',
    savedAt: new Date().toISOString(),
    items: meal.items.map(i => ({
      foodId: i.food.id,
      foodName: i.food.name,
      grams: i.grams,
      portionIdx: i.portionIdx,
      food: i.food, // keep full food object for re-scoring
    })),
    score: getMealScore(meal.items),
  };
  favs.unshift(entry);
  storageSet('favorites', favs.slice(0, 20)); // cap at 20
  return entry;
}

export function deleteFavorite(id) {
  const favs = getFavorites().filter(f => f.id !== id);
  storageSet('favorites', favs);
}

// ── Templates ────────────────────────────────────────────

export function getTemplates() {
  return storageGet('templates') || [];
}

export function saveTemplate(meal) {
  const templates = getTemplates();
  const entry = {
    id: Date.now().toString(),
    name: meal.name || 'My Template',
    createdAt: new Date().toISOString(),
    items: meal.items.map(i => ({
      foodId: i.food.id,
      foodName: i.food.name,
      grams: i.grams,
      portionIdx: i.portionIdx,
      food: i.food,
    })),
    score: getMealScore(meal.items),
  };
  templates.unshift(entry);
  storageSet('templates', templates.slice(0, 20));
  return entry;
}

export function deleteTemplate(id) {
  const templates = getTemplates().filter(t => t.id !== id);
  storageSet('templates', templates);
}

// ── Recent meals ─────────────────────────────────────────

/**
 * Get recent logged meals across last N days (default 7)
 */
export function getRecentMeals(days) {
  const n = days || 7;
  const results = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const log = getLog(dateKey);
    log.forEach(entry => results.push({ ...entry, date: dateKey }));
  }
  return results
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 15);
}

// ── Meal flags ───────────────────────────────────────────

export const MEAL_FLAGS = [
  { value: 'fasting_break', label: 'Fasting break',  color: '#00C9A7', icon: '◑' },
  { value: 'pre_workout',   label: 'Pre-workout',    color: '#F5A623', icon: '↑' },
  { value: 'post_workout',  label: 'Post-workout',   color: '#F5A623', icon: '↓' },
  { value: 'pre_game',      label: 'Pre-game',       color: '#E84545', icon: '▶' },
  { value: 'post_game',     label: 'Post-game',      color: '#E84545', icon: '■' },
  { value: 'rest_day',      label: 'Rest day',       color: '#5a7a96', icon: '—' },
  { value: 'recovery',      label: 'Recovery',       color: '#3a7a96', icon: '~' },
  { value: 'refeed',        label: 'Refeed',         color: '#9b59b6', icon: '⚡' },
];

export function getFlagByValue(value) {
  return MEAL_FLAGS.find(f => f.value === value) || null;
}
