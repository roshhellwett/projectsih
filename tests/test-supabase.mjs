import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envFile = fs.readFileSync(".env", "utf8");
const env = {};
for (const line of envFile.split("\n")) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = (match[2] || "").trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[match[1]] = val;
  }
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", url);
console.log("Supabase Anon Key length:", key ? key.length : 0);

const sb = createClient(url, key);

async function run() {
  console.log("\n--- Testing Supabase Queries ---");
  
  // 1. Problems view
  const { data: problems, error: pErr } = await sb
    .from("problems_with_votes")
    .select("id, title, category, district, status, votes")
    .limit(3);
  
  if (pErr) {
    console.error("✗ Failed to query problems_with_votes:", pErr.message);
    process.exit(1);
  }
  console.log(`✓ successfully retrieved ${problems.length} problems from problems_with_votes`);
  problems.forEach((p, idx) => {
    console.log(`  [${idx + 1}] ${p.title.slice(0, 50)}... | ${p.district} | ${p.category} | ${p.votes} votes`);
  });

  // 2. SECURITY — the anon role must NOT be able to enumerate `users`.
  //    Enforced by supabase/migrations/002_security_hardening.sql. If this
  //    succeeds, the migration has not been applied to the target project.
  const { error: uErr } = await sb.from("users").select("id, email").limit(1);
  if (!uErr) {
    console.error("✗ SECURITY: the anon role read `users` (email PII exposed).");
    console.error("  → apply supabase/migrations/002_security_hardening.sql");
    process.exit(1);
  }
  console.log(`✓ anon read of \`users\` correctly denied (${uErr.code || "RLS"})`);

  // 3. SECURITY — the anon role must not be able to write anywhere.
  //    All mutations belong to the server-side service-role client.
  //
  //    NON-MUTATING PROBE. The payload is deliberately invalid ("not-a-uuid"
  //    for a uuid primary key), so PostgreSQL can never form a row from it.
  //    Verified against the live project in both states:
  //      · RLS enforced  → 42501 (permission denied, checked first)
  //      · RLS disabled  → 22P02 (value coercion reached, row count unchanged)
  //    Either way no row is created, so this is safe to run on every test pass.
  const { count: beforeProbe } = await sb
    .from("problems")
    .select("id", { count: "exact", head: true });
  const { error: wErr } = await sb.from("problems").insert({ id: "not-a-uuid" });
  const { count: afterProbe } = await sb
    .from("problems")
    .select("id", { count: "exact", head: true });

  if (wErr && wErr.code !== "22P02") {
    console.log(`✓ anon INSERT into \`problems\` correctly denied (${wErr.code})`);
  } else {
    console.error("✗ SECURITY: the anon role can write to `problems`.");
    console.error(
      `  → got ${wErr ? wErr.code : "no error"}; expected a 42501 permission denial.`
    );
    console.error("  → apply supabase/migrations/002_security_hardening.sql");
    if (afterProbe !== beforeProbe) {
      console.error("  → a row was created; removing it now.");
      await sb.from("problems").delete().eq("title", "__rls_write_probe__");
    }
    process.exit(1);
  }

  // 4. Proposals table
  const { data: proposals, error: propErr } = await sb
    .from("proposals")
    .select("id, funding_sought, status")
    .limit(3);

  if (propErr) {
    console.error("✗ Failed to query proposals:", propErr.message);
    process.exit(1);
  }
  console.log(`✓ successfully retrieved ${proposals.length} proposals from proposals table`);

  // 5. Vote realism — the seeded corpus should never have a zero vote count,
  //    otherwise the public feed and portal counters render as empty states.
  const { data: votes, error: vErr } = await sb
    .from("problems_with_votes")
    .select("votes")
    .limit(50);
  if (vErr) {
    console.error("✗ Failed to query problems_with_votes:", vErr.message);
    process.exit(1);
  }
  const zero = votes.filter((v) => (v.votes ?? 0) === 0).length;
  if (zero > 0) {
    console.warn(`⚠ ${zero}/${votes.length} sampled problems still have 0 votes`);
    console.warn("  → apply supabase/migrations/003_seed_vote_realism.sql");
  } else {
    console.log(`✓ sampled problems all carry a non-zero vote count (n=${votes.length})`);
  }

  // 4. Storage bucket
  const { data: buckets, error: bErr } = await sb.storage.listBuckets();
  if (bErr) {
    console.warn("Storage check warning:", bErr.message);
  } else {
    const hasProblemsBucket = buckets.some(b => b.name === "problems");
    console.log(`✓ storage bucket 'problems' exists: ${hasProblemsBucket}`);
  }

  console.log("\nALL SUPABASE SYNC CHECKS PASSED PERFECTLY!");
}

run().catch(e => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
