"use client";

/* ════════════════════════════════════════════════════════════════════════════
   SAHYOG Portal — Industry & CSR Corporate Workspace
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
} from "@/components/ui";
import { Button, Input, Label, Textarea } from "@/components/ui";
import ProblemDetailModal from "./ProblemDetailModal";
import {
  MagnifyingGlass,
  HandCoins,
  ChartLineUp,
  Buildings,
  CheckCircle,
  MapPin,
  Sparkle,
  ShieldCheck,
  Drop,
  Tree,
  FirstAid,
  GraduationCap,
  RoadHorizon,
  Plant,
} from "@phosphor-icons/react";

const ICON = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  heart: '<path d="M12 21C7 17 3 13.5 3 9.5S6 3 9.5 3c1.8 0 3.4.9 4.5 2.3C15.1 3.9 16.7 3 18.5 3 22 3 24 6 24 9.5S17 17 12 21z"/>',
  chart: '<path d="M3 13h4l3 7 4-16 3 9h4"/>',
};

const SDG_TAGS = {
  water: "SDG 6: Clean Water & Sanitation",
  education: "SDG 4: Quality Education",
  health: "SDG 3: Good Health & Well-Being",
  infrastructure: "SDG 9: Industry & Infrastructure",
  agriculture: "SDG 2: Zero Hunger & Sustainable Agri",
  environment: "SDG 13: Climate Action",
  other: "SDG 11: Sustainable Communities",
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
  const [pledgeForm, setPledgeForm] = useState({ type: "funding", message: "" });
  const [busy, setBusy] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [detailProb, setDetailProb] = useState(null);

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

      push("CSR Commitment Logged", "Problem moved to In Progress. University team notified.", "ok", 4000);
      setPledgingOn(null);
      setPledgeForm({ type: "funding", message: "" });
      await loadAll();
    } catch (e) {
      push("Pledge Failed", e.message, "warn");
    } finally {
      setBusy(false);
    }
  }

  const filteredProposals = proposals.filter((pr) => {
    if (catFilter === "all") return true;
    const pCat = pr.problem?.category || problems.find((p) => p.id === pr.problem_id)?.category;
    return pCat === catFilter;
  });

  const totalFundsPledged = myInterests.reduce((acc, curr) => {
    const matchedProp = proposals.find((p) => p.id === curr.proposal_id);
    return acc + (matchedProp?.funding_sought || 250000);
  }, 0);

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
          ? "My Sponsored Projects"
          : "ESG & Community Impact"
      }
      sub="Deploy Section 135 CSR funds directly into vetted university engineering solutions across Jharkhand"
    >
      {/* ─── CSR MARKETPLACE ─── */}
      {activeView === "proposals" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-line">
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-[13px] font-bold transition-all border ${
                catFilter === "all" 
                  ? "bg-ink text-surface border-ink shadow-sm" 
                  : "bg-surface text-ink-2 border-line hover:border-ink-3 hover:text-ink"
              }`}
              onClick={() => setCatFilter("all")}
            >
              All Categories
            </button>
            {CATS.map((c) => {
              const Icon = CAT_ICONS[c] || MapPin;
              const isActive = catFilter === c;
              return (
                <button
                  type="button"
                  key={c}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-bold transition-all border ${
                    isActive 
                      ? "bg-ink text-surface border-ink shadow-sm" 
                      : "bg-surface text-ink-2 border-line hover:border-ink-3 hover:text-ink"
                  }`}
                  onClick={() => setCatFilter(c)}
                >
                  <Icon size={16} weight={isActive ? "fill" : "duotone"} />
                  {CAT_LABEL[c]}
                </button>
              );
            })}
          </div>

          {filteredProposals.length === 0 ? (
            <div className="bg-surface rounded-lg border border-dashed border-line">
              <EmptyState
                title="No Proposals in this Category"
                hint="Check other sectors or await new proposals from university research teams."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredProposals.map((pr) => {
                const prob = problems.find((p) => p.id === pr.problem_id) || (pr.problem ? { ...pr.problem, id: pr.problem_id } : null);
                const isBackedByMe = myInterests.some((i) => i.proposal_id === pr.id);
                return (
                  <div key={pr.id} className="flex flex-col bg-surface rounded-lg border border-line shadow-sm overflow-hidden p-5 md:p-6 hover:border-green-soft transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {prob?.category && (
                            <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-bold tracking-wider uppercase bg-surface-2 text-ink-2 border border-line`}>
                              {CAT_LABEL[prob.category] || prob.category}
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-bold tracking-wider uppercase bg-blue-tint/30 text-blue border border-blue/20">
                            {SDG_TAGS[prob?.category || "other"]}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-bold tracking-wider uppercase border ${pr.status === "approved" ? "bg-green-tint text-green border-green-soft" : "bg-surface-2 text-ink-2 border-line"}`}>
                            {pr.status}
                          </span>
                        </div>
                        <h3 className="font-display text-[18px] md:text-[20px] font-bold text-ink mb-2">
                          {prob?.title || "Civic Project #" + pr.problem_id.slice(0, 8)}
                        </h3>
                        <div className="flex items-center gap-2 text-[13px] text-ink-3 font-semibold mb-3">
                          <span>📍 {prob?.district || "Jharkhand"}</span>
                          <span>·</span>
                          <span>
                            Research Team: {Array.isArray(pr.team_members) ? pr.team_members.join(", ") : "University Research Team"}
                          </span>
                        </div>
                        <p className="text-[14px] text-ink-2 leading-relaxed whitespace-pre-wrap line-clamp-3 md:line-clamp-none">{pr.proposal_text}</p>
                      </div>

                      <div className="shrink-0 flex flex-col items-start sm:items-end p-4 rounded-lg bg-paper border border-line mt-4 sm:mt-0">
                        <span className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-1">CSR Grant Target</span>
                        <strong className="font-display text-[22px] font-bold text-green">{fmtINR(pr.funding_sought)}</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line mt-2">
                      {prob && (
                        <Button
                          variant="ghost"
                          onClick={() => setDetailProb(prob)}
                        >
                          View Problem Context
                        </Button>
                      )}
                      
                      {isBackedByMe ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-tint/50 text-green-900 border border-green-soft font-bold text-[14px]">
                          <CheckCircle size={18} weight="fill" className="text-green" /> 
                          Backed by your organization
                        </span>
                      ) : (
                        <Button
                          onClick={() => {
                            setPledgingOn(pr);
                            setPledgeForm({
                              type: "funding",
                              message: `We are interested in funding this ${fmtINR(pr.funding_sought)} project under our CSR mandate.`,
                            });
                          }}
                        >
                          + Pledge CSR Grant
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── MY COMMITMENTS ─── */}
      {activeView === "my" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-line">
            <p className="text-[15px] text-ink-2 max-w-2xl leading-relaxed">
              Civic projects and university research initiatives funded by your corporate CSR allocation.
            </p>
          </div>

          {myInterests.length === 0 ? (
            <div className="bg-surface rounded-lg border border-dashed border-line">
              <EmptyState
                title="No Active CSR Pledges"
                hint="Explore the CSR marketplace and partner with premier Jharkhand academic teams to solve real community challenges."
                action={
                  <Button onClick={() => setView("proposals")}>
                    Browse Marketplace
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myInterests.map((item) => {
                const pr = item.proposal || proposals.find((p) => p.id === item.proposal_id);
                const prob = pr?.problem || problems.find((p) => p.id === pr?.problem_id);
                return (
                  <div key={item.id} className="flex flex-col bg-surface rounded-lg border border-line p-5 md:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-green-tint text-green border border-green-soft">
                            {item.interest_type}
                          </span>
                          <span className="text-[11px] text-ink-3">
                            Committed {new Date(item.created_at).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                        <h3 className="font-display text-[18px] md:text-[20px] font-bold text-ink mb-1">
                          {prob?.title || "Sponsored Civic Solution"}
                        </h3>
                        <p className="text-[14px] text-ink-2 leading-relaxed mb-3">
                          {item.message || "Corporate sponsorship pledged towards implementation."}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-start sm:items-end p-4 rounded-lg bg-paper border border-line">
                        <span className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-1">Committed Grant</span>
                        <strong className="font-display text-[20px] font-bold text-green">
                          {fmtINR(pr?.funding_sought || 250000)}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── ESG IMPACT METRICS ─── */}
      {activeView === "impact" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col bg-surface border border-line rounded-lg p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><HandCoins size={64} weight="duotone" /></div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">TOTAL CSR PLEDGED</div>
              <div className="font-display text-3xl font-bold text-green mb-1">{fmtINR(totalFundsPledged)}</div>
              <div className="text-[13px] font-semibold text-ink-2">across {myInterests.length} academic solutions</div>
            </div>
            
            <div className="flex flex-col bg-surface border border-line rounded-lg p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><ChartLineUp size={64} weight="duotone" /></div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">ESTIMATED CITIZENS BENEFITED</div>
              <div className="font-display text-3xl font-bold text-amber mb-1">
                {(myInterests.length * 4800).toLocaleString("en-IN")}
              </div>
              <div className="text-[13px] font-semibold text-ink-2">in rural Jharkhand clusters</div>
            </div>

            <div className="flex flex-col bg-surface border border-line rounded-lg p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={64} weight="duotone" /></div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">COMPLIANCE REPORTING</div>
              <div className="font-display text-3xl font-bold text-ink mb-1">100%</div>
              <div className="text-[13px] font-semibold text-ink-2">Section 135 MCA Compliant</div>
            </div>
          </div>

          <div className="flex flex-col bg-surface border border-line rounded-lg p-5 shadow-sm mt-2">
            <h4 className="font-display text-lg font-bold text-ink mb-6 pb-4 border-b border-line">
              CSR Alignment to United Nations Sustainable Development Goals (SDGs)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col p-5 bg-paper rounded-lg border border-line">
                <div className="flex items-center gap-2 mb-3 text-blue">
                  <Drop size={24} weight="duotone" />
                  <strong className="font-display text-[15px]">SDG 6: Clean Water</strong>
                </div>
                <p className="text-[13.5px] text-ink-2 leading-relaxed">
                  Solar fluoride filtration and handpump revitalization in Deoghar & Sahibganj.
                </p>
              </div>
              
              <div className="flex flex-col p-5 bg-paper rounded-lg border border-line">
                <div className="flex items-center gap-2 mb-3 text-purple-600">
                  <GraduationCap size={24} weight="duotone" />
                  <strong className="font-display text-[15px]">SDG 4: Quality Education</strong>
                </div>
                <p className="text-[13.5px] text-ink-2 leading-relaxed">
                  Anganwadi solar electrification and school sanitation across Gumla & Dumka.
                </p>
              </div>
              
              <div className="flex flex-col p-5 bg-paper rounded-lg border border-line">
                <div className="flex items-center gap-2 mb-3 text-amber-600">
                  <RoadHorizon size={24} weight="duotone" />
                  <strong className="font-display text-[15px]">SDG 9: Infrastructure</strong>
                </div>
                <p className="text-[13.5px] text-ink-2 leading-relaxed">
                  Pothole cold-mix asphalt and washed out culvert stabilization in Bokaro.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PLEDGE MODAL ─── */}
      {pledgingOn && (
        <Modal
          title={`Pledge CSR Support · ${fmtINR(pledgingOn.funding_sought)}`}
          onClose={() => setPledgingOn(null)}
        >
          <form onSubmit={submitPledge} className="flex flex-col gap-6 font-body text-ink">
            
            <div className="p-4 rounded-lg bg-surface-2 border border-line text-[14px] leading-relaxed text-ink-2">
              <strong className="text-ink mr-2">Proposal Scope:</strong> 
              {pledgingOn.proposal_text?.slice(0, 150)}…
            </div>

            <div className="flex flex-col gap-2">
              <Label>Support Mechanism <span className="text-red-500">*</span></Label>
              <select
                className="w-full bg-surface border border-line rounded-lg px-4 py-3 text-[15px] font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-ink transition-shadow"
                value={pledgeForm.type}
                onChange={(e) => setPledgeForm({ ...pledgeForm, type: e.target.value })}
              >
                <option value="funding">Direct CSR Grant Funding ({fmtINR(pledgingOn.funding_sought)})</option>
                <option value="mentorship">Technical & Industry Mentorship</option>
                <option value="both">Both Grant Funding & Engineering Mentorship</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Corporate Note to University / District Administration</Label>
              <Textarea
                rows={3}
                placeholder="Detail your CSR mandate alignment, release schedule, or technical equipment donation..."
                value={pledgeForm.message}
                onChange={(e) => setPledgeForm({ ...pledgeForm, message: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-line mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPledgingOn(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={busy}>
                {busy ? "Recording…" : "Confirm Official CSR Commitment"}
              </Button>
            </div>
          </form>
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
              message: `We are interested in funding this project.`,
            });
          }}
          proposals={proposals}
          interests={interests}
        />
      )}
    </Shell>
  );
}
