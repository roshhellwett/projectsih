import { NextResponse } from "next/server";

/*
 * Env + database reachability probe used by the sign-in screen to decide
 * whether to show the first-run setup hint.
 *
 * NOTE: this must only read a table the **anon** role may SELECT. `users` is
 * intentionally revoked from anon (see supabase/migrations/002), so the probe
 * uses the public `problems` table.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !anon || url.includes("PASTE") || !url.startsWith("https://")) {
    return NextResponse.json({ ok: false, error: "env-missing" });
  }
  try {
    const r = await fetch(url + "/rest/v1/problems?select=id&limit=1", {
      headers: { apikey: anon, Authorization: "Bearer " + anon },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return NextResponse.json({ ok: r.ok, status: r.status });
  } catch {
    return NextResponse.json({ ok: false, error: "unreachable" });
  }
}

