"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  Sparkle,
  MapPin,
  CheckCircle,
  ArrowsClockwise,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Waveform,
  Globe,
  ArrowRight,
} from "@phosphor-icons/react";

const DEMO_CASES = [
  {
    id: "case-latehar",
    token: "#JH-LAT-2026-094",
    title: "Fluoride Contamination in Village Borewell",
    district: "Latehar",
    block: "Manika Block, Ward 4",
    dialect: "Khortha / Nagpuri Dialect",
    sampleVoice: "गाँव के मुख्य चापाकल में पिछले 12 दिनों से फ्लोराइड युक्त गंदला पानी आ रहा है...",
    englishSummary: "Severe turbidity and fluoride toxicity detected in primary community handpump serving 420 tribal families.",
    category: "Water & Sanitation",
    confidence: "99.2%",
    geohashDist: "5km radius scan • 0 duplicates • Unique incident verified",
    score: 88,
    priorityLevel: "Critical Priority",
    academicMatch: "Central Univ of Jharkhand (CUJ) & NIT Jamshedpur",
    solutionTitle: "Graphene-Sand Bed & Bio-Adsorbent Filtration Skid",
    csrMatch: "Tata Steel Foundation CSR Escrow",
    grantAmount: "₹2,40,000",
  },
  {
    id: "case-khunti",
    token: "#JH-KHU-2026-042",
    title: "Solar Cold Storage Battery Inverter Failure",
    district: "Khunti",
    block: "Murhu Block, Panchayat Torpa",
    dialect: "Mundari / Hindi",
    sampleVoice: "सब्जी और महुआ भंडारण का सोलर कोल्ड स्टोरेज पिछले एक हफ्ते से बंद पड़ा है...",
    englishSummary: "Thermal insulation and phase change material inverter shutdown causing spoilage of tribal forest produce.",
    category: "Rural Energy & Agri",
    confidence: "97.4%",
    geohashDist: "5km radius scan • 1 related ticket merged as vote",
    score: 76,
    priorityLevel: "High Priority",
    academicMatch: "BIT Mesra — Dept of Mechanical & Renewable Energy",
    solutionTitle: "PCM Phase-Change Thermal Storage & Smart Inverter Bypass",
    csrMatch: "Coal India Foundation CSR Pool",
    grantAmount: "₹4,80,000",
  },
  {
    id: "case-dhanbad",
    token: "#JH-DHN-2026-118",
    title: "Coal Dust Particulate Infiltration in School",
    district: "Dhanbad",
    block: "Jharia Open Cast Buffer Zone",
    dialect: "Bhojpuri / Hindi",
    sampleVoice: "स्कूल परिसर में कोल डस्ट से बच्चों को सांस लेने में भारी तकलीफ हो रही है...",
    englishSummary: "PM2.5 / PM10 levels exceeding 380 µg/m³ around secondary school playground due to haul-road coal dust.",
    category: "Public Health & Environment",
    confidence: "98.1%",
    geohashDist: "5km radius scan • Spatial cluster of 4 notices consolidated",
    score: 91,
    priorityLevel: "Urgent Escalation",
    academicMatch: "IIT-ISM Dhanbad — Dept of Environmental Science",
    solutionTitle: "Ultrasonic Misting Fogger & Vegetative Dust Barrier",
    csrMatch: "Jindal Steel & Power CSR Foundation",
    grantAmount: "₹3,50,000",
  },
];

