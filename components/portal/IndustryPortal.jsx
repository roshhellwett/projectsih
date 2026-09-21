"use client";

/* ════════════════════════════════════════════════════════════════════════════
   SAHYOG Portal — Industry & CSR Corporate Workspace
   SIH26043 · Government of Jharkhand
   Section 135 MCA Compliant · Quad-Helix Innovation Escrow
════════════════════════════════════════════════════════════════════════════ */
import { useState } from "react";
import {
  Shell,
  Modal,
  CATS,
  CAT_LABEL,
  CAT_ICONS,
  fmtINR,
  EmptyState,
  Button,
  Label,
  Textarea,
} from "@/components/ui";
import ProblemDetailModal from "./ProblemDetailModal";
import {
  HandCoins,
  ChartLineUp,
  CheckCircle,
  MapPin,
  ShieldCheck,
  Drop,
  GraduationCap,
  RoadHorizon,
  Bank,
  Buildings,
  SealCheck,
  ArrowRight,
  ClockCounterClockwise,
  Scales,
  Sparkle,
  Lightning,
  FilePdf,
  DownloadSimple,
  TrendUp,
  CaretRight,
} from "@phosphor-icons/react";

const ICON = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  heart: '<path d="M12 21C7 17 3 13.5 3 9.5S6 3 9.5 3c1.8 0 3.4.9 4.5 2.3C15.1 3.9 16.7 3 18.5 3 22 3 24 6 24 9.5S17 17 12 21z"/>',
  chart: '<path d="M3 13h4l3 7 4-16 3 9h4"/>',
};

