"use client";

import Image from "next/image";

/** Friendly illustrated empty state used across all portals. */
export function EmptyState({ title = "Nothing here yet", hint, action, compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "py-8 px-4" : "py-12 px-6"
      }`}
    >
      <Image
        src="/illustrations/empty-state.png"
        alt=""
        aria-hidden="true"
        width={compact ? 96 : 140}
        height={compact ? 96 : 140}
        loading="lazy"
        className="float-soft opacity-95"
      />
      <h4 className="font-display text-[17px] font-bold text-ink mt-4">{title}</h4>
      {hint && <p className="text-[13.5px] text-ink-2 leading-relaxed max-w-sm mt-1.5">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
