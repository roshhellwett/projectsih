import { STATUS_FLOW, STATUS_LBL } from "./constants";

/*
 * Grievance lifecycle stepper.
 *
 * Uses role="listitem" semantics rather than role="progressbar": a progressbar
 * exposes aria-valuenow as a percentage, which is wrong for a 6-step lifecycle.
 * Each stage is announced as an item with aria-current on the active one, which
 * screen readers read out far more usefully ("Current step: Under Review").
 */
export function Stepper({ status }) {
  const idx = STATUS_FLOW.indexOf(status);

  return (
    <div
      className="mt-5 pt-5 border-t border-line flex flex-wrap md:flex-nowrap gap-2 md:gap-1 w-full"
      role="list"
      aria-label="Resolution lifecycle progress"
    >
      {STATUS_FLOW.map((s, i) => {
        const isDone = i < idx;
        const isNow = i === idx;

        return (
          <div
            key={s}
            role="listitem"
            aria-current={isNow ? "step" : undefined}
            aria-label={`${STATUS_LBL[s]}${isDone ? " — completed" : isNow ? " — current step" : " — pending"}`}
            className={`flex-1 flex flex-col min-w-[80px] relative px-1 py-1.5 rounded-lg transition-colors ${
              isNow ? "bg-green-tint/50 shadow-sm" : ""
            }`}
          >
            {/* Top Indicator Line */}
            <div
              aria-hidden="true"
              className={`h-1 w-full rounded-full mb-2 transition-colors ${
                isDone ? "bg-green" :
                isNow ? "bg-green shadow-[0_0_8px_rgba(23,173,115,0.4)]" :
                "bg-surface-2"
              }`}
            />

            {/* Label */}
            <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-center ${
              isDone || isNow ? "text-green" : "text-ink-3"
            }`}>
              {STATUS_LBL[s]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

