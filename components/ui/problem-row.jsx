import { MapPin } from "@phosphor-icons/react";
import { CAT_ICONS, CAT_LABEL, STATUS_LBL } from "./constants";
import { VoteBtn } from "./vote-btn";
import { Button } from "./button";

export function ProblemRow({ problem: p, viewerRole, onVote, onTrack, onPropose }) {
  const uni = p.routed_to_name;
  const canPropose = viewerRole === "university" && ["routed", "in_review"].includes(p.status);
  const isCitizen = viewerRole === "citizen";
  const CatIcon = CAT_ICONS[p.category] || MapPin;

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
  
  // Status badge colors
  const getStatusClasses = (st) => {
    switch (st) {
      case "new":
      case "routed":
        return "bg-amber-tint text-amber border-amber-soft";
      case "in_review":
      case "funding":
        return "bg-blue-tint/50 text-blue border-blue/20";
      case "building":
        return "bg-purple-tint/50 text-purple border-purple/20";
      case "resolved":
        return "bg-green-tint text-green border-green-soft";
      default:
        return "bg-surface-2 text-ink-2 border-line";
    }
  };

  const priorityColor = (p.priority_score ?? 5) > 7 ? "bg-red-500" : (p.priority_score ?? 5) > 4 ? "bg-amber-500" : "bg-green-500";

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-5 bg-surface rounded-lg border border-line shadow-sm hover:border-green-soft transition-colors relative group">
      
      {/* Icon Area */}
      <div className="hidden sm:flex w-11 h-11 rounded-md bg-paper items-center justify-center shrink-0 border border-line text-ink-2 group-hover:text-green group-hover:border-green-soft transition-colors">
        <CatIcon size={22} weight="duotone" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-bold text-ink text-[15px] leading-snug text-balance">
            {p.title}
          </h4>
          
          {/* Mobile Priority Badge */}
          <div className="sm:hidden flex flex-col items-end shrink-0">
            <span className="text-[14px] font-display font-bold leading-none">{Number(p.priority_score ?? 5).toFixed(1)}</span>
            <span className="text-[8px] font-mono tracking-widest text-ink-3 uppercase font-bold mt-0.5">SLA Prio</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface text-ink-2 text-[11px] font-semibold border border-line">
            <span className={`w-1.5 h-1.5 rounded-full ${getCatColor(p.category)}`} />
            {CAT_LABEL[p.category] || "Other"}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusClasses(p.status)}`}>
            {STATUS_LBL[p.status] || p.status}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-2 text-ink-2 text-[11px] font-medium border border-transparent">
            📍 {p.district}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-ink-3 font-semibold bg-surface-2">
            #{p.id.slice(0, 8)}
          </span>
        </div>

        <p className="text-[13px] text-ink-2 leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
          {p.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-auto pt-3 border-t border-line/60">
          {isCitizen ? (
            <VoteBtn problem={p} onVote={onVote} />
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface border border-line text-[11.5px] font-bold text-ink-2 shadow-sm">
              ▲ {p.votes ?? 0} citizen votes
            </span>
          )}
          
          {uni && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-tint/30 border border-blue/10 text-[11.5px] font-medium text-blue">
              🎓 {uni}
            </span>
          )}

          <div className="flex w-full sm:flex-1 sm:justify-end gap-2 sm:min-w-[200px]">
            {canPropose && (
              <Button size="sm" onClick={() => onPropose(p)}>
                Form Team & Propose
              </Button>
            )}
            {onTrack && (
              <Button variant="outline" size="sm" onClick={() => onTrack(p)}>
                Track Lifecycle
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Priority Score Sidebar */}
      <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-[60px] pl-4 border-l border-line/60">
        <b className="font-display text-[22px] font-bold tracking-tight text-ink mb-1">
          {Number(p.priority_score ?? 5).toFixed(1)}
        </b>
        <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden mb-1.5">
          <div 
            className={`h-full rounded-full ${priorityColor}`} 
            style={{ width: (p.priority_score ?? 5) * 10 + "%" }} 
          />
        </div>
        <div className="text-[9px] font-mono tracking-widest uppercase font-bold text-ink-3 text-center leading-none">
          SLA<br/>PRIO
        </div>
      </div>
    </div>
  );
}
