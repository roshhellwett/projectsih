"use client";

/* ════════════════════════════════════════════════════════════════════════════
   SETU Portal — University Solver & Research Workspace
════════════════════════════════════════════════════════════════════════════ */
import { useState } from "react";
import {
  Shell,
  ProblemRow,
  Modal,
  CAT_LABEL,
  CAT_ICONS,
  STATUS_LBL,
  fmtINR,
} from "@/components/ui";
import { Input, Button, Label, Textarea } from "@/components/ui";
import ProblemDetailModal from "./ProblemDetailModal";
import {
  Tray,
  FileText,
  ListBullets,
  Sparkle,
  UsersThree,
  CurrencyInr,
  Clock,
  ArrowRight,
  GraduationCap,
  MapPin,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";

const ICON = {
  inbox: '<path d="M4 4h16v12H8l-4 4z"/>',
  doc: '<path d="M8 3h8l4 4v14H8zM12 8v8M9 12h6"/>',
  list: '<path d="M9 5h6M8 3h8v18H8zM11 8h2M11 12h2M11 16h2"/>',
};

export default function UniversityPortal({
  user,
  routedToMe,
  myProposals,
  interests,
  problems,
  onSignOut,
  push,
  loadAll,
  view,
  setView,
  trackId,
  setTrackId,
}) {
  const [proposingOn, setProposingOn] = useState(null);
  const [detailProb, setDetailProb] = useState(null);
  const [pForm, setPForm] = useState({ team: "", text: "", funding: "250000" });
  const [busy, setBusy] = useState(false);
  const [aiDrafting, setAiDrafting] = useState(false);

  const NAV = [
    ["inbox", "Domain-Routed Inbox", ICON.inbox, routedToMe.length],
    ["proposals", "My Submitted Proposals", ICON.doc, myProposals.length],
    ["all", "All State Grievances", ICON.list],
  ];

  /* ─── Groq AI Proposal Generator ─── */
  async function draftWithAI() {
    if (!proposingOn) return;
    setAiDrafting(true);
    try {
      const res = await fetch("/api/ai-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_id: proposingOn.id, problem: proposingOn }),
      });
      const j = await res.json();
      if (j.ok && j.draft) {
        const d = j.draft;
        const textContent = `${d.title || ""}\n\nHYPOTHESIS: ${
          d.hypothesis || ""
        }\n\nMETHODOLOGY:\n${(d.methodology || []).map((m, i) => `${i + 1}. ${m}`).join("\n")}\n\nPROPOSAL SUMMARY:\n${
          d.proposalText || ""
        }`;
        setPForm({
          team: Array.isArray(d.teamStructure) ? d.teamStructure.join(", ") : pForm.team,
          text: textContent,
          funding: String(d.recommendedFundingINR || 350000),
        });
        push(
          "AI Proposal Synthesized",
          "Groq Llama 3.3 generated academic engineering draft.",
          "ok",
          3500
        );
      } else {
        throw new Error(j.error || "Failed to generate proposal");
      }
    } catch (e) {
      push("AI Draft Failed", e.message, "warn");
    } finally {
      setAiDrafting(false);
    }
  }

  /* ─── Submit Proposal ─── */
  async function submitProposal(e) {
    e.preventDefault();
    if (!pForm.text.trim()) {
      push("Methodology Required", "Please provide the proposal methodology and solution scope.", "warn");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: proposingOn.id,
          team_members: pForm.team.split(",").map((s) => s.trim()).filter(Boolean),
          proposal_text: pForm.text,
          funding_sought: Number(pForm.funding) || 0,
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Failed to submit proposal");

      push("Proposal Submitted", "Project uploaded to state registry and open for CSR backing.", "ok");
      setProposingOn(null);
      setPForm({ team: "", text: "", funding: "250000" });
      await loadAll();
    } catch (e) {
      push("Submission Error", e.message, "warn");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell
      user={user}
      roleName="University Research Partner"
      expertise={user.domain_expertise}
      active={view}
      navItems={NAV}
      onNav={(id) => {
        setView(id);
        setTrackId(null);
      }}
      onExit={onSignOut}
      title={
        view === "inbox"
          ? "Domain-Matched Civic Problems"
          : view === "proposals"
          ? "Submitted University Proposals"
          : "Statewide Civic Challenges"
      }
      sub="Form faculty-student teams, engineer practical solutions, and receive corporate CSR grant funding"
    >
      {/* ─── INBOX OF ROUTED PROBLEMS ─── */}
      {view === "inbox" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-line">
            <p className="text-[15px] text-ink-2 max-w-2xl leading-relaxed">
              These grievances were AI-routed to <strong className="text-ink">{user.institution_name || user.name}</strong> based on your department expertise.
            </p>
            <span className="shrink-0 bg-blue-tint text-blue px-3 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase font-bold border border-blue-soft">
              {routedToMe.length} ROUTED TICKET{routedToMe.length !== 1 ? "S" : ""}
            </span>
          </div>

          {routedToMe.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center bg-surface rounded-lg border border-dashed border-line">
              <img src="/illustrations/empty-state.png" alt="" aria-hidden="true" width="112" height="112" loading="lazy" className="w-28 h-28 mb-3 float-soft" />
              <h3 className="font-display text-xl font-bold text-ink mb-2">No Assigned Problems in Queue</h3>
              <p className="text-[14.5px] text-ink-2 max-w-md mb-6">
                When citizen grievances matching your domain are validated by AI triage, they will appear here. You can also explore statewide problems.
              </p>
              <Button onClick={() => setView("all")}>
                Browse All State Grievances <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {routedToMe.map((p) => (
                <ProblemRow
                  key={p.id}
                  problem={p}
                  viewerRole="university"
                  onPropose={(prob) => setProposingOn(prob)}
                  onTrack={(prob) => setDetailProb(prob)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── MY PROPOSALS LIST ─── */}
      {view === "proposals" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-line">
            <p className="text-[15px] text-ink-2 max-w-2xl leading-relaxed">
              Active engineering solutions and research proposals submitted by your faculty & students.
            </p>
          </div>

          {myProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center bg-surface rounded-lg border border-dashed border-line">
              <img src="/illustrations/empty-state.png" alt="" aria-hidden="true" width="112" height="112" loading="lazy" className="w-28 h-28 mb-3 float-soft" />
              <h3 className="font-display text-xl font-bold text-ink mb-2">No Proposals Submitted Yet</h3>
              <p className="text-[14.5px] text-ink-2 max-w-md mb-6">
                Claim a routed problem from your inbox, use the AI Co-Pilot to draft a scope, and submit your proposal for CSR sponsorship.
              </p>
              <Button onClick={() => setView("inbox")}>
                Go to Routed Inbox <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myProposals.map((pr) => {
                const prob = pr.problem || problems.find((p) => p.id === pr.problem_id);
                const matchedInterests = interests.filter((i) => i.proposal_id === pr.id);
                return (
                  <div key={pr.id} className="flex flex-col bg-surface rounded-lg border border-line shadow-sm overflow-hidden p-5 md:p-6 hover:border-green-soft transition-colors relative">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${pr.status === "approved" ? "bg-green-tint text-green border-green-soft" : "bg-blue-tint/50 text-blue border-blue/20"}`}>
                            {pr.status}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-ink-3 font-semibold bg-surface-2 border border-line">
                            ID: {pr.id.slice(0, 8)}
                          </span>
                        </div>
                        <h3 className="font-display text-[18px] md:text-[20px] font-bold text-ink mb-2">
                          {prob?.title || "Problem Statement"}
                        </h3>
                        <p className="text-[14px] text-ink-2 leading-relaxed whitespace-pre-wrap">{pr.proposal_text}</p>
                      </div>
                      
                      <div className="shrink-0 flex flex-col items-start sm:items-end p-4 rounded-lg bg-paper border border-line mt-4 sm:mt-0">
                        <span className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-1">Budget Required</span>
                        <strong className="font-display text-[22px] font-bold text-ink">{fmtINR(pr.funding_sought)}</strong>
                      </div>
                    </div>

                    {Array.isArray(pr.team_members) && pr.team_members.length > 0 && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-2 border border-line mt-2 text-[13px] text-ink-2">
                        <UsersThree size={18} weight="duotone" className="text-green shrink-0" />
                        <span><strong className="text-ink">Team:</strong> {pr.team_members.join(", ")}</span>
                      </div>
                    )}

                    {matchedInterests.length > 0 && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-tint/50 border border-green-soft mt-3 text-[13px] text-green-900">
                        <CheckCircle size={18} weight="fill" className="text-green shrink-0" />
                        <span><strong>CSR Sponsor Match:</strong> {matchedInterests.length} corporate partner(s) committed funding.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── ALL STATE PROBLEMS ─── */}
      {view === "all" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-line">
            <p className="text-[15px] text-ink-2 max-w-2xl leading-relaxed">
              Explore civic challenges across all 24 districts of Jharkhand.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {problems.map((p) => (
              <ProblemRow
                key={p.id}
                problem={p}
                viewerRole="university"
                onPropose={(prob) => setProposingOn(prob)}
                onTrack={(prob) => setDetailProb(prob)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── PROPOSAL BUILDER MODAL ─── */}
      {proposingOn && (
        <Modal
          title={`Draft Project Proposal · #${proposingOn.id.slice(0, 8)}`}
          onClose={() => setProposingOn(null)}
          wide
        >
          <div className="flex flex-col gap-6 font-body max-h-[85vh] overflow-y-auto p-1 custom-scrollbar text-ink">
            
            <div className="p-4 rounded-lg bg-surface border border-line">
              <span className="text-[10px] font-mono tracking-widest text-ink-3 uppercase font-bold mb-2 block">TARGET CIVIC GRIEVANCE</span>
              <h4 className="font-bold text-[16px] text-ink leading-snug mb-1">{proposingOn.title}</h4>
              <p className="text-[13px] text-ink-2 leading-relaxed">{proposingOn.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-lg bg-green-2 text-white border border-green shadow-inner relative overflow-hidden">
              <div className="relative z-10">
                <strong className="block font-display text-[15px] mb-1">Groq Llama 3.3 Solution Synthesizer</strong>
                <p className="text-[12px] opacity-80 max-w-md leading-snug">Auto-generate academic methodology, team structure, and budget estimate based on the grievance context.</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="relative z-10 shrink-0 w-full sm:w-auto shadow-sm"
                onClick={draftWithAI}
                disabled={aiDrafting}
              >
                <Sparkle size={18} weight="fill" className={aiDrafting ? "text-ink-3" : "text-amber"} />
                {aiDrafting ? "Synthesizing Draft…" : "Auto-Draft Proposal with AI"}
              </Button>
            </div>

            <form onSubmit={submitProposal} className="flex flex-col gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <Label>
                  Research Team & Faculty Guide (प्राध्यापक एवं छात्र टीम)
                  <span className="font-normal text-[10px] text-ink-3 ml-2">· comma-separated</span>
                </Label>
                <Input
                  value={pForm.team}
                  onChange={(e) => setPForm({ ...pForm, team: e.target.value })}
                  placeholder="Dr. R. K. Sinha (Lead), Priya Sharma (M.Tech), Amit Kumar (B.Tech)"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>
                  Solution Methodology & Deployment Scope (समाधान कार्यप्रणाली)
                  <span className="font-normal text-[10px] text-ink-3 ml-2">· required</span>
                </Label>
                <Textarea
                  className="min-h-[180px]"
                  value={pForm.text}
                  onChange={(e) => setPForm({ ...pForm, text: e.target.value })}
                  placeholder="Detail the engineering methodology, hardware/software requirements, field execution milestones, and testing plan."
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <Label>
                  Estimated Budget Requested (अनुमानित बजट INR)
                  <span className="font-normal text-[10px] text-ink-3 ml-2">· for CSR sponsorship</span>
                </Label>
                <Input
                  type="number"
                  value={pForm.funding}
                  onChange={(e) => setPForm({ ...pForm, funding: e.target.value })}
                  placeholder="250000"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-line mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setProposingOn(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={busy}>
                  {busy ? "Submitting…" : "Upload Proposal to State Registry"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ─── DETAIL MODAL ─── */}
      {detailProb && (
        <ProblemDetailModal
          problem={detailProb}
          onClose={() => setDetailProb(null)}
          viewerRole="university"
          user={user}
          proposals={myProposals}
          interests={interests}
          onPropose={(prob) => {
            setDetailProb(null);
            setProposingOn(prob);
          }}
        />
      )}
    </Shell>
  );
}
