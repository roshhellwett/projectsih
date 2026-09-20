"use client";

/* ════════════════════════════════════════════════════════════════════════════
   SAHYOG Portal — Sovereign Government Emblem & Brandmark Suite
   Government of Jharkhand · Department of Higher & Technical Education
   GIGW 3.0 Standard · Official Seal & Ashoka Lion Capital Vector Systems
   ════════════════════════════════════════════════════════════════════════════ */

import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * 1. AshokaLionCapital
 * High-fidelity vector depiction of the Lion Capital of Ashoka (National Emblem of India)
 * Features 3 lions, abacus with Dharma Chakra, horse, bull, and "सत्यमेव जयते" plinth.
 */
export function AshokaLionCapital({ size = 44, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Lion Capital of Ashoka - National Emblem of India"
    >
      {/* ── Outer subtle glow / aura ── */}
      <circle cx="50" cy="55" r="46" fill="url(#ashoka-glow)" opacity="0.3" />

      {/* ── Left Lion Profile ── */}
      <path
        d="M26 42 C24 38 23 32 25 26 C27 20 33 16 38 18 C38 12 43 9 47 10 C46 16 43 20 41 24 C40 28 41 33 42 38 Z"
        fill="url(#gold-metal-l)"
        stroke="#78350F"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      {/* Left Lion Mane Tuft details */}
      <path d="M28 29 Q33 30 35 36" stroke="#92400E" strokeWidth="0.8" fill="none" />
      <path d="M26 35 Q30 36 33 41" stroke="#92400E" strokeWidth="0.8" fill="none" />
      <path d="M31 23 Q35 25 37 30" stroke="#92400E" strokeWidth="0.8" fill="none" />

      {/* ── Right Lion Profile ── */}
      <path
        d="M74 42 C76 38 77 32 75 26 C73 20 67 16 62 18 C62 12 57 9 53 10 C54 16 57 20 59 24 C60 28 59 33 58 38 Z"
        fill="url(#gold-metal-r)"
        stroke="#78350F"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      {/* Right Lion Mane Tuft details */}
      <path d="M72 29 Q67 30 65 36" stroke="#92400E" strokeWidth="0.8" fill="none" />
      <path d="M74 35 Q70 36 67 41" stroke="#92400E" strokeWidth="0.8" fill="none" />
      <path d="M69 23 Q65 25 63 30" stroke="#92400E" strokeWidth="0.8" fill="none" />

      {/* ── Central Lion (Facing Forward) ── */}
      {/* Crown & Head */}
      <path
        d="M41 18 C41 11 44 8 50 8 C56 8 59 11 59 18 C63 19 66 23 66 28 C66 35 63 42 59 47 C55 50 45 50 41 47 C37 42 34 35 34 28 C34 23 37 19 41 18 Z"
        fill="url(#gold-metal-c)"
        stroke="#78350F"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* Ears */}
      <path d="M36 17 C35 13 38 11 40 14 Z" fill="#D97706" stroke="#78350F" strokeWidth="0.6" />
      <path d="M64 17 C65 13 62 11 60 14 Z" fill="#D97706" stroke="#78350F" strokeWidth="0.6" />

      {/* Muzzle & Nose */}
      <path d="M47 26 C47 24 53 24 53 26 C53 28 51 29 50 29 C49 29 47 28 47 26 Z" fill="#78350F" />
      <path d="M50 29 L50 33 M46 34 C48 36 52 36 54 34" stroke="#78350F" strokeWidth="0.9" strokeLinecap="round" fill="none" />

      {/* Eyes & Brows */}
      <ellipse cx="45" cy="22" rx="1.6" ry="1.2" fill="#78350F" />
      <ellipse cx="55" cy="22" rx="1.6" ry="1.2" fill="#78350F" />
      <path d="M43 20 Q46 19 47 21" stroke="#78350F" strokeWidth="0.8" fill="none" />
      <path d="M57 20 Q54 19 53 21" stroke="#78350F" strokeWidth="0.8" fill="none" />

      {/* Mane Striations */}
      <path d="M41 28 Q37 32 39 38" stroke="#92400E" strokeWidth="0.75" fill="none" />
      <path d="M59 28 Q63 32 61 38" stroke="#92400E" strokeWidth="0.75" fill="none" />
      <path d="M44 35 Q46 41 50 43 Q54 41 56 35" stroke="#92400E" strokeWidth="0.75" fill="none" />
      <path d="M47 38 L47 44 M53 38 L53 44" stroke="#92400E" strokeWidth="0.75" />

      {/* Central Lion Chest & Paws */}
      <path
        d="M38 46 L36 58 L42 58 L44 48 L50 49 L56 48 L58 58 L64 58 L62 46 Z"
        fill="url(#gold-metal-c)"
        stroke="#78350F"
        strokeWidth="0.8"
      />

      {/* ── Abacus / Platform ── */}
      <rect
        x="18"
        y="58"
        width="64"
        height="14"
        rx="2"
        fill="url(#abacus-gold)"
        stroke="#78350F"
        strokeWidth="1"
      />
      {/* Abacus top & bottom rim lines */}
      <line x1="18" y1="60.5" x2="82" y2="60.5" stroke="#FDE68A" strokeWidth="0.8" />
      <line x1="18" y1="69.5" x2="82" y2="69.5" stroke="#78350F" strokeWidth="0.8" />

      {/* ── Dharma Chakra (24-spoke wheel) on Abacus Center ── */}
      <circle cx="50" cy="65" r="5" fill="#1E3A8A" stroke="#FDE68A" strokeWidth="0.6" />
      <circle cx="50" cy="65" r="1.2" fill="#FDE68A" />
      {/* 12 cross lines for 24 spokes */}
      <g stroke="#93C5FD" strokeWidth="0.4" opacity="0.9">
        <line x1="50" y1="60.5" x2="50" y2="69.5" />
        <line x1="45.5" y1="65" x2="54.5" y2="65" />
        <line x1="46.8" y1="61.8" x2="53.2" y2="68.2" />
        <line x1="53.2" y1="61.8" x2="46.8" y2="68.2" />
      </g>

      {/* ── Galloping Horse (Left on Abacus) ── */}
      <path
        d="M26 67 C27 64 29 63 32 64 C34 64 36 67 38 66 C37 68 34 69 31 68 Z"
        fill="#78350F"
        opacity="0.85"
      />

      {/* ── Sturdy Bull (Right on Abacus) ── */}
      <path
        d="M74 67 C73 64 71 63 68 64 C66 64 64 67 62 66 C63 68 66 69 69 68 Z"
        fill="#78350F"
        opacity="0.85"
      />

      {/* ── Bell Capital / Inverted Lotus Base ── */}
      <path
        d="M24 72 C28 78 38 84 50 84 C62 84 72 78 76 72 Z"
        fill="url(#lotus-gold)"
        stroke="#78350F"
        strokeWidth="0.9"
      />
      {/* Lotus Petal ribs */}
      <path d="M34 73 C37 77 42 81 44 83" stroke="#92400E" strokeWidth="0.7" fill="none" />
      <path d="M66 73 C63 77 58 81 56 83" stroke="#92400E" strokeWidth="0.7" fill="none" />
      <path d="M50 72 L50 84" stroke="#92400E" strokeWidth="0.7" />

      {/* ── Plinth with Inscription: सत्यमेव जयते ── */}
      <rect
        x="16"
        y="86"
        width="68"
        height="12"
        rx="2"
        fill="#0F172A"
        stroke="#D97706"
        strokeWidth="0.8"
      />
      <text
        x="50"
        y="95"
        textAnchor="middle"
        fill="#FDE68A"
        fontSize="7.2"
        fontFamily="sans-serif"
        fontWeight="800"
        letterSpacing="0.6"
      >
        सत्यमेव जयते
      </text>

      {/* ── Gradients ── */}
      <defs>
        <radialGradient id="ashoka-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gold-metal-c" x1="50" y1="8" x2="50" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="gold-metal-l" x1="25" y1="10" x2="47" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="gold-metal-r" x1="75" y1="10" x2="53" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="abacus-gold" x1="18" y1="65" x2="82" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="25%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="lotus-gold" x1="50" y1="72" x2="50" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * 2. JharkhandStateSeal
 * The Official Circular Seal of the Government of Jharkhand (झारखण्ड सरकार).
 * Features concentric rings of forest green, gold double border, 24 elephants,
 * 24 Palash flowers, tribal dancers, and central Ashoka Lion Capital.
 */
export function JharkhandStateSeal({ size = 48, className = "" }) {
  return (
    <Image
      src="/jharkhand-gov-logo.png"
      alt="Government of Jharkhand · झारखण्ड सरकार"
      width={size}
      height={size}
      className={`shrink-0 object-contain drop-shadow-sm ${className}`}
      priority
    />
  );
}

/**
 * 3. SahyogQuadHelixMark
 * Deprecated and removed per user instruction.
 */
export function SahyogQuadHelixMark() {
  return null;
}

/**
 * 4. GovBrandLockup
 * Comprehensive, authoritative identity block used across headers, auth pages, and sidebars.
 * Renders the official Jharkhand state seal, SAHYOG branding, bilingual Devanagari typography.
 */
export function GovBrandLockup({
  variant = "jharkhand", // "jharkhand" | "ashoka"
  theme = "dark", // "dark" | "light"
  size = "md", // "sm" | "md" | "lg"
  href = "/",
  showSihBadge = true,
  className = "",
}) {
  const isDark = theme === "dark";
  const sizeMap = {
    sm: { emblem: 40, title: "text-base", sub: "text-[10px]" },
    md: { emblem: 48, title: "text-xl", sub: "text-xs" },
    lg: { emblem: 58, title: "text-2xl", sub: "text-sm" },
  };
  const s = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {/* Official State Seal */}
      <div className="relative flex items-center">
        {variant === "ashoka" ? (
          <AshokaLionCapital size={s.emblem} />
        ) : (
          <JharkhandStateSeal size={s.emblem} />
        )}
      </div>

      {/* Typography Section */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className={`font-display font-black tracking-tight ${s.title} ${isDark ? "text-white" : "text-slate-900"}`}>
            SAHYOG
          </span>
          <span className="font-deva font-bold text-amber-500 text-sm tracking-normal">
            (सहयोग)
          </span>
        </div>
        <span className={`font-mono font-semibold tracking-wider uppercase ${s.sub} ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
          Government of Jharkhand <span className="text-slate-400 font-normal">|</span> झारखण्ड सरकार
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export default GovBrandLockup;
