-- ════════════════════════════════════════════════════════════════
-- SAHYOG — Production Hardening & Audit Fixes Migration
-- Verified & applied via Supabase MCP
-- ════════════════════════════════════════════════════════════════

-- 1. Enforce SECURITY INVOKER on problems_with_votes view (PostgreSQL 15+)
-- Ensures calling user's Row Level Security policies are respected
alter view if exists public.problems_with_votes set (security_invoker = true);

-- 2. Lock mutable search_path on functions to prevent search_path spoofing
alter function public.problem_vote_count(uuid) set search_path = public, pg_temp;

-- 3. Restrict execution on internal trigger functions
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- 4. Foreign key covering indexes for high query performance & cascade locks
create index if not exists idx_industry_interest_industry_id on public.industry_interest (industry_id);
create index if not exists idx_problems_duplicate_of on public.problems (duplicate_of);
create index if not exists idx_problems_submitted_by on public.problems (submitted_by);
create index if not exists idx_proposals_university_id on public.proposals (university_id);
create index if not exists idx_users_auth_id on public.users (auth_id);

create index if not exists idx_problems_district on public.problems (district);
create index if not exists idx_problems_status on public.problems (status);
create index if not exists idx_problems_category on public.problems (category);
create index if not exists idx_problems_routed_to on public.problems (routed_to);
create index if not exists idx_proposals_problem_id on public.proposals (problem_id);
create index if not exists idx_industry_interest_proposal_id on public.industry_interest (proposal_id);
create index if not exists idx_problem_votes_user_id on public.problem_votes (user_id);

-- 5. RLS policy optimizations: wrap auth.<function>() in scalar subqueries (select auth.<function>())
drop policy if exists "users update own profile" on public.users;
create policy "users update own profile" on public.users
  for update
  using ((select auth.uid()) = auth_id);

drop policy if exists "users insert own profile" on public.users;
create policy "users insert own profile" on public.users
  for insert
  with check ((select auth.uid()) = auth_id);

drop policy if exists "read notifs" on public.notifications;
create policy "read notifs" on public.notifications
  for select
  using ((select auth.role()) = 'authenticated');