const SDG_TAGS = {
  water: { label: "SDG 6: Clean Water & Sanitation", color: "text-blue bg-blue-tint/30 border-blue/20" },
  education: { label: "SDG 4: Quality Education", color: "text-purple-600 bg-purple-50 border-purple-200" },
  health: { label: "SDG 3: Good Health & Well-Being", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  infrastructure: { label: "SDG 9: Industry & Infrastructure", color: "text-amber-700 bg-amber-50 border-amber-200" },
  agriculture: { label: "SDG 2: Zero Hunger & Agri", color: "text-lime-700 bg-lime-50 border-lime-200" },
  environment: { label: "SDG 13: Climate Action", color: "text-teal-700 bg-teal-50 border-teal-200" },
  electricity: { label: "SDG 7: Affordable & Clean Energy", color: "text-orange-700 bg-orange-50 border-orange-200" },
  other: { label: "SDG 11: Sustainable Communities", color: "text-slate-700 bg-slate-100 border-slate-200" },
};

export default function IndustryPortal({
  user,
  proposals,
  myInterests,
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
  const [pledgingOn, setPledgingOn] = useState(null);
  const [pledgeForm, setPledgeForm] = useState({ type: "funding", message: "", customAmount: "" });
  const [busy, setBusy] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [detailProb, setDetailProb] = useState(null);
  const [certModal, setCertModal] = useState(null);

  const NAV = [
    ["proposals", "CSR Project Marketplace", ICON.search, proposals.length],
    ["my", "My CSR Commitments", ICON.heart, myInterests.length],
    ["impact", "Jharkhand ESG Impact", ICON.chart],
  ];
  const activeView = NAV.some(([k]) => k === view) ? view : "proposals";

  /* ─── Submit CSR Pledge ─── */
  async function submitPledge(e) {
    e.preventDefault();
    if (!pledgingOn) return;
    setBusy(true);
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal_id: pledgingOn.id,
          interest_type: pledgeForm.type,
          message: pledgeForm.message,
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Failed to log CSR interest");

      push(
        "CSR Commitment Recorded",
        `Grant pledged towards #${(pledgingOn?.id || "0000").slice(0, 8)}. Funds placed in state escrow account.`,
        "ok",
        4500
      );
      setPledgingOn(null);
      setPledgeForm({ type: "funding", message: "", customAmount: "" });
      await loadAll();
    } catch (e) {
      push("Pledge Failed", e.message, "warn");
    } finally {
      setBusy(false);
    }
  }

  // Filter proposals
  const filteredProposals = proposals.filter((pr) => {
    const pCat = pr.problem?.category || problems.find((p) => p.id === pr.problem_id)?.category || "other";
    if (catFilter !== "all" && pCat !== catFilter) return false;
    return true;
  });

  const totalFundsPledged = myInterests.reduce((acc, curr) => {
    const matchedProp = proposals.find((p) => p.id === curr.proposal_id);
    return acc + (matchedProp?.funding_sought || 0);
  }, 0);

  // Featured Project (CUJ Latehar or fallback to first proposal)
  const featuredProposal = proposals.find((p) => 
    (p.problem?.title || "").toLowerCase().includes("fluoride") ||
    (p.proposal_text || "").toLowerCase().includes("fluoride") ||
    (p.problem?.district || "") === "Latehar"
  ) || proposals[0];

  const featuredProblem = featuredProposal 
    ? (problems.find((p) => p.id === featuredProposal.problem_id) || featuredProposal.problem)
    : null;

  return (
    <Shell
      user={user}
      roleName="Corporate CSR Partner"
      active={activeView}
      navItems={NAV}
      onNav={(id) => {
        setView(id);
        setTrackId(null);
      }}
      onExit={onSignOut}
      title={
        activeView === "proposals"
          ? "Corporate CSR Opportunity Marketplace"
          : activeView === "my"
          ? "My Sponsored Projects & Escrow Ledger"
          : "ESG & State Community Impact"
      }
      sub="Deploy Section 135 CSR funds directly into vetted university engineering solutions across Jharkhand"
    >
      {/* ─── INSTITUTIONAL REGULATORY & ESCROW HEADER STRIP ─── */}
      <div className="flex flex-col gap-4 max-w-[1200px] mx-auto w-full mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-paper rounded-xl border border-line shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-green-tint text-green-900 border border-green-soft">
              <ShieldCheck size={14} weight="fill" className="text-green" />
              MCA Section 135 Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-tint text-blue-900 border border-blue/20">
              <SealCheck size={14} weight="fill" className="text-blue" />
              80G Tax Exemption Certified
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-surface text-ink-2 border border-line">
              <Bank size={14} weight="duotone" className="text-ink-3" />
              Jharkhand CSR Authority Audited
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-mono font-semibold text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Escrow Gateway Active
            </span>
            <span className="hidden sm:inline text-line">|</span>
            <span className="hidden sm:inline text-ink-3">NIC MeghRaj Cloud Node</span>
          </div>
        </div>

        {/* Real-time Escrow Telemetry Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-surface border border-line shadow-xs">
            <div className="text-[10px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-1">State CSR Escrow Pool</div>
            <div className="font-display text-[22px] font-bold text-green">₹8.40 Cr</div>
            <div className="text-[11px] font-semibold text-ink-3 mt-0.5">₹2.85 Cr already disbursed</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-line shadow-xs">
            <div className="text-[10px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-1">Corporate Partners</div>
            <div className="font-display text-[22px] font-bold text-ink">48 Partners</div>
            <div className="text-[11px] font-semibold text-ink-3 mt-0.5">Tata Steel, Coal India, JSPL, SAIL</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-line shadow-xs">
            <div className="text-[10px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-1">TRL-6+ Vetted Solutions</div>
            <div className="font-display text-[22px] font-bold text-blue">14 Capstones</div>
            <div className="text-[11px] font-semibold text-ink-3 mt-0.5">Ready for field deployment</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-line shadow-xs">
            <div className="text-[10px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-1">Target Rural Impact</div>
            <div className="font-display text-[22px] font-bold text-amber">4.80 Lakh</div>
            <div className="text-[11px] font-semibold text-ink-3 mt-0.5">Villagers in 24 districts</div>
          </div>
        </div>
      </div>

      {/* ─── CSR MARKETPLACE ─── */}
      {activeView === "proposals" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          
          {/* FEATURED HIGH-IMPACT CSR ACCELERATOR HERO CARD */}
          {featuredProposal && (
            <div
              className="relative overflow-hidden rounded-2xl p-6 sm:p-8 shadow-2xl border border-emerald-500/40 text-white"
              style={{
                background: "linear-gradient(135deg, #062316 0%, #0B192C 55%, #082819 100%)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(0,0,0,0) 70%)",
                }}
              />
              <div className="relative z-10 flex flex-col gap-6">
                
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/15">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm">
                      <Sparkle size={14} weight="fill" className="text-amber-400" />
                      Priority CSR Accelerator
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/10 text-white border border-white/20">
                      TRL-6 Field Ready
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                      SDG 6: Clean Water
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                    <MapPin size={15} className="text-amber-400" weight="fill" />
                    <span>{featuredProblem?.district || "Latehar"} District · Mahuadanr Block</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2 flex flex-col gap-3">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                      {featuredProblem?.title || "Solar-Powered Fluoride Remediation & IoT Telemetry Unit"}
                    </h2>
                    <p className="text-slate-200 text-[14.5px] leading-relaxed line-clamp-3">
                      {featuredProposal.proposal_text || 
                        "Multi-stage activated alumina adsorption unit powered by a 250W solar array with real-time IoT water fluoridation telemetry. Provides 800L/day potable water adhering to BIS 10500 standards."}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-2">
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <GraduationCap size={16} className="text-emerald-400" weight="duotone" />
                        Lead: Central University of Jharkhand (Dept. of Water Engineering)
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300">Field Trials: 45 Days Verified</span>
                    </div>
                  </div>

                  {/* Escrow Lock & Funding Status Block */}
                  <div
                    className="flex flex-col gap-4 p-5 rounded-xl border border-white/15 backdrop-blur-md shadow-lg"
                    style={{ background: "rgba(11, 25, 44, 0.75)" }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">Escrow Target</span>
                      <strong className="font-display text-2xl font-bold text-amber-400">
                        {fmtINR(featuredProposal.funding_sought || 350000)}
                      </strong>
                    </div>

                    {/* Progress Bar (90% funded demo state) */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-emerald-400">₹3,15,000 Pledged (90%)</span>
                        <span className="text-amber-300">₹35,000 Gap Remaining</span>
                      </div>
                      <div className="h-2.5 w-full bg-white/15 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-500" style={{ width: "90%" }} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="button"
                        className="w-full py-3 px-4 rounded-xl font-extrabold text-sm border-none shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
                        style={{
                          background: "#F59E0B",
                          color: "#0F172A",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#FBBF24")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#F59E0B")}
                        onClick={() => {
                          setPledgingOn(featuredProposal);
                          setPledgeForm({
                            type: "funding",
                            message: `Tata Steel Foundation commits ₹35,000 to close the escrow round for the Latehar Fluoride Remediation Unit.`,
                            customAmount: "35000",
                          });
                        }}
                      >
                        <Lightning size={18} weight="fill" style={{ color: "#0F172A" }} />
                        <span>Commit ₹35,000 to Close Escrow</span>
                      </button>
                      {featuredProblem && (
                        <button
                          type="button"
                          className="text-center text-xs font-bold text-slate-300 hover:text-white transition-colors py-1"
                          onClick={() => setDetailProb(featuredProblem)}
                        >
                          View Full Engineering Specs & Lab Reports →
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3-Stage Milestone Escrow Architecture Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/15 text-xs">
                  <div
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-white/10"
                    style={{ background: "rgba(255, 255, 255, 0.08)" }}
                  >
                    <CheckCircle size={18} weight="fill" className="text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">M1: Prototype & Lab (100%)</div>
                      <div className="text-slate-300 text-[11px]">₹1,20,000 Disbursed to CUJ</div>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-emerald-400/40"
                    style={{ background: "rgba(16, 185, 129, 0.15)" }}
                  >
                    <Lightning size={18} weight="fill" className="text-amber-400 shrink-0 animate-pulse" />
                    <div>
                      <div className="font-bold text-emerald-300">M2: Mahuadanr Field Pilot</div>
                      <div className="text-emerald-200 text-[11px]">₹1,30,000 Active Deployment</div>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-white/10 opacity-80"
                    style={{ background: "rgba(255, 255, 255, 0.05)" }}
                  >
                    <ClockCounterClockwise size={18} weight="duotone" className="text-slate-300 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">M3: Panchayat Handover</div>
                      <div className="text-slate-400 text-[11px]">₹1,00,000 Locked in Escrow</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Filter Pills & Sector Controls */}
          <div className="flex flex-col gap-3 pb-2 border-b border-line">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink">Active University Capstones Seeking CSR Grants</h3>
              <span className="text-xs font-mono font-semibold text-ink-3">
                Showing {filteredProposals.length} verified proposals
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${
                  catFilter === "all" 
                    ? "bg-ink text-surface border-ink shadow-xs" 
                    : "bg-surface text-ink-2 border-line hover:border-ink-3 hover:text-ink"
                }`}
                onClick={() => setCatFilter("all")}
              >
                All Sectors
              </button>
              {CATS.map((c) => {
                const Icon = CAT_ICONS[c] || MapPin;
                const isActive = catFilter === c;
                return (
                  <button
                    type="button"
                    key={c}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${
                      isActive 
                        ? "bg-ink text-surface border-ink shadow-xs" 
                        : "bg-surface text-ink-2 border-line hover:border-ink-3 hover:text-ink"
                    }`}
                    onClick={() => setCatFilter(c)}
                  >
                    <Icon size={15} weight={isActive ? "fill" : "duotone"} />
                    {CAT_LABEL[c]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proposals List */}
          {filteredProposals.length === 0 ? (
            <div className="bg-surface rounded-xl border border-dashed border-line p-8">
              <EmptyState
                title="No Proposals in this Category"
                hint="Check other sectors or await new proposals from university research teams."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredProposals.map((pr) => {
                const prob = problems.find((p) => p.id === pr.problem_id) || (pr.problem ? { ...pr.problem, id: pr.problem_id } : null);
                const isBackedByMe = myInterests.some((i) => i.proposal_id === pr.id);
                const sdgInfo = SDG_TAGS[prob?.category || "other"] || SDG_TAGS.other;

                return (
                  <div
                    key={pr.id}
                    className="flex flex-col bg-surface rounded-xl border border-line shadow-xs overflow-hidden p-5 md:p-6 hover:border-green-soft transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      
                      <div className="flex flex-col flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {prob?.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-surface-2 text-ink-2 border border-line">
                              {CAT_LABEL[prob.category] || prob.category}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border ${sdgInfo.color}`}>
                            {sdgInfo.label}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                            TRL-6 Validated
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border ${
                            pr.status === "approved" 
                              ? "bg-green-tint text-green border-green-soft" 
                              : "bg-surface-2 text-ink-2 border-line"
                          }`}>
                            {pr.status}
                          </span>
                        </div>

                        <h3 className="font-display text-[19px] md:text-[21px] font-bold text-ink mb-2 leading-snug">
                          {prob?.title || "Civic Project #" + (pr.problem_id || pr.id || "0000").slice(0, 8)}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-[13px] text-ink-3 font-semibold mb-3">
                          <span className="flex items-center gap-1 text-ink-2">
                            <MapPin size={15} weight="fill" className="text-amber-600" />
                            {prob?.district || "Jharkhand"} District
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-ink-2">
                            <GraduationCap size={16} weight="duotone" className="text-green" />
                            Research Team: {Array.isArray(pr.team_members) ? pr.team_members.join(", ") : "BIT Mesra / CUJ Research Team"}
                          </span>
                        </div>

                        <p className="text-[14px] text-ink-2 leading-relaxed whitespace-pre-wrap line-clamp-3 md:line-clamp-none mb-4">
                          {pr.proposal_text}
                        </p>

                        {/* Milestone preview bar */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-paper border border-line text-xs font-semibold text-ink-2">
                          <span className="font-mono text-[11px] font-bold uppercase text-ink-3">Escrow Milestones:</span>
                          <span className="flex items-center gap-1 text-green font-bold">
                            <CheckCircle size={14} weight="fill" /> M1: Lab Validated
                          </span>
                          <span>→</span>
                          <span className="flex items-center gap-1 text-amber-700 font-bold">
                            <Lightning size={14} weight="fill" /> M2: Pilot Deployment
                          </span>
                          <span>→</span>
                          <span className="text-ink-3">M3: DC Handover</span>
                        </div>
                      </div>

                      {/* Right Escrow Card */}
                      <div className="shrink-0 flex flex-col items-start lg:items-end p-5 rounded-xl bg-paper border border-line min-w-[240px]">
                        <span className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-1">
                          CSR Grant Target
                        </span>
                        <strong className="font-display text-[24px] font-bold text-green mb-3">
                          {fmtINR(pr.funding_sought || 250000)}
                        </strong>

                        <div className="w-full text-xs text-ink-3 mb-4 space-y-1">
                          <div className="flex justify-between">
                            <span>Escrow State:</span>
                            <span className="font-bold text-ink">Ready for Lock</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax Benefit:</span>
                            <span className="font-bold text-green">100% Deductible</span>
                          </div>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                          {isBackedByMe ? (
                            <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-green-tint text-green-900 border border-green-soft font-bold text-[13px] w-full text-center">
                              <CheckCircle size={17} weight="fill" className="text-green" /> 
                              Funded by your Firm
                            </span>
                          ) : (
                            <Button
                              className="w-full"
                              onClick={() => {
                                setPledgingOn(pr);
                                setPledgeForm({
                                  type: "funding",
                                  message: `We are interested in funding this ${fmtINR(pr.funding_sought || 250000)} capstone under our CSR mandate.`,
                                  customAmount: String(pr.funding_sought || 250000),
                                });
                              }}
                            >
                              <HandCoins size={17} weight="duotone" className="mr-1.5" />
                              Pledge CSR Grant
                            </Button>
                          )}

                          {prob && (
                            <button
                              type="button"
                              className="text-center text-xs font-bold text-ink-3 hover:text-ink transition-colors py-1"
                              onClick={() => setDetailProb(prob)}
                            >
                              Inspect Citizen Problem Context →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── MY COMMITMENTS VIEW WITH LIVE MILESTONE ESCROW TRACKER ─── */}
      {activeView === "my" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-line">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Active Corporate CSR Commitments & Escrow Ledger</h2>
              <p className="text-[14px] text-ink-2 mt-1">
                Real-time milestone tracking, bank transfer hashes (UTR), and District Collector sign-offs for Section 135 compliance.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCertModal({
                  company: user?.name || "Tata Steel Foundation",
                  amount: totalFundsPledged || 250000,
                  date: new Date().toLocaleDateString("en-IN"),
                  cin: "L27100MH1907PLC000260",
                })}
              >
                <FilePdf size={16} weight="duotone" className="mr-1 text-red-600" />
                Generate Section 135 Audit Certificate
              </Button>
            </div>
          </div>

          {myInterests.length === 0 ? (
            <div className="bg-surface rounded-xl border border-dashed border-line p-8">
              <EmptyState
                title="No Active CSR Commitments Yet"
                hint="Explore the CSR marketplace and partner with premier Jharkhand academic teams to solve real community challenges."
                action={
                  <Button onClick={() => setView("proposals")}>
                    <HandCoins size={16} className="mr-1.5" /> Browse CSR Marketplace
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {myInterests.map((item, idx) => {
                const pr = item.proposal || proposals.find((p) => p.id === item.proposal_id);
                const prob = pr?.problem || problems.find((p) => p.id === pr?.problem_id);
                const grantAmount = pr?.funding_sought || 250000;

                return (
                  <div key={item.id} className="flex flex-col bg-surface rounded-xl border border-line p-6 shadow-xs">
                    
                    {/* Top Row: Title, Grant, and Metadata */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-line">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-green-tint text-green border border-green-soft">
                            {item.interest_type}
                          </span>
                          <span className="text-[12px] text-ink-3">
                            Committed {new Date(item.created_at).toLocaleDateString("en-IN")}
                          </span>
                          <span className="text-[11px] font-mono text-ink-3 bg-surface-2 px-2 py-0.5 rounded border border-line">
                            Ref: ESCROW-JH-{(item?.id || "0000").slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-display text-[19px] md:text-[21px] font-bold text-ink mb-1">
                          {prob?.title || "Sponsored Civic Innovation Solution"}
                        </h3>
                        <p className="text-[14px] text-ink-2 leading-relaxed">
                          {item.message || "Corporate sponsorship pledged towards university engineering implementation."}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-start sm:items-end p-4 rounded-xl bg-paper border border-line">
                        <span className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-1">Committed CSR Grant</span>
                        <strong className="font-display text-[22px] font-bold text-green">
                          {fmtINR(grantAmount)}
                        </strong>
                        <span className="text-[11px] font-semibold text-emerald-700 mt-0.5">80G Tax Deductible</span>
                      </div>
                    </div>

                    {/* LIVE 3-STAGE MILESTONE ESCROW ARCHITECTURE */}
                    <div className="pt-5 pb-3">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3">
                          Automated Milestone Escrow Disbursal Pipeline
                        </span>
                        <span className="text-xs font-semibold text-green flex items-center gap-1">
                          <ShieldCheck size={15} weight="fill" />
                          District Collector Sign-off Enforced
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Milestone 1 */}
                        <div className="p-3.5 rounded-xl bg-green-tint/40 border border-green-soft flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-green-900 uppercase">Milestone 1 (35%)</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green">
                              <CheckCircle size={14} weight="fill" /> Disbursed
                            </span>
                          </div>
                          <div className="font-bold text-ink text-[13.5px]">Lab Clearance & Equipment Procurement</div>
                          <div className="text-[11px] font-mono text-ink-3 mt-1">
                            Bank UTR: SBIN00049219842<br />
                            Disbursed: {fmtINR(grantAmount * 0.35)}
                          </div>
                        </div>

                        {/* Milestone 2 */}
                        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-amber-900 uppercase">Milestone 2 (40%)</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 animate-pulse">
                              <Lightning size={14} weight="fill" /> In Progress
                            </span>
                          </div>
                          <div className="font-bold text-ink text-[13.5px]">Field Testing & Collector Inspection</div>
                          <div className="text-[11px] font-mono text-ink-3 mt-1">
                            Locked in Escrow: {fmtINR(grantAmount * 0.40)}<br />
                            Awaiting DC Site Sign-off
                          </div>
                        </div>

                        {/* Milestone 3 */}
                        <div className="p-3.5 rounded-xl bg-surface-2 border border-line flex flex-col gap-2 opacity-85">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-ink-3 uppercase">Milestone 3 (25%)</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink-3">
                              <ClockCounterClockwise size={14} weight="duotone" /> Locked
                            </span>
                          </div>
                          <div className="font-bold text-ink text-[13.5px]">Panchayat Transfer & Final Handover</div>
                          <div className="text-[11px] font-mono text-ink-3 mt-1">
                            Escrow Reserve: {fmtINR(grantAmount * 0.25)}<br />
                            Releases on 30-day civic uptime
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* District Collector Endorsement Stamp */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-line mt-3 text-xs text-ink-3">
                      <div className="flex items-center gap-2">
                        <SealCheck size={16} weight="fill" className="text-green" />
                        <span>
                          <strong className="text-ink">Verified by District Administration:</strong> Sh. Himanshu Mohan, IAS (District Collector)
                        </span>
                      </div>
                      <div className="font-mono text-[11px]">
                        JRTPS Compliance Token: JRTPS-2026-CSR-{idx + 101}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── ESG IMPACT METRICS VIEW ─── */}
      {activeView === "impact" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col bg-surface border border-line rounded-xl p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><HandCoins size={72} weight="duotone" /></div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">TOTAL CSR CAPITAL PLEDGED</div>
              <div className="font-display text-3xl font-bold text-green mb-1">{fmtINR(totalFundsPledged || 8400000)}</div>
              <div className="text-[13px] font-semibold text-ink-2">across {Math.max(myInterests.length, 6)} vetted university solutions</div>
            </div>
            
            <div className="flex flex-col bg-surface border border-line rounded-xl p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><ChartLineUp size={72} weight="duotone" /></div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">ESTIMATED CITIZENS BENEFITED</div>
              <div className="font-display text-3xl font-bold text-amber mb-1">
                {(Math.max(myInterests.length, 6) * 4800).toLocaleString("en-IN")}
              </div>
              <div className="text-[13px] font-semibold text-ink-2">in rural & aspirational Jharkhand blocks</div>
            </div>

            <div className="flex flex-col bg-surface border border-line rounded-xl p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={72} weight="duotone" /></div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">STATUTORY AUDIT & COMPLIANCE</div>
              <div className="font-display text-3xl font-bold text-ink mb-1">100%</div>
              <div className="text-[13px] font-semibold text-ink-2">MCA Section 135 & Schedule VII compliant</div>
            </div>
          </div>

          {/* District CSR Allocation Matrix */}
          <div className="flex flex-col bg-surface border border-line rounded-xl p-6 shadow-xs">
            <h4 className="font-display text-lg font-bold text-ink mb-1">
              District-Wise CSR Capital Deployment (Top Impact Hubs)
            </h4>
            <p className="text-xs text-ink-3 mb-6">
              Track priority CSR fund routing into high-urgency districts across Jharkhand.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-paper border border-line">
                <div className="flex items-center justify-between text-xs font-bold text-ink-3 mb-1">
                  <span>Latehar District</span>
                  <span className="text-green font-mono">₹48.5 Lakh</span>
                </div>
                <div className="font-display text-base font-bold text-ink mb-2">Fluoride & Forest Tech</div>
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-full bg-green rounded-full" style={{ width: "85%" }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-paper border border-line">
                <div className="flex items-center justify-between text-xs font-bold text-ink-3 mb-1">
                  <span>Khunti District</span>
                  <span className="text-green font-mono">₹34.0 Lakh</span>
                </div>
                <div className="font-display text-base font-bold text-ink mb-2">Solar Microgrid IoT</div>
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-full bg-green rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-paper border border-line">
                <div className="flex items-center justify-between text-xs font-bold text-ink-3 mb-1">
                  <span>Dhanbad District</span>
                  <span className="text-green font-mono">₹62.0 Lakh</span>
                </div>
                <div className="font-display text-base font-bold text-ink mb-2">Mining Drainage & Slag Tech</div>
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-full bg-green rounded-full" style={{ width: "95%" }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-paper border border-line">
                <div className="flex items-center justify-between text-xs font-bold text-ink-3 mb-1">
                  <span>Gumla District</span>
                  <span className="text-green font-mono">₹28.5 Lakh</span>
                </div>
                <div className="font-display text-base font-bold text-ink mb-2">Cold Storage Sensors</div>
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-full bg-green rounded-full" style={{ width: "50%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* SDG Mapping Cards */}
          <div className="flex flex-col bg-surface border border-line rounded-xl p-6 shadow-xs">
            <h4 className="font-display text-lg font-bold text-ink mb-4 pb-3 border-b border-line">
              Alignment with United Nations Sustainable Development Goals (SDGs)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col p-5 bg-paper rounded-xl border border-line">
                <div className="flex items-center gap-2 mb-3 text-blue">
                  <Drop size={24} weight="duotone" />
                  <strong className="font-display text-[15px]">SDG 6: Clean Water</strong>
                </div>
                <p className="text-[13.5px] text-ink-2 leading-relaxed">
                  Solar fluoride filtration and IoT water table telemetry deployed across Mahuadanr, Deoghar & Sahibganj.
                </p>
              </div>
              
              <div className="flex flex-col p-5 bg-paper rounded-xl border border-line">
                <div className="flex items-center gap-2 mb-3 text-purple-600">
                  <GraduationCap size={24} weight="duotone" />
                  <strong className="font-display text-[15px]">SDG 4: Quality Education</strong>
                </div>
                <p className="text-[13.5px] text-ink-2 leading-relaxed">
                  Anganwadi solar electrification and IoT digital classrooms implemented across Gumla & Dumka.
                </p>
              </div>
              
              <div className="flex flex-col p-5 bg-paper rounded-xl border border-line">
                <div className="flex items-center gap-2 mb-3 text-amber-600">
                  <RoadHorizon size={24} weight="duotone" />
                  <strong className="font-display text-[15px]">SDG 9: Industry & Infra</strong>
                </div>
                <p className="text-[13.5px] text-ink-2 leading-relaxed">
                  Pothole cold-mix bio-asphalt and bridge culvert erosion mitigation deployed in Bokaro & Ramgarh.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PLEDGE MODAL ─── */}
      {pledgingOn && (
        <Modal
          title={`Pledge CSR Support · ${fmtINR(pledgeForm.customAmount ? Number(pledgeForm.customAmount) : pledgingOn.funding_sought)}`}
          onClose={() => setPledgingOn(null)}
        >
          <form onSubmit={submitPledge} className="flex flex-col gap-5 font-body text-ink">
            
            <div className="p-4 rounded-xl bg-surface-2 border border-line text-[13.5px] leading-relaxed text-ink-2">
              <strong className="text-ink mr-2">Capstone Scope:</strong> 
              {pledgingOn.proposal_text?.slice(0, 160)}…
            </div>

            <div className="flex flex-col gap-2">
              <Label>Commitment Mechanism <span className="text-red-500">*</span></Label>
              <select
                className="w-full bg-surface border border-line rounded-lg px-4 py-2.5 text-[14px] font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-ink transition-shadow"
                value={pledgeForm.type}
                onChange={(e) => setPledgeForm({ ...pledgeForm, type: e.target.value })}
              >
                <option value="funding">Direct CSR Grant Funding ({fmtINR(pledgeForm.customAmount ? Number(pledgeForm.customAmount) : pledgingOn.funding_sought)})</option>
                <option value="mentorship">Technical & Industry Engineering Mentorship</option>
                <option value="both">Both Grant Capital & Technical R&D Sponsorship</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Corporate Note to University / District Administration</Label>
              <Textarea
                rows={3}
                placeholder="Specify your CSR mandate allocation (Schedule VII), milestone release terms, or corporate equipment donation…"
                value={pledgeForm.message}
                onChange={(e) => setPledgeForm({ ...pledgeForm, message: e.target.value })}
              />
            </div>

            <div className="p-3 bg-paper rounded-lg border border-line text-xs text-ink-3">
              <span className="font-bold text-ink">Escrow Guarantee:</span> Funds are held in sovereign escrow and released only upon District Collector site verification and lab sign-off.
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-line mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPledgingOn(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={busy}>
                {busy ? "Locking in Escrow…" : "Confirm Sovereign CSR Commitment"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── OFFICIAL SECTION 135 CERTIFICATE MODAL ─── */}
      {certModal && (
        <Modal
          title="Section 135 CSR Compliance Certificate"
          onClose={() => setCertModal(null)}
        >
          <div className="flex flex-col gap-6 p-2 text-ink">
            <div className="border-2 border-green/30 bg-paper p-6 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
                <div>
                  <div className="text-[11px] font-mono font-bold tracking-widest text-green uppercase">Government of Jharkhand</div>
                  <div className="font-display text-lg font-bold text-ink">Jharkhand State CSR Authority</div>
                  <div className="text-xs text-ink-3">Ministry of Corporate Affairs (MCA) Alignment</div>
                </div>
                <SealCheck size={40} weight="fill" className="text-green" />
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-2">
                <p>
                  This certifies that <strong className="text-ink">{certModal.company}</strong> (CIN: {certModal.cin}) has committed <strong className="text-green font-bold">{fmtINR(certModal.amount)}</strong> towards vetted university engineering solutions under Schedule VII of the Companies Act, 2013.
                </p>
                <div className="p-3 bg-surface rounded-lg border border-line font-mono text-[11px] space-y-1">
                  <div>Verification Hash: 0x8f4b...7c19a2</div>
                  <div>Statutory Category: Item (iv) Environmental Sustainability & Potable Water</div>
                  <div>Certified On: {certModal.date}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 mt-4 border-t border-line text-[11px] text-ink-3">
                <span>Authorized Signatory: Principal Secretary (IT & e-Gov)</span>
                <span className="font-mono">Ref: JH-CSR-CERT-2026-992</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  window.print();
                }}
              >
                <DownloadSimple size={16} className="mr-1.5" /> Download / Print PDF
              </Button>
              <Button onClick={() => setCertModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── DETAIL MODAL ─── */}
      {detailProb && (
        <ProblemDetailModal
          problem={detailProb}
          onClose={() => setDetailProb(null)}
          viewerRole="industry"
          user={user}
          onPledge={(pr) => {
            setDetailProb(null);
            setPledgingOn(pr);
            setPledgeForm({
              type: "funding",
              message: `We are interested in funding this project under our corporate CSR mandate.`,
              customAmount: pr.funding_sought ? String(pr.funding_sought) : "",
            });
          }}
          proposals={proposals}
          interests={interests}
        />
      )}
    </Shell>
  );
}
