// ─────────────────────────────────────────────────────────
// AUTH HELPERS
// All authentication operations go through these functions.
// Using magic link (passwordless) as primary auth method —
// no password to remember, secure, works on any device.
// ─────────────────────────────────────────────────────────

import { supabase } from './supabase';

/**
 * Send a magic link to the user's email.
 * User clicks the link and is signed in automatically.
 * @param {string} email
 * @returns {{ error: Error|null }}
 */
export async function signInWithMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  return { error };
}

/**
 * Sign in with email and password.
 * Used as fallback if user set a password during signup.
 * @param {string} email
 * @param {string} password
 * @returns {{ data, error }}
 */
export async function signInWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Sign up with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{ data, error }}
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  return { data, error };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the current session synchronously from cache.
 * Use this for initial render checks.
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

/**
 * Get the current user from the session.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 * @param {Function} callback - called with (event, session)
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}
