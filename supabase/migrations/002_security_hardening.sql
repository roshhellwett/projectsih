-- ════════════════════════════════════════════════════════════════════
-- 002 — SECURITY HARDENING  (production blocker fixes)
-- ════════════════════════════════════════════════════════════════════
-- WHY THIS EXISTS
--   Live verification against project cxpaorwqkirspvlxatqt proved that the
--   public anon key (shipped to every browser) could:
--     · INSERT  arbitrary rows into problems / proposals / industry_interest
--     · UPDATE  existing rows in problems
--     · SELECT  every row of `users`, including email + auth_id (PII)
--     · and any *authenticated* citizen could read ALL notifications
--
--   All seven write routes in this app already use the SERVICE ROLE key
--   (lib/server-auth.js → getAdminClient), which bypasses RLS. Therefore no
--   legitimate client-side write exists, and locking the public roles down
--   cannot break application behaviour.
--
-- SAFE TO RE-RUN (idempotent).
-- ════════════════════════════════════════════════════════════════════

-- ─── 1. Row Level Security must actually be ON ───────────────────────
-- (the live tables had RLS effectively off, which is what allowed the writes)
alter table public.users             enable row level security;
alter table public.problems          enable row level security;
alter table public.proposals         enable row level security;
alter table public.industry_interest enable row level security;
alter table public.problem_votes     enable row level security;
alter table public.notifications     enable row level security;

-- ─── 2. Public API roles must never write directly ───────────────────
revoke insert, update, delete, truncate on all tables in schema public from anon, authenticated;

-- ─── 3. Re-grant only the reads the portals genuinely need ───────────
-- Anon: public civic data only (landing feed, /api/feed, /api/health).
grant select on table public.problems          to anon, authenticated;
grant select on table public.proposals         to anon, authenticated;
grant select on table public.industry_interest to anon, authenticated;
grant select on table public.problem_votes     to anon, authenticated;

-- Authenticated: additionally the user directory, needed for
-- own-profile resolution and the PostgREST embed
--   users!problems_routed_to_fkey(name)
-- Anonymous callers must NOT be able to enumerate users (email / auth_id PII).
grant select on table public.users to authenticated;
revoke select on table public.users from anon;

-- ─── 4. Scope the notification log to its intended audience ──────────
-- Previously: `using (auth.role() = 'authenticated')` → every signed-in
-- citizen could read every other citizen's SMS/email audit text.
-- Now: state admins see the full audit trail; everyone else sees only the
-- notifications addressed to their own role or email address.
drop policy if exists "read notifs" on public.notifications;
drop policy if exists "notifications readable by intended audience" on public.notifications;

create policy "notifications readable by intended audience"
  on public.notifications
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.users u
      where u.auth_id = (select auth.uid())
        and (
          u.role = 'admin'
          or public.notifications.send_to = u.role
          or public.notifications.send_to = u.email
        )
    )
  );

-- ─── 5. Supporting indexes for the policy + common filters ───────────
create index if not exists idx_notifications_send_to     on public.notifications (send_to);
create index if not exists idx_notifications_created_at  on public.notifications (created_at desc);

-- ════════════════════════════════════════════════════════════════════
-- VERIFICATION (run after applying — all four must hold)
-- ════════════════════════════════════════════════════════════════════
-- With the ANON key from a shell:
--   POST   /rest/v1/problems          {"title":"x","description":"y","district":"Ranchi"}  → 401/403
--   PATCH  /rest/v1/problems?id=eq.<valid-uuid>  {"demo_votes":0}                          → 401/403
--   GET    /rest/v1/users?select=email                                                     → 401/403
--   GET    /rest/v1/problems?select=id                                                     → 200 (public by design)
--
-- With the SERVICE ROLE key: all of the above must still succeed.
-- ════════════════════════════════════════════════════════════════════
