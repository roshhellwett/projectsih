/* One-shot end-to-end check of lib/server-auth.js against a running server. */
import fs from "node:fs";

const BASE = process.argv[2] || "http://localhost:3111";
const env = {};
for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

let pass = 0, fail = 0;
const check = (ok, label, detail) => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
};

const j = async (path, opts = {}) => {
  const r = await fetch(BASE + path, opts);
  let body = null;
  try { body = await r.json(); } catch {}
  return { status: r.status, body };
};

/* 1. Unauthenticated request must be 401, NOT the 500 ReferenceError we shipped. */
const anonVote = await j("/api/vote", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ problem_id: "00000000-0000-4000-b000-000000000001" }),
});
check(
  anonVote.status === 401,
  "POST /api/vote without a session returns 401 (not 500)",
  `got ${anonVote.status}`
);

/* 2. Same for the AI route, which is now auth-guarded. */
const anonAi = await j("/api/suggest-description", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "broken hand pump" }),
});
check(anonAi.status === 401, "POST /api/suggest-description without a session returns 401", `got ${anonAi.status}`);

/* 3. Exercise getAuthenticatedUser() fully with a REAL session. */
const demo = await j("/api/demo-login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ role: "citizen" }),
});
check(demo.status === 200 && demo.body?.ok, "POST /api/demo-login issues demo credentials", demo.body?.email);

let token = null;
if (demo.body?.email) {
  const authRes = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    body: JSON.stringify({ email: demo.body.email, password: demo.body.password }),
  });
  const authJson = await authRes.json().catch(() => null);
  token = authJson?.access_token || null;
  check(Boolean(token), "Supabase password grant returns an access token", `status ${authRes.status}`);
}

if (token) {
  const profile = await j("/api/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(
    profile.status === 200 && profile.body?.ok && profile.body?.profile?.id,
    "GET /api/profile with a Bearer token resolves the profile",
    profile.body?.profile ? `role=${profile.body.profile.role}` : `got ${profile.status}`
  );
  check(
    profile.body?.profile?.role === "citizen",
    "resolved profile has the expected role",
    profile.body?.profile?.role
  );
} else {
  check(false, "skipped authenticated profile check (no token)");
}

console.log(`\n${pass}/${pass + fail} end-to-end assertions passed`);
process.exit(fail ? 1 : 0);
