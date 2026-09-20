"use client";

/* ════════════════════════════════════════════════════════════════════════════
   SAHYOG Portal — Government & State Command Center
════════════════════════════════════════════════════════════════════════════ */
import { useState } from "react";
import {
  Shell,
  ProblemRow,
  CATS,
  CAT_LABEL,
  CAT_ICONS,
  STATUS_FLOW,
  STATUS_LBL,
  DISTRICTS,
  fmtINR,
  EmptyState,
} from "@/components/ui";
import { Button } from "@/components/ui";
import ProblemDetailModal from "./ProblemDetailModal";
import {
  ListBullets,
  ChartLineUp,
  BellSimpleRinging,
  FileCsv,
  MagnifyingGlass,
  CheckCircle,
  Clock,
  ShieldCheck,
  BuildingApartment,
  MapPin,
  WarningCircle,
} from "@phosphor-icons/react";

const ICON = {
  chart: '<path d="M3 13h4l3 7 4-16 3 9h4"/>',
  list: '<path d="M9 5h6M8 3h8v18H8zM11 8h2M11 12h2M11 16h2"/>',
  bell: '<path d="M4 4h16v12H8l-4 4zM8 9h8M8 13h5"/>',
};

export default function AdminPortal({
  user,
  problems,
  proposals,
  interests,
  notifications,
  onSignOut,
  push,
  loadAll,
  view,
  setView,
  trackId,
  setTrackId,
}) {
  const [query, setQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailProb, setDetailProb] = useState(null);

  const NAV = [
    ["all", "Civic Grievance Master Queue", ICON.list, problems.length],
    ["stats", "State Command Dashboard", ICON.chart],
    ["audit", "Audit Trail & Dispatch Log", ICON.bell, notifications.length],
  ];
  const activeView = NAV.some(([k]) => k === view) ? view : "all";

  /* ─── CSV Export for Official Records ─── */
  function exportCSV() {
    const headers = [
      "Ticket ID",
      "Title",
      "Category",
      "District",
      "Priority Score",
      "Citizen Votes",
      "Status",
      "Created At",
    ];
    const rows = filteredProblems.map((p) => [
      p.id,
      `"${(p.title || "").replace(/"/g, '""')}"`,
      p.category,
      p.district,
      Number(p.priority_score ?? 5).toFixed(1),
      p.votes ?? 0,
      p.status,
      new Date(p.created_at).toLocaleDateString("en-IN"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `SAHYOG_Jharkhand_Grievances_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    push("Audit CSV Exported", `Downloaded ${filteredProblems.length} civic records.`, "ok");
  }

  /* ─── Change Status via /api/status ─── */
  async function handleStatusChange(problemId, nextStatus) {
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_id: problemId, status: nextStatus }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Failed to update status");

      push(
        "Status Transition Recorded",
        `Grievance #${problemId.slice(0, 8)} transitioned to ${
          STATUS_LBL[nextStatus] || nextStatus
        }`,
        "ok"
      );
      if (detailProb && detailProb.id === problemId) {
        setDetailProb({ ...detailProb, status: nextStatus });
      }
      await loadAll();
    } catch (e) {
      push("Update Error", e.message, "warn");
    }
  }

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    if (districtFilter !== "all" && p.district !== districtFilter) return false;
    if (catFilter !== "all" && p.category !== catFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const match =
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.district || "").toLowerCase().includes(q) ||
        (p.id || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalResolved = problems.filter((p) => p.status === "resolved").length;
  const resolutionRate = problems.length ? Math.round((totalResolved / problems.length) * 100) : 0;
  const totalFundingCommitted = interests.reduce((acc, curr) => {
    const matched = proposals.find((pr) => pr.id === curr.proposal_id);
    return acc + (matched?.funding_sought || 250000);
  }, 0);

  return (
    <Shell
      user={user}
      roleName="State Government Administrator"
      active={activeView}
      navItems={NAV}
      onNav={(id) => {
        setView(id);
        setTrackId(null);
      }}
      onExit={onSignOut}
      title={
        activeView === "all"
          ? "Statewide Civic Grievance Queue"
          : activeView === "stats"
          ? "Jharkhand Civic Command Dashboard"
          : "Official Audit Trail & Dispatches"
      }
      sub="Statewide oversight, automated AI triage governance, university-CSR monitoring, and SLA enforcement"
    >
      {/* ─── CIVIC GRIEVANCES QUEUE ─── */}
      {activeView === "all" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          {/* Controls Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-lg bg-surface border border-line shadow-sm">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <div className="relative flex-1 min-w-[220px]">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
                <input
                  className="w-full bg-paper border border-line rounded-lg pl-10 pr-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-ink transition-shadow"
                  placeholder="Search by keyword, district, or ticket ID..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select
                className="bg-paper border border-line rounded-lg px-3 py-2.5 text-[14px] font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-ink w-full md:w-auto"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="all">All Districts (24)</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                className="bg-paper border border-line rounded-lg px-3 py-2.5 text-[14px] font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-ink w-full md:w-auto"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
              >
                <option value="all">All Civic Sectors</option>
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {CAT_LABEL[c]}
                  </option>
                ))}
              </select>
              <select
                className="bg-paper border border-line rounded-lg px-3 py-2.5 text-[14px] font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-ink w-full md:w-auto"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {STATUS_FLOW.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LBL[s] || s}
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={exportCSV} variant="secondary" className="shrink-0 w-full xl:w-auto">
              <FileCsv size={18} className="mr-1" /> Export Audit CSV ({filteredProblems.length})
            </Button>
          </div>

          {/* Grievance List */}
          {filteredProblems.length === 0 ? (
            <div className="bg-surface rounded-lg border border-dashed border-line">
              <EmptyState
                title="No Matching Grievances Found"
                hint="Try resetting filters or checking another district."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredProblems.map((p) => (
                <ProblemRow
                  key={p.id}
                  problem={p}
                  viewerRole="admin"
                  onTrack={() => setDetailProb(p)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── STATE COMMAND METRICS ─── */}
      {activeView === "stats" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col bg-surface border border-line rounded-lg p-5 shadow-sm">
              <div className="text-[10px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">TOTAL COMPLAINTS LOGGED</div>
              <div className="font-display text-3xl font-bold text-ink mb-1">{problems.length}</div>
              <div className="text-[13px] font-semibold text-ink-2">Across 24 districts</div>
            </div>
            
            <div className="flex flex-col bg-surface border border-line rounded-lg p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><ChartLineUp size={64} weight="duotone" /></div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">STATE RESOLUTION RATE</div>
              <div className="font-display text-3xl font-bold text-green mb-1">{resolutionRate}%</div>
              <div className="text-[13px] font-semibold text-ink-2">{totalResolved} problems resolved</div>
            </div>

            <div className="flex flex-col bg-surface border border-line rounded-lg p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle size={64} weight="duotone" /></div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">CSR CAPITAL COMMITTED</div>
              <div className="font-display text-3xl font-bold text-amber mb-1">{fmtINR(totalFundingCommitted)}</div>
              <div className="text-[13px] font-semibold text-ink-2">{interests.length} corporate commitments</div>
            </div>

            <div className="flex flex-col bg-surface border border-line rounded-lg p-5 shadow-sm">
              <div className="text-[10px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">ACADEMIC PROPOSALS</div>
              <div className="font-display text-3xl font-bold text-ink mb-1">{proposals.length}</div>
              <div className="text-[13px] font-semibold text-ink-2">From BIT, BAU, NIT, RU</div>
            </div>
          </div>

          {/* Sector Breakdown */}
          <div className="flex flex-col bg-surface border border-line rounded-lg p-5 shadow-sm mt-2">
            <h4 className="font-display text-lg font-bold text-ink mb-6 pb-4 border-b border-line">Sectoral Distribution & Routing Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATS.map((c) => {
                const count = problems.filter((p) => p.category === c).length;
                const pct = problems.length ? Math.round((count / problems.length) * 100) : 0;
                const Icon = CAT_ICONS[c] || MapPin;
                return (
                  <div key={c} className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 text-[14px] font-bold text-ink">
                        <Icon size={18} weight="duotone" className="text-ink-2" />
                        {CAT_LABEL[c]}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-ink-3">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-line">
                      <div className="h-full bg-ink rounded-full" style={{ width: `${Math.max(pct, 2)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── AUDIT TRAIL & LOGS ─── */}
      {activeView === "audit" && (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-line">
            <p className="text-[15px] text-ink-2 max-w-2xl leading-relaxed">
              Immutable audit log of all automated citizen SMS alerts, university routing notifications, and CSR commitments.
            </p>
          </div>

          <div className="flex flex-col bg-surface rounded-lg border border-line overflow-hidden shadow-sm">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-ink-3 font-semibold">No audit logs available.</div>
            ) : (
              <div className="divide-y divide-line">
                {notifications.map((n) => (
                  <div key={n.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-surface-2 transition-colors">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-surface border border-line text-ink-3">
                        {n.channel || "SMS"}
                      </span>
                      <span className="text-[12px] font-mono font-bold text-ink-2 w-28 truncate">
                        {n.send_to || "all"}
                      </span>
                    </div>
                    
                    <span className="text-[14px] text-ink flex-1 leading-snug">{n.text}</span>
                    
                    <span className="text-[11px] font-mono font-bold text-ink-3 shrink-0 sm:text-right">
                      {new Date(n.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Problem Detail Modal */}
      {detailProb && (
        <ProblemDetailModal
          problem={detailProb}
          onClose={() => setDetailProb(null)}
          viewerRole="admin"
          user={user}
          onStatusChange={handleStatusChange}
          proposals={proposals}
          interests={interests}
        />
      )}
    </Shell>
  );
}
