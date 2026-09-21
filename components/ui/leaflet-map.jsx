"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { STATUS_LBL } from "./constants";

// Defend against Leaflet _leaflet_pos crash on unmount or interrupted zoom transitions
if (typeof window !== "undefined" && L && L.DomUtil && !L.DomUtil._sahyogPatched) {
  const originalGetPosition = L.DomUtil.getPosition;
  L.DomUtil.getPosition = function (el) {
    if (!el) {
      return new L.Point(0, 0);
    }
    try {
      return originalGetPosition.call(this, el);
    } catch {
      return new L.Point(0, 0);
    }
  };
  L.DomUtil._sahyogPatched = true;
}

// Custom Leaflet DivIcon to avoid broken image URLs in Next.js
const createMarkerIcon = (priority) => {
  const isHighPrio = priority > 7;
  const isMedPrio = priority > 4;
  const bgColor = isHighPrio ? "#ef4444" : isMedPrio ? "#f59e0b" : "#10b981";
  
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${bgColor};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Component to handle auto-fitting bounds based on problems
function MapBounds({ problems }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    try {
      const container = map.getContainer();
      if (!container || !map._mapPane) return;

      const validCoords = problems.filter(
        p => p.latitude != null && p.longitude != null && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude))
      );
      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords.map(p => [Number(p.latitude), Number(p.longitude)]));
        if (bounds.isValid()) {
          // Disable animation to prevent asynchronous _onZoomTransitionEnd firing after component unmount
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: false });
        }
      }
    } catch {
      // Guard against race conditions during view transitions
    }
  }, [problems, map]);

  useEffect(() => {
    return () => {
      if (map) {
        try {
          map.stop();
        } catch {}
      }
    };
  }, [map]);

  return null;
}

export default function LeafletMapClient({ problems = [], onSelect }) {
  // Center of Jharkhand roughly
  const defaultCenter = [23.6102, 85.2799];
  const defaultZoom = 7;

  return (
    <div className="relative w-full h-full min-h-[400px] z-0 rounded-2xl overflow-hidden shadow-inner border border-line">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {problems.length > 0 && <MapBounds problems={problems} />}

        {problems.map((p) => {
          if (p.latitude == null || p.longitude == null || isNaN(Number(p.latitude)) || isNaN(Number(p.longitude))) {
            return null;
          }
          const lat = Number(p.latitude);
          const lng = Number(p.longitude);
          const pr = Number(p.priority_score ?? p.priority ?? 5);
          
          return (
            <Marker 
              key={p.id} 
              position={[lat, lng]} 
              icon={createMarkerIcon(pr)}
              eventHandlers={{
                click: () => onSelect && onSelect(p),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="flex flex-col gap-1 p-1 min-w-[200px]">
                  <b className="font-display text-[15px] leading-snug">{p.title}</b>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[10px] bg-surface-2 px-1.5 py-0.5 rounded font-semibold text-ink-2">
                      {p.district}
                    </span>
                    <span className="text-[10px] bg-green-tint text-green px-1.5 py-0.5 rounded font-bold uppercase">
                      {STATUS_LBL[p.status] || p.status}
                    </span>
                    {p.routed_to_name && (
                      <span className="text-[10px] bg-surface-2 text-ink-2 px-1.5 py-0.5 rounded font-medium">
                        🎓 {p.routed_to_name}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-line">
                    <span className="text-[10px] font-mono font-bold text-ink-3">PRIORITY: {pr.toFixed(1)}</span>
                    <span className="text-[11px] font-bold text-green">▲ {p.votes ?? 0} votes</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-paper/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-line pointer-events-none">
        <div className="text-[10px] font-mono font-bold tracking-widest text-ink-3 uppercase mb-2">Priority Level</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm" />
            <span className="text-[11px] font-semibold text-ink">High (8-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
            <span className="text-[11px] font-semibold text-ink">Medium (5-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
            <span className="text-[11px] font-semibold text-ink">Normal (1-4)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
