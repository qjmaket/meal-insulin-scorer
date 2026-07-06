// ─────────────────────────────────────────────────────────
// DATABASE OPERATIONS
// All Supabase data operations go through these functions.
// Each function requires a userId (from auth session).
// RLS policies on the database enforce that users can only
// access their own rows — these functions trust that.
//
// Error handling strategy: return { data, error } consistently.
// Callers check error and handle gracefully. No throws.
// ─────────────────────────────────────────────────────────

import { supabase } from './supabase';
import { getMealScore } from '../foodData';

// ── Profile ──────────────────────────────────────────────

/**
 * Load user profile from database
 */
export async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('data')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found, expected for new users
    return { data: null, error };
  }
  return { data: data?.data || null, error: null };
}

/**
 * Save user profile to database
 * Upserts — creates if not exists, updates if exists
 */
export async function saveProfile(userId, profileData) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      name: profileData.name || '',
      data: profileData,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  return { error };
}

// ── Meal logs ─────────────────────────────────────────────

/**
 * Get all meal logs for a specific date
 */
export async function getMealLogs(userId, date) {
  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .order('timestamp', { ascending: true });

  return { data: data || [], error };
}

/**
 * Log a meal to the database
 */
export async function insertMealLog(userId, meal) {
  const date = meal.timestamp
    ? new Date(meal.timestamp).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const score = getMealScore(meal.items);

  const entry = {
    user_id: userId,
    log_date: date,
    name: meal.name || 'Meal',
    flag: meal.flag || null,
    fasting_safe: meal.fastingSafe === true,
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

  const { data, error } = await supabase
    .from('meal_logs')
    .insert(entry)
    .select()
    .single();

  return { data, error };
}

/**
 * Update a meal log entry
 */
export async function updateMealLog(userId, entryId, updates) {
  const { error } = await supabase
    .from('meal_logs')
    .update(updates)
    .eq('id', entryId)
    .eq('user_id', userId);

  return { error };
}

/**
 * Delete a meal log entry
 */
export async function deleteMealLog(userId, entryId) {
  const { error } = await supabase
    .from('meal_logs')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  return { error };
}

/**
 * Get meal logs for the last N days (for history and quick log)
 */
export async function getRecentMealLogs(userId, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', sinceStr)
    .order('timestamp', { ascending: false });

  return { data: data || [], error };
}

// ── Fasting windows ───────────────────────────────────────

/**
 * Get fasting window for a specific date
 */
export async function getFastingWindow(userId, date) {
  const { data, error } = await supabase
    .from('fasting_windows')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    return { data: null, error };
  }
  return { data: data || null, error: null };
}

/**
 * Upsert fasting window for a date
 */
