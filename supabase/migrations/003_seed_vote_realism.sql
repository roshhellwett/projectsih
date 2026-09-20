-- ════════════════════════════════════════════════════════════════════
-- 003 — SEED VOTE REALISM (idempotent backfill)
-- ════════════════════════════════════════════════════════════════════
-- WHY THIS EXISTS
--   Live verification showed `demo_votes = 0` on all 24 seeded problems,
--   even though schema.sql intends to give the demo problems realistic
--   traction. With zeros, the landing "live bridge" panel, the portal vote
--   counters and the public vote ranking all render as an empty state.
--
--   Root cause: the `update problems set demo_votes = ...` block in
--   schema.sql ran against an empty table during the original manual setup,
--   so the seed distribution was never applied.
--
-- DESIGN
--   The values are DERIVED from the problem id, not hard-coded per row, so
--   this migration stays correct for any seed revision — including rows
--   added later. Popular seeded problems keep their intended higher counts.
--
-- SAFE TO RE-RUN: it is a pure function of (id, priority_score, age), so the
-- result is stable across runs and never compounds on real votes.
-- ════════════════════════════════════════════════════════════════════

-- Ensure the column exists (no-op when schema.sql already created it)
alter table public.problems add column if not exists demo_votes int default 0;

-- Deterministic, reproducible traction for the demo corpus.
--   base  = 8..27  derived from a stable hash of the id
--   boost = +1 per 0.25 of priority above 5.0 (popular issues rank higher)
--   only applied to rows that have never received a demo allocation,
--   so genuine citizen votes (problem_votes) are never overwritten.
update public.problems p
set demo_votes = least(
  92,
  8
  + (abs(hashtext(p.id::text)) % 20)
  + greatest(0, ceil((coalesce(p.priority_score, 5) - 5.0) / 0.25))::int
)
where p.id::text like '00000000-0000-4000-b000-%'   -- seeded corpus only
  and coalesce(p.demo_votes, 0) = 0
  and not exists (select 1 from public.problem_votes v where v.problem_id = p.id);

-- Rebuild the public read view so `votes` = real votes + demo traction.
-- security_invoker is applied via ALTER rather than in CREATE OR REPLACE, so the
-- statement stays idempotent: reloption changes are not permitted inline on an
-- existing view, but ALTER VIEW ... SET is always safe to re-run.
create or replace view public.problems_with_votes as
select
  p.*,
  (select count(*) from public.problem_votes v where v.problem_id = p.id)
    + coalesce(p.demo_votes, 0) as votes
from public.problems p;

alter view public.problems_with_votes set (security_invoker = true);

-- ════════════════════════════════════════════════════════════════════
-- VERIFY
--   select count(*) filter (where demo_votes = 0) as zero_votes,
--          min(demo_votes), max(demo_votes), avg(demo_votes)::int
--   from public.problems;
--   → zero_votes should be 0 (for the seeded corpus), max <= 92
-- ════════════════════════════════════════════════════════════════════
