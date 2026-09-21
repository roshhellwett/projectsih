"use client";

/* ════════════════════════════════════════════════════════════════
   SAHYOG Portal Controller — Multi-Role Architecture
   - Session & Profile Resolution (Auth & Fallbacks)
   - Real-Time Supabase Sync (Live updates on problems/votes/status)
   - Role-Based Portal Delegation (Citizen / Uni / Industry / Admin)
   ════════════════════════════════════════════════════════════════ */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ToastStack, useToasts, JharkhandStateSeal } from "@/components/ui";

import CitizenPortal from "@/components/portal/CitizenPortal";
import UniversityPortal from "@/components/portal/UniversityPortal";
import IndustryPortal from "@/components/portal/IndustryPortal";
import AdminPortal from "@/components/portal/AdminPortal";

export default function Portal() {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dash");
  const [problems, setProblems] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [interests, setInterests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackId, setTrackId] = useState(null);
  const [mapCat, setMapCat] = useState("all");
  const [votedIds, setVotedIds] = useState(new Set());

  /* ─── Fetch All Portal Data ─── */
  const loadAll = useCallback(async (u) => {
    const activeUser = u || user;
    const sb = supabase();
    try {
      const [pb, pr, inr, nt, vd, vc] = await Promise.all([
        sb
          .from("problems")
          .select("*, routed_to_user:users!problems_routed_to_fkey(name), submitted_by_user:users!problems_submitted_by_fkey(name)")
          .order("created_at", { ascending: false })
          .limit(200),
        sb
          .from("proposals")
          .select("*, problem:problems(*)")
          .order("created_at", { ascending: false })
          .limit(100),
        sb
          .from("industry_interest")
          .select("*, proposal:proposals(*, problem:problems(*))")
          .order("created_at", { ascending: false })
          .limit(100),
        sb
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(30),
        activeUser
          ? sb.from("problem_votes").select("problem_id").eq("user_id", activeUser.id)
          : Promise.resolve({ data: [] }),
        // `problems` has no `votes` column — the count only exists on the
        // problems_with_votes view. Without this merge, every consumer that
        // reads p.votes directly (notably the admin audit CSV export) reports 0.
        sb.from("problems_with_votes").select("id, votes").limit(200),
      ]);

      const voteCounts = new Map((vc.data || []).map((v) => [v.id, v.votes]));
      setProblems(
        (pb.data || []).map((p) => ({
          ...p,
          votes: voteCounts.has(p.id) ? voteCounts.get(p.id) : (p.demo_votes ?? 0),
        }))
      );
      setProposals(pr.data || []);
      setInterests(inr.data || []);
      setNotifications(nt.data || []);
      setVotedIds(new Set((vd.data || []).map((v) => v.problem_id)));
    } catch (err) {
      console.error("Data load error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /* ─── Initialize Session ─── */
  useEffect(() => {
    (async () => {
      const sb = supabase();
      const { data: { user: au } } = await sb.auth.getUser();
      if (!au) {
        router.push("/login");
        return;
      }

      // Attempt 1: by auth_id
      const { data: profile } = await sb.from("users").select("*").eq("auth_id", au.id).maybeSingle();
      let prof = profile;

      // Attempt 2: via server-side profile API
      if (!prof) {
        try {
          const res = await fetch("/api/profile");
          const j = await res.json();
          if (j?.ok && j?.profile) {
            prof = j.profile;
          }
        } catch {}
      }

      // Attempt 3: by email
      if (!prof && au.email) {
        const { data: byEmail } = await sb.from("users").select("*").eq("email", au.email).maybeSingle();
        prof = byEmail;
      }

      if (!prof) {
        push("Account Pending", "No profile linked to this login. Please sign in with a demo account.", "warn", 6000);
        router.push("/login");
        return;
      }

      setUser(prof);
      loadAll(prof);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Supabase Realtime Subscription ─── */
  useEffect(() => {
    const sb = supabase();
    const channel = sb
      .channel("portal-realtime-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "problems" },
        () => {
          loadAll();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "proposals" },
        () => {
          loadAll();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "industry_interest" },
        () => {
          loadAll();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          if (payload.new) {
            setNotifications((prev) => [payload.new, ...prev.slice(0, 29)]);
          }
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [loadAll]);

  /* ─── Vote Action ─── */
  async function handleVote(pid) {
    if (!user) return;
    try {
      const r = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_id: pid, user_id: user.id }),
      });
      const j = await r.json();
      if (j.ok) {
        setVotedIds((s) => {
          const n = new Set(s);
          j.voted ? n.add(pid) : n.delete(pid);
          return n;
        });
        // Trust the server's authoritative count (real votes + demo traction)
        // instead of guessing from an optimistic delta.
        setProblems((ps) =>
          ps.map((p) => (p.id === pid && typeof j.votes === "number" ? { ...p, votes: j.votes } : p))
        );
        push(j.voted ? "Vote added" : "Vote removed", j.voted ? "Urgency priority increased" : "", "ok", 2200);
      } else {
        push("Vote failed", j.error || "Please try again.", "warn");
      }
    } catch (err) {
      push("Vote failed", err.message, "warn");
    }
  }

  /* ─── Sign Out ─── */
  async function signOut() {
    await supabase().auth.signOut();
    router.push("/");
  }

  const resolveName = (u) => {
    if (!u) return null;
    if (Array.isArray(u)) return u[0]?.name || null;
    if (typeof u === "object") return u.name || null;
    return null;
  };

  const problemWithMeta = (p) => ({
    ...p,
    votes: p.votes ?? p.demo_votes ?? 0,
    routed_to_name: resolveName(p.routed_to_user),
    submitted_by_name: resolveName(p.submitted_by_user),
    viewer_voted: votedIds.has(p.id),
  });

  /* ─── Loading Screen ─── */
  if (loading || !user) {
    return (
      <div className="min-h-dvh grid place-items-center bg-paper text-ink p-6">
        <div className="flex flex-col items-center justify-center text-center max-w-sm">
          <div className="flex items-center justify-center mb-4 animate-pulse">
            <JharkhandStateSeal size={64} />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mb-1">
            SAHYOG <span className="font-deva text-amber-500 text-lg font-bold">(सहयोग)</span>
          </h2>
          <p className="text-xs font-mono tracking-wider text-green-2 font-semibold uppercase mb-3">
            Government of Jharkhand · झारखण्ड सरकार
          </p>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-ink-3 uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-green animate-ping" />
            {loading ? "SYNCHRONIZING PORTAL DATA…" : "INITIALIZING SESSION…"}
          </div>
        </div>
      </div>
    );
  }

  const role = user.role;
  const myProblems = problems.filter((p) => p.submitted_by === user.id);
  const routedToMe = problems.filter((p) => p.routed_to === user.id);
  const myProposals = proposals.filter((p) => p.university_id === user.id);
  const myInterests = interests.filter((i) => i.industry_id === user.id);

  return (
    <>
      <ToastStack toasts={toasts} dismiss={dismiss} />

      {role === "citizen" && (
        <CitizenPortal
          user={user}
          problems={problems}
          myProblems={myProblems}
          notifications={notifications}
          proposals={proposals}
          interests={interests}
          votedIds={votedIds}
          onVote={handleVote}
          onSignOut={signOut}
          push={push}
          setProblems={setProblems}
          loadAll={loadAll}
          view={view}
          setView={setView}
          trackId={trackId}
          setTrackId={setTrackId}
          mapCat={mapCat}
          setMapCat={setMapCat}
          problemWithMeta={problemWithMeta}
        />
      )}

      {role === "university" && (
        <UniversityPortal
          user={user}
          routedToMe={routedToMe}
          myProposals={myProposals}
          interests={interests}
          problems={problems}
          onSignOut={signOut}
          push={push}
          loadAll={loadAll}
          view={view}
          setView={setView}
          trackId={trackId}
          setTrackId={setTrackId}
        />
      )}

      {role === "industry" && (
        <IndustryPortal
          user={user}
          proposals={proposals}
          myInterests={myInterests}
          interests={interests}
          problems={problems}
          onSignOut={signOut}
          push={push}
          loadAll={loadAll}
          view={view}
          setView={setView}
          trackId={trackId}
          setTrackId={setTrackId}
        />
      )}

      {role === "admin" && (
        <AdminPortal
          user={user}
          problems={problems}
          proposals={proposals}
          interests={interests}
          notifications={notifications}
          onSignOut={signOut}
          push={push}
          loadAll={loadAll}
          view={view}
          setView={setView}
          trackId={trackId}
          setTrackId={setTrackId}
        />
      )}
    </>
  );
}
