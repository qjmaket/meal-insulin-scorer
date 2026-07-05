// ─────────────────────────────────────────────────────────
// SUPABASE CLIENT
// Single instance used across the entire app.
// Environment variables are injected by Vite at build time.
// VITE_SUPABASE_URL and VITE_SUPABASE_KEY must be set in:
//   - .env (local development, never committed)
//   - Vercel Settings → Environment Variables (production)
// ─────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase environment variables. ' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set in .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
