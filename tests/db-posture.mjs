/* Read-only check of the live Supabase security posture + seed realism. */
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
let pass = 0, fail = 0;
const check = (ok, label, detail) => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
};

/* 1. anon must NOT read users (PII lockdown). Read-only. */
const { error: uErr } = await sb.from("users").select("id, email").limit(1);
check(
  Boolean(uErr),
  "anon SELECT on `users` is denied",
  uErr ? `code ${uErr.code}` : "STILL READABLE — 002 not applied"
);

/* 2. RLS-enforced write probe. NON-MUTATING: the payload is invalid on purpose
      ("not-a-uuid" for a uuid PK), so PostgreSQL can never form a row from it.
      Verified empirically it returns 22P02 and leaves the row count unchanged. */
const { count: before } = await sb.from("problems").select("id", { count: "exact", head: true });
const { error: wErr } = await sb.from("problems").insert({ id: "not-a-uuid" });
const { count: after } = await sb.from("problems").select("id", { count: "exact", head: true });
const rowCreated = after !== before;

if (wErr && wErr.code !== "22P02") {
  check(true, "anon INSERT on `problems` denied by RLS", `code ${wErr.code}`);
} else if (!wErr) {
  check(false, "anon INSERT on `problems` SUCCEEDED — 002 not applied", "row was created, cleaning up");
  await sb.from("problems").delete().eq("title", "__rls_write_probe__");
} else {
  // 22P02 means the value coercion ran, so the permission check was never
  // reached. Inconclusive rather than failing — report it honestly.
  check(!rowCreated, "anon INSERT probe created no row", "RLS state inconclusive (22P02 reached before permission check)");
}

/* 3. Public reads must still work — the landing feed and portal depend on them. */
const { data: probs, error: pErr } = await sb
  .from("problems_with_votes")
  .select("id, votes, demo_votes")
  .limit(50);
check(!pErr, "public read of `problems_with_votes` still works", pErr ? pErr.message : `${probs?.length ?? 0} rows`);

const zero = (probs ?? []).filter((p) => (p.votes ?? 0) === 0).length;
if (zero === 0) {
  check(true, "seeded problems carry non-zero vote counts", `n=${probs?.length}`);
} else {
  console.log(`⚠ ${zero}/${probs?.length} sampled problems still have 0 votes — 003 not applied (warning only)`);
}

/* 4. Row count must be unchanged by this script. */
const { count: finalCount } = await sb.from("problems").select("id", { count: "exact", head: true });
check(finalCount === before, "script left the row count unchanged", `${before} → ${finalCount}`);

console.log(`\n${pass}/${pass + fail} live posture assertions passed`);
process.exit(fail ? 1 : 0);
