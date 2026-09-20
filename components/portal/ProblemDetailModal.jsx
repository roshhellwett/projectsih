"use client";

/* ════════════════════════════════════════════════════════════════════════════
   SAHYOG Portal — Problem Detail & Case File Modal
════════════════════════════════════════════════════════════════════════════ */
import { useState } from "react";
import { Modal, Stepper, CAT_LABEL, CAT_ICONS, STATUS_LBL, fmtINR } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  ThumbsUp,
  GraduationCap,
  Briefcase,
  Clock,
  Bank,
} from "@phosphor-icons/react";

export default function ProblemDetailModal({
  problem,
  onClose,
  viewerRole,
  user,
  onVote,
  onPropose,
  onPledge,
  onStatusChange,
  proposals = [],
  interests = [],
}) {
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(problem?.status || "submitted");

  if (!problem) return null;

  const relevantProposals = proposals.filter((p) => problem?.id && p.problem_id === problem.id);
  const relevantInterests = interests.filter((i) =>
    relevantProposals.some((p) => p.id === i.proposal_id)
  );

  const isAdmin = viewerRole === "admin";
  const isUni = viewerRole === "university";
  const isIndustry = viewerRole === "industry";
  const isCitizen = viewerRole === "citizen";

  const CatIcon = CAT_ICONS[problem.category] || MapPin;

  // Calculate colors based on category
  const getCatColor = (cat) => {
    const m = {
      water: "bg-blue-500",
      infrastructure: "bg-stone-500",
      health: "bg-red-500",
      education: "bg-amber-500",
      agriculture: "bg-lime-600",
      environment: "bg-green-600",
      other: "bg-ink-3"
    };
    return m[cat] || m.other;
  };
  
  /*
   * Status → badge treatment. Mirrors components/ui/problem-row.jsx and must
   * stay in sync with STATUS_FLOW (components/ui/constants.js). The old map
   * referenced non-existent statuses ("new", "funding", "building") and omitted
   * "proposal_submitted" / "in_progress".
   */
  const getStatusClasses = (st) => {
    switch (st) {
      case "submitted":
        return "bg-surface-2 text-ink-2 border-line";
      case "routed":
        return "bg-amber-tint text-amber border-amber-soft";
      case "in_review":
        return "bg-blue-tint text-blue border-blue-soft";
      case "proposal_submitted":
        return "bg-purple-tint text-purple border-purple";
      case "in_progress":
        return "bg-saffron-tint text-saffron-2 border-saffron-2";
      case "resolved":
        return "bg-green-tint text-green border-green-soft";
      default:
        return "bg-surface-2 text-ink-2 border-line";
    }
  };

  async function handleStatusSubmit(e) {
    e.preventDefault();
    if (newStatus === problem.status) return;
    setStatusUpdating(true);
    try {
      if (onStatusChange) {
        await onStatusChange(problem.id, newStatus);
      }
    } finally {
      setStatusUpdating(false);
    }
  }

  return (
    <Modal title={`Civic Grievance Case File · #${problem?.id ? problem.id.slice(0, 8) : "N/A"}`} onClose={onClose} wide>
      <div className="flex flex-col gap-6 font-body text-ink max-h-[85vh] overflow-y-auto p-1 custom-scrollbar">
        {/* Header Summary */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface text-ink-2 text-[12px] font-semibold border border-line">
              <span className={`w-2 h-2 rounded-full ${getCatColor(problem.category)}`} />
              <CatIcon size={16} weight="duotone" />
              {CAT_LABEL[problem.category] || "Other"}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStatusClasses(problem.status)}`}>
              {STATUS_LBL[problem.status] || problem.status}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 text-ink-2 text-[12px] font-medium border border-transparent">
              <MapPin size={16} weight="fill" className="text-amber" />
              {problem.district} {problem.address ? `· ${problem.address}` : ""}
            </span>
          </div>

          <h3 className="font-display text-[22px] md:text-[26px] font-bold leading-snug mt-1">
            {problem.title}
          </h3>
          <p className="text-[14px] md:text-[15px] text-ink-2 leading-relaxed">
            {problem.description}
          </p>
        </div>

        {/* Lifecycle Stepper */}
        <div className="glass-card rounded-xl p-5 border border-line shadow-sm">
          <div className="flex items-center gap-2 text-[13px] font-bold text-ink-2 mb-2 uppercase tracking-wide">
            <Clock size={18} weight="bold" />
            Civic Resolution Lifecycle
          </div>
          <Stepper status={problem.status} />
        </div>

        {/* Priority & Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="glass-card sheen-hover rounded-xl p-4 border border-line flex flex-col justify-center">
            <span className="text-[11px] font-mono tracking-widest text-ink-3 uppercase font-bold mb-1">Citizen Upvotes</span>
            <strong className="font-display text-2xl font-bold text-green">▲ {problem.votes ?? 0}</strong>
          </div>
          <div className="glass-card sheen-hover rounded-xl p-4 border border-line flex flex-col justify-center">
            <span className="text-[11px] font-mono tracking-widest text-ink-3 uppercase font-bold mb-1">SLA Priority Score</span>
            <strong className="font-display text-2xl font-bold text-amber">
              {Number(problem.priority_score ?? 5).toFixed(1)} / 10
            </strong>
          </div>
          <div className="glass-card sheen-hover rounded-xl p-4 border border-line flex flex-col justify-center">
            <span className="text-[11px] font-mono tracking-widest text-ink-3 uppercase font-bold mb-1">Routed Institution</span>
            <strong className="text-[14px] font-semibold text-ink leading-snug">
              {problem.routed_to_name || "Pending Automated Matching"}
            </strong>
          </div>
        </div>

        {/* Field Photo Attachment */}
        {problem.photo_url && (
          <div className="glass-card rounded-xl p-5 border border-line shadow-sm">
            <div className="flex items-center gap-2 text-[13px] font-bold text-ink-2 mb-4 uppercase tracking-wide">
              Field Photographic Evidence
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={problem.photo_url}
              alt="Civic Problem Attachment"
              className="w-full max-h-[400px] object-cover rounded-lg border border-line"
            />
          </div>
        )}

        {/* University Proposals Section */}
        <div className="glass-card rounded-xl p-5 border border-line shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-line">
            <div className="flex items-center gap-2 text-[13px] font-bold text-ink-2 uppercase tracking-wide">
              <GraduationCap size={20} weight="duotone" className="text-blue" />
              University Solutions & Proposals ({relevantProposals.length})
            </div>
            {isUni && ["routed", "in_review"].includes(problem.status) && onPropose && (
              <Button size="sm" className="spring-press" onClick={() => onPropose(problem)}>
                + Draft Solution Proposal
              </Button>
            )}
          </div>

          {relevantProposals.length === 0 ? (
            <div className="p-6 rounded-lg bg-surface-2 text-center text-ink-3 text-[13px] border border-dashed border-line">
              No academic proposal submitted yet. University research teams can formulate an engineering or social deployment plan.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {relevantProposals.map((pr) => (
                <div key={pr.id} className="p-4 rounded-xl glass-elevated border border-line shadow-sm relative">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <strong className="text-[14px] font-semibold">Funding Sought: {fmtINR(pr.funding_sought)}</strong>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusClasses(pr.status)}`}>{pr.status}</span>
                  </div>
                  <p className="text-[13.5px] text-ink-2 leading-relaxed mb-3 whitespace-pre-wrap">{pr.proposal_text}</p>
                  {Array.isArray(pr.team_members) && pr.team_members.length > 0 && (
                    <div className="text-[12px] text-ink-3 p-2 bg-surface-2/60 rounded-md border border-line mt-2">
                      <span className="font-semibold text-ink-2 mr-1">Research Team:</span> {pr.team_members.join(", ")}
                    </div>
                  )}
                  {isIndustry && onPledge && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full sm:w-auto spring-press"
                      onClick={() => onPledge(pr)}
                    >
                      Pledge CSR Support for this Proposal
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Corporate CSR Commitments */}
        {relevantInterests.length > 0 && (
          <div className="glass-card rounded-xl p-5 border border-line shadow-sm">
            <div className="flex items-center gap-2 text-[13px] font-bold text-ink-2 mb-4 uppercase tracking-wide">
              <Briefcase size={20} weight="duotone" className="text-amber" />
              Corporate CSR Commitments ({relevantInterests.length})
            </div>
            <div className="flex flex-col gap-3">
              {relevantInterests.map((int) => (
                <div key={int.id} className="p-4 rounded-lg bg-amber-tint/30 border border-amber/20">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <strong className="text-[13px] text-amber-900">Pledge: {int.interest_type.toUpperCase()}</strong>
                    <span className="text-[10px] font-mono text-amber-700 font-semibold">
                      {new Date(int.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  {int.message && <p className="text-[13px] text-amber-950/80 leading-relaxed">{int.message}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Administrative State Control Panel */}
        {isAdmin && (
          <div className="glass-card rounded-xl p-5 border border-line shadow-sm border-l-4 border-l-red">
            <div className="flex items-center gap-2 text-[13px] font-bold text-red-600 mb-4 uppercase tracking-wide">
              <Bank size={20} weight="duotone" />
              Government Administrative Actions
            </div>
            <form onSubmit={handleStatusSubmit} className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full flex flex-col gap-1.5">
                <Label>Override System Status</Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-line bg-surface px-3 py-2 text-sm ring-offset-paper placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow text-ink font-medium"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="submitted">Submitted</option>
                  <option value="routed">Routed to University</option>
                  <option value="proposal_submitted">Proposal Submitted</option>
                  <option value="in_progress">Work In Progress</option>
                  <option value="resolved">Mark Case Resolved</option>
                </select>
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={statusUpdating || newStatus === problem.status}
              >
                {statusUpdating ? "Updating…" : "Update Official Status"}
              </Button>
            </form>
          </div>
        )}

        {/* Citizen Quick Upvote */}
        {isCitizen && onVote && (
          <div className="mt-2">
            <Button
              variant={problem.viewer_voted ? "outline" : "default"}
              size="lg"
              className="w-full text-[15px]"
              onClick={() => onVote(problem.id)}
            >
              <ThumbsUp size={20} weight={problem.viewer_voted ? "fill" : "bold"} className={problem.viewer_voted ? "text-green" : ""} />
              {problem.viewer_voted ? "You have supported this grievance" : "Upvote this Civic Grievance"}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