export async function upsertFastingWindow(userId, date, windowData) {
  const { error } = await supabase
    .from('fasting_windows')
    .upsert({
      user_id: userId,
      log_date: date,
      ...windowData,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,log_date' });

  return { error };
}

// ── Hydration ─────────────────────────────────────────────

/**
 * Get hydration for a specific date
 */
export async function getHydration(userId, date) {
  const { data, error } = await supabase
    .from('hydration_logs')
    .select('oz')
    .eq('user_id', userId)
    .eq('log_date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    return { data: 0, error };
  }
  return { data: data?.oz || 0, error: null };
}

/**
 * Upsert hydration for a date
 */
export async function upsertHydration(userId, date, oz) {
  const { error } = await supabase
    .from('hydration_logs')
    .upsert({
      user_id: userId,
      log_date: date,
      oz,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,log_date' });

  return { error };
}

// ── Saved meals ───────────────────────────────────────────

/**
 * Get all saved meals of a type ('favorite' or 'template')
 */
export async function getSavedMeals(userId, type) {
  const { data, error } = await supabase
    .from('saved_meals')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(20);

  return { data: data || [], error };
}

/**
 * Save a meal as favorite or template
 */
export async function insertSavedMeal(userId, meal, type) {
  const score = getMealScore(meal.items);

  const { data, error } = await supabase
    .from('saved_meals')
    .insert({
      user_id: userId,
      type,
      name: meal.name || 'Saved Meal',
      items: meal.items.map(i => ({
        foodId: i.food?.id,
        foodName: i.food?.name,
        grams: i.grams,
        portionIdx: i.portionIdx || 0,
        food: i.food,
      })),
      score: score ? {
        netScore: score.netScore,
        totalGL: score.totalGL,
        totalFiber: score.totalFiber,
        totalCarbs: score.totalCarbs,
        totalProtein: score.totalProtein,
        totalFat: score.totalFat,
        rating: score.rating,
      } : null,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a saved meal
 */
export async function deleteSavedMeal(userId, id) {
  const { error } = await supabase
    .from('saved_meals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  return { error };
}

// ── Fasting window auto-update from meal log ─────────────

/**
 * Update fasting window when a meal is logged.
 * Skipped entirely if fastingSafe is true.
 * Sets first_meal if not already set for today.
 * Always updates last_meal to the most recent meal timestamp.
 */
export async function updateFastingWindowFromMeal(userId, date, timestamp, fastingSafe) {
  if (fastingSafe) return { error: null }; // explicitly skip — user says fast not broken

  const { data: current } = await getFastingWindow(userId, date);

  const ts = timestamp || new Date().toISOString();
  const updates = {
    last_meal: ts,
    // Only set first_meal if not already recorded for today
    first_meal: current?.first_meal || ts,
  };

  return upsertFastingWindow(userId, date, updates);
}

// ── Daily totals helper ───────────────────────────────────

/**
 * Calculate daily totals from an array of meal log entries
 */
export function calcDailyTotals(logs) {
  if (!logs.length) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0, netScore: 0, mealCount: 0 };
  }
  return logs.reduce((totals, entry) => {
    if (!entry.score) return totals;
    const kcal = (entry.score.totalProtein * 4) +
                 (entry.score.totalCarbs * 4) +
                 (entry.score.totalFat * 9);
    return {
      calories: totals.calories + kcal,
      protein:  totals.protein  + (entry.score.totalProtein || 0),
      carbs:    totals.carbs    + (entry.score.totalCarbs || 0),
      fat:      totals.fat      + (entry.score.totalFat || 0),
      netScore: totals.netScore + (entry.score.netScore || 0),
      mealCount: totals.mealCount + 1,
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, netScore: 0, mealCount: 0 });
}

// ── Body stats log ────────────────────────────────────────

/**
 * Get body stats entries for a user, most recent first
 * @param {string} userId
 * @param {number} limit - number of entries to return
 */
export async function getBodyStats(userId, limit = 30) {
  const { data, error } = await supabase
    .from('body_stats_log')
    .select('*')
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

/**
 * Insert or update a body stats entry for a date
 */
export async function upsertBodyStats(userId, entry) {
  const { data, error } = await supabase
    .from('body_stats_log')
    .upsert({
      user_id:      userId,
      log_date:     entry.log_date || new Date().toISOString().split('T')[0],
      weight_lbs:   entry.weight_lbs   || null,
      body_fat_pct: entry.body_fat_pct || null,
      waist_in:     entry.waist_in     || null,
      hip_in:       entry.hip_in       || null,
      neck_in:      entry.neck_in      || null,
      notes:        entry.notes        || null,
    }, { onConflict: 'user_id,log_date' })
    .select()
    .single();
  return { data, error };
}

/**
 * Delete a body stats entry
 */
export async function deleteBodyStats(userId, id) {
  const { error } = await supabase
    .from('body_stats_log')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  return { error };
}

// ── Dashboard data aggregation ────────────────────────────

/**
 * Get meal logs for the last N days grouped by date
 * Returns { date, logs, avgScore, totals } per day
 */
export async function getDashboardLogs(userId, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  const sinceStr = since.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', sinceStr)
    .order('log_date', { ascending: true });

  if (error) return { data: [], error };

  // Group by date
  const byDate = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - days + 1 + i);
    const key = d.toISOString().split('T')[0];
    byDate[key] = { date: key, logs: [], avgScore: null, totals: null };
  }

  (data || []).forEach(log => {
    if (byDate[log.log_date]) {
      byDate[log.log_date].logs.push(log);
    }
  });

  // Calculate per-day metrics
  Object.values(byDate).forEach(day => {
    if (!day.logs.length) return;
    const totals = calcDailyTotals(day.logs);
    day.totals = totals;
    day.avgScore = totals.mealCount > 0
      ? totals.netScore / totals.mealCount : null;
  });

  return { data: Object.values(byDate), error: null };
}

/**
 * Rename a saved meal (favorite or template)
 */
export async function updateSavedMealName(userId, id, name) {
  const { error } = await supabase
    .from('saved_meals')
    .update({ name })
    .eq('id', id)
    .eq('user_id', userId);
  return { error };
}
