// ─────────────────────────────────────────────────────────
// STORAGE UTILITY
// Abstraction layer over localStorage.
// All keys are namespaced by userId so Layer 3 migration
// to Supabase requires only swapping this module — no
// changes to components or business logic.
//
// Current userId: stored in localStorage as 'mis_active_user'
// Default: 'local_user' (single user, no auth)
// Layer 3: replace getActiveUser() with Supabase session uid
// ─────────────────────────────────────────────────────────

const APP_PREFIX = 'mis';

/**
 * Get the active user identifier.
 * Layer 3: replace this with Supabase auth session user id.
 */
export function getActiveUser() {
  try {
    return localStorage.getItem('mis_active_user') || 'local_user';
  } catch {
    return 'local_user';
  }
}

/**
 * Build a namespaced storage key
 * Format: mis_{userId}_{key}
 */
function buildKey(key, userId) {
  const uid = userId || getActiveUser();
  return `${APP_PREFIX}_${uid}_${key}`;
}

/**
 * Get a value from localStorage
 * Returns parsed JSON or null if missing/corrupt
 */
export function storageGet(key, userId) {
  try {
    const raw = localStorage.getItem(buildKey(key, userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Set a value in localStorage
 * Silently fails if storage is full or unavailable
 */
export function storageSet(key, value, userId) {
  try {
    localStorage.setItem(buildKey(key, userId), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a value from localStorage
 */
export function storageDel(key, userId) {
  try {
    localStorage.removeItem(buildKey(key, userId));
    return true;
  } catch {
    return false;
  }
}

/**
 * Build a YYYY-MM-DD key from a Date object using LOCAL time
 * components (getFullYear/getMonth/getDate), not UTC.
 * This is the single source of truth for "what day is it" —
 * every other date-key helper and every call site across the
 * app should route through this function so the day boundary
 * always matches the device's local midnight, not UTC midnight.
 */
export function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Get today's date string in YYYY-MM-DD format (local time)
 * Used as the daily log key
 */
export function todayKey() {
  return localDateKey(new Date());
}

/**
 * Get a date string N days ago (local time)
 */
export function daysAgoKey(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return localDateKey(d);
}

/**
 * Format a timestamp for display
 * Returns "7:23 AM" style string
 */
export function formatTime(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/**
 * Format duration in minutes to human readable
 */
export function formatDuration(minutes) {
  if (!minutes || minutes < 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Calculate minutes between two ISO timestamp strings
 */
export function minutesBetween(start, end) {
  if (!start || !end) return null;
  try {
    return (new Date(end) - new Date(start)) / 60000;
  } catch {
    return null;
  }
}

/**
 * Minutes since a timestamp until now
 */
export function minutesSince(isoString) {
  if (!isoString) return null;
  try {
    return (Date.now() - new Date(isoString)) / 60000;
  } catch {
    return null;
  }
}