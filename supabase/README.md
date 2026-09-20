# Supabase — SAHYOG (SIH26043)

Project ref: `cxpaorwqkirspvlxatqt`

---

## Layout

```
supabase/
├── schema.sql                          ← one-shot installer for a FRESH project
├── migrations/
│   ├── 001_audit_fixes.sql             ← view safety, function search_path, indexes
│   ├── 002_security_hardening.sql      ← ⚠ P0: RLS + public-role lockdown
│   └── 003_seed_vote_realism.sql       ← demo traction backfill + view rebuild
└── README.md
```

**`schema.sql` creates everything. The `migrations/` folder brings an
already-populated database up to the same secure state.** Apply migrations in
filename order; they are all idempotent and safe to re-run.

---

## Fresh project (recommended)

1. Supabase dashboard → **SQL Editor → New query**
2. Paste **all** of `schema.sql` → **Run** (~10s).
   This creates tables, RLS policies, indexes, the storage bucket and the
   24-problem demo corpus.
3. Paste and run each file in `migrations/` in ascending order.

## Existing / already-deployed project

Run `migrations/001` → `002` → `003` in order. Nothing else to do — all
application writes go through the service-role key and are unaffected.

---

## Security posture

The public **anon key is embedded in the browser bundle**; treat it as public.

| Table | anon can | authenticated can | service role |
|---|---|---|---|
| `problems` | SELECT | SELECT | full |
| `proposals` | SELECT | SELECT | full |
| `industry_interest` | SELECT | SELECT | full |
| `problem_votes` | SELECT | SELECT | full |
| `users` | — (revoked) | SELECT | full |
| `notifications` | — | SELECT (own audience only) | full |

**No public role may INSERT / UPDATE / DELETE anything.** Every mutation is
performed server-side in `app/api/*` via `getAdminClient()`, which uses
`SUPABASE_SERVICE_ROLE_KEY` and bypasses RLS entirely.

### Verification

Run with the **anon** key — every one of these must fail:

```bash
BASE="https://cxpaorwqkirspvlxatqt.supabase.co/rest/v1"
ANON="<anon key>"
H=(-H "apikey: $ANON" -H "Authorization: Bearer $ANON" -H "Content-Type: application/json")

# 1. anonymous write → expect 401/403
curl -si "${H[@]}" -X POST "$BASE/problems" \
  -d '{"title":"x","description":"y","district":"Ranchi"}' | head -1

# 2. anonymous row tampering → expect 401/403
curl -si "${H[@]}" -X PATCH "$BASE/problems?id=eq.<uuid>" -d '{"demo_votes":0}' | head -1

# 3. PII enumeration → expect 401/403
curl -si "${H[@]}" "$BASE/users?select=email" | head -1

# 4. public read still works → expect 200
curl -si "${H[@]}" "$BASE/problems?select=id" | head -1
```

Repeat 1–3 with the **service role** key — all must return 200/201.

---

## Schema notes / known constraints

- **`notifications.send_to` is free text**, not a foreign key. It holds either a
  role (`citizen` / `admin` / `university`) or an email address. The RLS policy
  in `002` therefore matches on role **or** email rather than a user id.
  *Follow-up for multi-tenant scale:* add
  `recipient_id uuid references users(id)` and match on that instead.
- **`problems.demo_votes`** is demo traction layered on top of real votes by the
  `problems_with_votes` view. `problem_votes` remains the source of truth for
  genuine citizen support. Drop the column (and the view term) before a real
  pilot launch.
- **`problems_with_votes`** uses `security_invoker = true` so the caller's RLS
  applies. Do not remove that option — without it the view bypasses RLS.
- **Storage:** bucket `problems` is public-read with authenticated uploads.
  Problem photos are uploaded client-side (see `CitizenPortal.jsx`).
