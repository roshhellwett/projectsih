/* ═══════════ Supabase clients ═══════════ */
/*
 * This module is imported by CLIENT components ("use client"), so it must stay
 * browser-safe: it may only ever touch NEXT_PUBLIC_* configuration.
 *
 * The service-role (admin) client deliberately lives in ./server-auth.js —
 * importing it here would put server-only config on the client bundle's import
 * graph. lib/ai.js uses the server-auth one.
 */
import { createBrowserClient } from "@supabase/ssr";

let browserClient = null;

export function supabase() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_PUBLISHABLE_KEY
    );
  }
  return browserClient;
}

