# SAHYOG Portal — SIH26043 · Government of Jharkhand

**Production app: Next.js 14 + Supabase + real AI pipeline. Zero monthly cost.**

---

## ⚡ Quick start (5 minutes)

1. **Install dependencies** (first time only):
   ```
   npm install
   ```
2. **Paste your keys** into `.env` (already created — open it and fill the values).
3. **Create the database**: Supabase dashboard → SQL Editor → New query → paste ALL of `supabase/schema.sql` → **Run**. This creates every table + 24 realistic seed problems + demo accounts.
4. **Start the app**:
   ```
   npm run dev
   ```
5. Open **http://localhost:3000** → "Sign in" → **tap any demo role button** (Citizen/University/Industry/Government — one tap, no typing).

> No Groq key yet? The app still works fully — classification falls back to the
> built-in explainable keyword engine and dedup to token-similarity. Add the key
> later for LLM-powered classification and arbitrated dedup; nothing else changes.

## Demo accounts (seeded by schema.sql, password `setu1234`)

| Role | Email |
|---|---|
| Citizen | `priya@demo.setu` |
| University | `hod.che@demo.setu` (Central Univ. of Jharkhand — water/agri/health) |
| Industry | `csr@tatasf.setu` (Tata Steel Foundation) |
| Government | `admin@demo.setu` |

One-tap buttons on the sign-in page sign you in as each role directly.

## The 3-minute judge demo

1. **Citizen → Report a problem** — fill form, tap "Detect my location", submit → watch the
   4-step AI panel run live (classify → dedup → priority → route). *(wow #1)*
2. Submit the duplicate phrase: *"The hand pump serving our village has been broken and dry
   for weeks, we need urgent repair"* → flagged as a duplicate, **merged as a vote**, no new
   ticket. *(wow #2)*
3. **University** → Routed problems → "Form team & propose" → status advances, SMS logged.
4. **Industry** → Discover (focus-sorted) → "Express interest" → problem goes `in_progress`.
5. **Government** → live analytics: district bars, category donut, lifecycle funnel,
   searchable audit table, notification log.
6. **Citizen → My problems** → lifecycle stepper + explainable priority formula.

## What's real vs simulated

| Feature | Status |
|---|---|
| Auth, submission, AI classify/dedup/priority/routing, proposals, industry interest, analytics, lifecycle, notification log | **Real — Supabase-backed** |
| AI classification | **Real Groq LLM call if `GROQ_API_KEY` set**; otherwise explainable keyword engine |
| Dedup | **Real** — spatial (≤5 km) + token-cosine pre-filter, then a Groq arbiter. pgvector embeddings are schema-ready (`problems.embedding`) but not yet wired |
| Photo upload | **real Supabase Storage upload** (public bucket `problems`, auto-created by schema.sql) — falls back to submitting without the photo if Storage is unreachable |
| SMS/Email | simulated — every message written to `notifications` table |
| Aadhaar SSO, regional NLP, NIC MeghRaj | roadmap (shown on landing) |

## Deploy to a live URL (Cloudflare, free)

```bash
npm i -g wrangler
npx wrangler login
# Use the Cloudflare dashboard: Workers & Pages → Create → Pages →
# Connect this repo (framework: Next.js) → add the same env vars from
# .env as build-time secrets → Deploy.
```
Then in Cloudflare dashboard → Workers & Pages → your project → Settings → Variables: add
the same keys from `.env` (Supabase URL, anon key, service role key, Groq/Gemini optional).
Warm up Supabase the morning of demo day (free projects pause after 7 idle days).

## Project structure

```
app/
  page.jsx            landing
  login/page.jsx      auth (signup with role/domain picker + 1-tap demo logins)
  portal/page.jsx     role router + shared data layer (client component)
  api/submit          problem submission → classify → dedup → priority → route
  api/proposal        university proposal → status advance + notification log
  api/interest        industry interest → status advance + notifications
  api/status          lifecycle transitions (admin + routed university)
  api/vote            citizen vote toggle (authoritative count returned)
  api/profile         profile resolution + post-signup row creation
  api/ai-proposal     AI proposal drafting (university/admin)
  api/suggest-description   AI auto-description (authenticated)
  api/feed            public landing feed (latest problems)
  api/demo-login      1-tap demo credentials (disable with ALLOW_DEMO_LOGINS=false)
  api/health          env + database reachability probe
components/
  GovHeaderFooter.jsx official utility bar + footer
  landing.jsx         landing sections (bridge panel, journey, districts, roles)
  portal/             CitizenPortal · UniversityPortal · IndustryPortal · AdminPortal
  ui/                 design-system primitives (Shell, Modal, Toasts, Stepper, Map…)
  error/              global error boundary + fallback
lib/
  ai.js               classify · dedup · priority · route · proposal drafting
  server-auth.js      service-role client + session → profile resolution
  supabase.js         browser client (client-safe only)
  i18n.js             en / hi / bn / sat / ur string tables
  districts.js        the 24 Jharkhand districts (shared client + server)
scripts/
  verify-tokens.mjs   design-token integrity guard (see below)
middleware.js         session refresh + /portal guard
supabase/
  schema.sql          one-shot installer (tables, policies, seed)
  migrations/         ordered, idempotent migrations for existing projects
  README.md           schema, security posture, verification queries
tests/                live AI pipeline + Supabase contract checks
```

## Verify before you ship

```bash
npm run verify        # design tokens → lint → typecheck → live test suites
```

`npm run test:e2e` additionally exercises the real HTTP surface (session →
profile resolution, auth guards). Start the server first, then point the script
at it:

```bash
npm run build && npm start &      # or: npm run dev
node tests/e2e-server-auth.mjs http://localhost:3000
```

`verify:tokens` guards a Tailwind trap that previously silently broke styling:
a colour declared as a raw `var(--x)` emits **no CSS** for opacity modifiers
(`bg-surface/95`, `text-paper/70`). Every design token is therefore declared as
`rgb(var(--x-rgb) / <alpha-value>)` with a channel triplet in `globals.css`, and
the script asserts the hex values and the triplets never drift apart — including
across the `.theme-night` override.

Lint also enables `no-undef`. `next/core-web-vitals` does not turn it on, which
is how a `ReferenceError` inside `lib/server-auth.js` previously compiled clean,
passed the build, and only surfaced on a live request.

## Architecture notes (for the pitch)

- **Modular monolith by choice** — one deployable unit; no Kafka/K8s at this
  scale. Production path: NIC MeghRaj, same schema.
- **Explainable AI** — the priority formula is transparent and shown to
  citizens; routing decisions are auditable in the admin routing view.
- **Free-tier stack**: Cloudflare Pages · Supabase free (Postgres + pgvector) ·
  Groq free tier · Gemini free embeddings — **₹0/month**.
- **AI classification** calls Groq via `GROQ_MODEL_FAST` / `GROQ_MODEL_DEEP`
  (default `groq/compound-mini`) and reports the actual model id back to the
  client, so the UI never claims a model that was not called.
