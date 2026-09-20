import { createClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase client with service-role privileges (bypassing RLS).
 * Use only for verified, server-side actions.
 *
 * IMPORTANT: there is deliberately NO fallback to the anon key. Silently
 * degrading to anon made every write fail with a confusing RLS error instead of
 * a clear configuration fault. Every mutation path in this app depends on the
 * service role, so a missing key is a hard misconfiguration and must surface
 * loudly.
 *
 * Kept separate from ./server-auth.js because that module imports
 * `next/headers`, which is unavailable outside the Next.js server runtime.
 * lib/ai.js is imported by the plain-Node test suites, so it must depend on
 * this module rather than on server-auth.
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url) {
    throw new Error("Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL is missing.");
  }
  if (!key) {
    throw new Error(
      "Supabase is not configured: SUPABASE_SERVICE_ROLE_KEY is missing. " +
        "Server-side writes cannot be performed without it — see .env.example."
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/** True when the service-role or secret key is present, so callers can fail fast. */
export function isServiceRoleConfigured() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY);
}