export default function AiPipelineVisualizer() {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(4);
  const [isSimulating, setIsSimulating] = useState(false);

  const c = DEMO_CASES[selectedCaseIdx];

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 700);
    setTimeout(() => setActiveStep(3), 1500);
    setTimeout(() => {
      setActiveStep(4);
      setIsSimulating(false);
    }, 2300);
  };

  return (
    <div className="w-full bg-surface rounded-xl border border-line shadow-xl overflow-hidden flex flex-col">
      {/* Top Telemetry Header */}
      <div className="bg-surface-2 border-b border-line px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-tint flex items-center justify-center text-green">
            <Cpu size={18} weight="duotone" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-ink text-[14px] sm:text-[15px] leading-tight">
                Live AI Triage & Sovereign Routing Pipeline
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green/10 text-green text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                Live 118ms
              </span>
            </div>
            <span className="text-[11px] text-ink-3">
              Groq Llama 3.3 70B • IndicBERT • Geodesic Deduplication
            </span>
          </div>
        </div>

        {/* Case Selector Tabs */}
        <div className="flex items-center gap-1 bg-surface border border-line rounded-lg p-1">
          {DEMO_CASES.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedCaseIdx(idx);
                runSimulation();
              }}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                selectedCaseIdx === idx
                  ? "bg-green text-white shadow-xs"
                  : "text-ink-2 hover:bg-surface-2"
              }`}
            >
              {item.district}
            </button>
          ))}
          <button
            type="button"
            onClick={runSimulation}
            disabled={isSimulating}
            className="ml-1 p-1 rounded hover:bg-surface-2 text-ink-3 hover:text-green transition-colors disabled:opacity-50"
            title="Re-run pipeline simulation"
          >
            <ArrowsClockwise size={14} className={isSimulating ? "animate-spin text-green" : ""} />
          </button>
        </div>
      </div>

      {/* Main Pipeline Nodes Container */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Ticket Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-2 border border-line text-[12px]">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-green bg-surface px-2 py-0.5 rounded border border-line">
              {c.token}
            </span>
            <span className="font-semibold text-ink truncate max-w-[280px] sm:max-w-md">
              {c.title}
            </span>
          </div>
          <div className="flex items-center gap-2 text-ink-3">
            <span className="flex items-center gap-1 font-medium text-ink-2">
              <MapPin size={13} weight="fill" className="text-green" />
              {c.district} ({c.block})
            </span>
          </div>
        </div>

        {/* 4 Connected Pipeline Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 relative">
          {/* Node 1: Multilingual NLP */}
          <div
            className={`p-3.5 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
              activeStep >= 1
                ? "bg-surface border-green/60 shadow-sm ring-1 ring-green/20"
                : "bg-surface-2/60 border-line opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                  Node 01 • NLP Ingestion
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green bg-green-tint/50 px-1.5 py-0.5 rounded">
                  <CheckCircle size={11} weight="fill" /> {c.confidence}
                </span>
              </div>
              <h4 className="font-display font-bold text-[13px] text-ink mb-1">
                Dialect Parser & Canonical Taxonomy
              </h4>
              <p className="text-[11.5px] text-ink-2 leading-relaxed mb-2 font-deva line-clamp-2">
                &ldquo;{c.sampleVoice}&rdquo;
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-line/60 flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1 text-ink-3">
                <Waveform size={12} className="text-green" /> {c.dialect}
              </span>
              <span className="font-semibold text-green">{c.category}</span>
            </div>
          </div>

          {/* Node 2: Spatial Deduplication */}
          <div
            className={`p-3.5 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
              activeStep >= 2
                ? "bg-surface border-green/60 shadow-sm ring-1 ring-green/20"
                : "bg-surface-2/60 border-line opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                  Node 02 • Spatial Dedup
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-info bg-info-tint/50 px-1.5 py-0.5 rounded">
                  <MapPin size={11} weight="fill" /> 5km Scan
                </span>
              </div>
              <h4 className="font-display font-bold text-[13px] text-ink mb-1">
                Geodesic Geohash Clustering
              </h4>
              <p className="text-[11.5px] text-ink-2 leading-relaxed mb-2">
                {c.geohashDist}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-line/60 flex items-center justify-between text-[11px]">
              <span className="text-ink-3">Cadastral Grid</span>
              <span className="font-mono font-semibold text-ink-2">Latehar 23.89°N</span>
            </div>
          </div>

          {/* Node 3: Severity & Priority Formula */}
          <div
            className={`p-3.5 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
              activeStep >= 3
                ? "bg-surface border-green/60 shadow-sm ring-1 ring-green/20"
                : "bg-surface-2/60 border-line opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                  Node 03 • Priority Scoring
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-saffron bg-saffron-tint/60 px-1.5 py-0.5 rounded font-mono">
                  {c.score}/100
                </span>
              </div>
              <h4 className="font-display font-bold text-[13px] text-ink mb-1">
                {c.priorityLevel}
              </h4>
              <p className="text-[11.5px] text-ink-2 leading-relaxed mb-2">
                Calculated via: Severity × Population Density × Monsoonal Vulnerability index.
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-line/60 flex items-center justify-between text-[11px]">
              <span className="text-ink-3">72h SLA Clock</span>
              <span className="font-bold text-red">Active Tracker</span>
            </div>
          </div>

          {/* Node 4: Autonomous Dispatch */}
          <div
            className={`p-3.5 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
              activeStep >= 4
                ? "bg-surface border-green shadow-md ring-2 ring-green/30"
                : "bg-surface-2/60 border-line opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-green font-bold">
                  Node 04 • Quad-Helix Match
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green bg-green-tint px-1.5 py-0.5 rounded">
                  <ShieldCheck size={11} weight="fill" /> Assigned
                </span>
              </div>
              <h4 className="font-display font-bold text-[13px] text-ink mb-1">
                {c.academicMatch}
              </h4>
              <p className="text-[11px] text-ink-2 leading-snug mb-2 font-medium">
                {c.solutionTitle}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-line/60 flex items-center justify-between text-[11px]">
              <span className="text-ink-3 truncate max-w-[120px]">{c.csrMatch}</span>
              <span className="font-mono font-bold text-green">{c.grantAmount}</span>
            </div>
          </div>
        </div>

        {/* Action Callout Footnote */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line text-[12px]">
          <div className="flex items-center gap-2 text-ink-2">
            <Sparkle size={15} weight="fill" className="text-saffron shrink-0" />
            <span>
              <strong>Zero-friction automated routing</strong>: Every verified ticket directly assigns an engineering faculty lead and pledges pre-approved CSR escrow.
            </span>
          </div>
          <a
            href="#how"
            className="inline-flex items-center gap-1 font-semibold text-green hover:underline hover:underline-offset-2"
          >
            Inspect AI Architecture <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
