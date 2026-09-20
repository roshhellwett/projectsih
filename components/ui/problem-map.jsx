"use client";


import dynamic from "next/dynamic";

// Dynamically import the actual map implementation with SSR disabled
const LeafletMapClient = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-2 text-ink-3">
      <div className="w-8 h-8 rounded-full border-2 border-green/30 border-t-green animate-spin mb-4" />
      <span className="font-mono text-sm font-bold tracking-widest uppercase">Initializing Geographical Map</span>
    </div>
  ),
});

export function ProblemMap({ problems = [], onSelect }) {
  return (
    <div className="w-full h-full min-h-[400px] relative bg-surface-2">
      <LeafletMapClient problems={problems} onSelect={onSelect} />
    </div>
  );
}
