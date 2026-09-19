"use client";

/* ════════════════════════════════════════════════════════════════
   SETU Portal Controller — Multi-Role Architecture
   - Session & Profile Resolution (Auth & Fallbacks)
   - Real-Time Supabase Sync (Live updates on problems/votes/status)
   - Role-Based Portal Delegation (Citizen / Uni / Industry / Admin)
   ════════════════════════════════════════════════════════════════ */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ToastStack, useToasts } from "@/components/ui";

import CitizenPortal from "@/components/portal/CitizenPortal";
import UniversityPortal from "@/components/portal/UniversityPortal";
import IndustryPortal from "@/components/portal/IndustryPortal";
import AdminPortal from "@/components/portal/AdminPortal";

export default function Portal() {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
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
      const [pb, pr, inr, nt, vd] = await Promise.all([
        sb
          .from("problems")
          .select("*, routed_to_user:users!problems_routed_to_fkey(name), submitted_by_user:users!problems_submitted_by_fkey(name)")
          .order("created_at", { ascending: false })
          .limit(200),
        sb
          .from("proposals")
          .select("*, problem:problems(title,category,district,status)")
          .order("created_at", { ascending: false })
          .limit(100),
        sb
          .from("industry_interest")
          .select("*, proposal:proposals(*, problem:problems(title,category,district,status))")
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
      ]);

      setProblems(pb.data || []);
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
      setAuthUser(au);

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
        setProblems((ps) =>
          ps.map((p) =>
            p.id === pid
              ? { ...p, demo_votes: Math.max(0, (p.demo_votes || 0) + (j.voted ? 1 : -1)) }
              : p
          )
        );
        push(j.voted ? "Vote added" : "Vote removed", j.voted ? "Urgency priority increased" : "", "ok", 2200);
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

  const problemWithMeta = (p) => ({
    ...p,
    votes: p.votes ?? p.demo_votes ?? 0,
    routed_to_name: p.routed_to_user
      ? Array.isArray(p.routed_to_user)
        ? p.routed_to_user[0]?.name
        : p.routed_to_user.name
      : null,
    viewer_voted: votedIds.has(p.id),
  });

  /* ─── Loading Screen ─── */
  if (loading || !user) {
    return (
      <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "var(--paper)" }}>
        <div style={{ textAlign: "center" }}>
          <div className="brand" style={{ justifyContent: "center", marginBottom: 14 }}>
            <span className="brand-mark">सेतु</span>
            <b>SETU Portal</b>
          </div>
          <p className="mono">{loading ? "SYNCHRONIZING PORTAL DATA…" : "REDIRECTING…"}</p>
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
