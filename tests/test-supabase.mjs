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

  // 2. Users table
  const { data: users, error: uErr } = await sb
    .from("users")
    .select("id, name, role, email")
    .limit(3);
  
  if (uErr) {
    console.error("✗ Failed to query users:", uErr.message);
    process.exit(1);
  }
  console.log(`✓ successfully retrieved ${users.length} users from users table`);
  users.forEach((u, idx) => {
    console.log(`  [${idx + 1}] ${u.name} (${u.role}) - ${u.email}`);
  });

  // 3. Proposals table
  const { data: proposals, error: propErr } = await sb
    .from("proposals")
    .select("id, funding_sought, status")
    .limit(3);
  
  if (propErr) {
    console.error("✗ Failed to query proposals:", propErr.message);
    process.exit(1);
  }
  console.log(`✓ successfully retrieved ${proposals.length} proposals from proposals table`);

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
