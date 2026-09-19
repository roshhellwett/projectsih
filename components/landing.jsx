"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  GraduationCap,
  Factory,
  Bank,
  Check,
  ArrowRight,
  Brain,
  HandCoins,
  MapPin,
  CaretRight,
} from "@phosphor-icons/react";

const CAT_COLOR = {
  education: "bg-blue-500",
  health: "bg-red-500",
  agriculture: "bg-lime-600",
  water: "bg-blue-400",
  infrastructure: "bg-amber-600",
  environment: "bg-green-600",
  other: "bg-stone-500",
};

const CAT_LABEL = {
  en: {
    education: "Education",
    health: "Health",
    agriculture: "Agriculture",
    water: "Water Supply",
    infrastructure: "Infrastructure",
    environment: "Environment",
    other: "Other",
  },
  hi: {
    education: "शिक्षा",
    health: "स्वास्थ्य",
    agriculture: "कृषि",
    water: "पेयजल आपूर्ति",
    infrastructure: "सड़क व अवसंरचना",
    environment: "पर्यावरण",
    other: "अन्य",
  },
};

/* ════════════════════════════════════════════════════════════════════════════
   1. Live Bridge Panel (Real-Time Feed with Fallback Civic Stream)
════════════════════════════════════════════════════════════════════════════ */
export function BridgePanel({ lang = "en" }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/feed")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setItems(d.ok && d.items?.length ? d.items : false);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const demoItems = [
    { title: "Solar pump dysfunctional at Anganwadi center", district: "Gumla", category: "water", votes: 24 },
    { title: "Primary Health Center roof leakage in monsoon", district: "Ranchi", category: "health", votes: 41 },
    { title: "Smart classroom projector setup required", district: "Dhanbad", category: "education", votes: 19 },
    { title: "Culvert damage on rural link road PMGSY", district: "Hazaribagh", category: "infrastructure", votes: 37 },
    { title: "Soil salinity testing kit needed for tribal farmers", district: "Khunti", category: "agriculture", votes: 15 },
  ];

  const activeItems = (items && items.length) ? items : demoItems;

  return (
    <div className="bg-surface rounded-lg border border-line shadow-lg overflow-hidden flex flex-col h-full max-h-[500px]">
      <div className="bg-surface-2 border-b border-line p-4 flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-ink text-[16px]">
            {lang === "hi" ? "लाइव नागरिक शिकायत फीड" : "Live Civic Grievance Feed"}
          </h3>
          <span className="text-[12px] text-ink-3">
            {lang === "hi" ? "राज्यभर से प्राप्त वास्तविक रिपोर्ट" : "Real-time stream from Jharkhand"}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-tint/30 border border-red/20 text-[10px] font-bold text-red tracking-widest uppercase shadow-sm shadow-red/10">
          <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
        {activeItems.slice(0, 5).map((p, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-surface border border-line hover:border-green transition-colors">
            <span
              className={`mt-1 shrink-0 w-2.5 h-2.5 rounded-full ${CAT_COLOR[p.category] || CAT_COLOR.other}`}
              title={p.category}
            />
            <div className="flex-1 min-w-0">
              <span className="block text-[14px] font-semibold text-ink leading-snug mb-1 truncate">{p.title}</span>
              <div className="flex items-center gap-2 text-[12px] text-ink-3">
                <span className="font-medium text-ink-2">📍 {p.district || "Jharkhand"}</span>
                <span>•</span>
                <span>{CAT_LABEL[lang]?.[p.category] || p.category}</span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2 border-l border-line">
              <b className="text-[15px] text-green font-display">{p.votes ?? 0}</b>
              <span className="text-[10px] text-ink-3 uppercase font-bold tracking-wider">{lang === "hi" ? "समर्थन" : "votes"}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-2 border-t border-line p-3 px-4 flex items-center justify-between">
        <span className="text-[11px] text-ink-3 font-medium">
          {lang === "hi" ? "Groq AI द्वारा 0.4s में वर्गीकृत" : "Triaged by Groq Llama 3.3 in 0.4s"}
        </span>
        <Link href="/login" className="text-[12px] font-bold text-green hover:text-green/80 transition-colors flex items-center gap-1">
          {lang === "hi" ? "सभी देखें" : "View All Reports"} <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2. Grievance Lifecycle Journey Pipeline (UX4G Compliant Stepper)
════════════════════════════════════════════════════════════════════════════ */
export function JourneyRail({ lang = "en" }) {
  const journeySteps = [
    {
      icon: User,
      who: lang === "hi" ? "1. नागरिक" : "1. Citizen",
      t: lang === "hi" ? "शिकायत दर्ज" : "Report",
      d:
        lang === "hi"
          ? "सरल भाषा में समस्या लिखें। फोटो और जीपीएस स्थान स्वतः संलग्न होता है।"
          : "Plain language description with geotagged photo and automated GPS pin from any district.",
      color: "text-green",
      bg: "bg-green-tint/50",
    },
    {
      icon: Brain,
      who: lang === "hi" ? "2. एआई इंजन" : "2. AI Engine",
      t: lang === "hi" ? "वर्गीकरण व स्कोरिंग" : "Classify & Triage",
      d:
        lang === "hi"
          ? "Groq AI 7 नागरिक श्रेणियों में वर्गीकरण, डुप्लिकेशन जांच और तात्कालिकता स्कोर देता है।"
          : "Groq Llama 3.3 classifies into 7 civic sectors, checks duplicate reports, and assigns SLA priority.",
      color: "text-amber",
      bg: "bg-amber-tint/50",
    },
    {
      icon: GraduationCap,
      who: lang === "hi" ? "3. विश्वविद्यालय" : "3. University",
      t: lang === "hi" ? "अनुसंधान व समाधान" : "Solve & Propose",
      d:
        lang === "hi"
          ? "संबंधित इंजीनियरिंग/कृषि विभाग को समस्या भेजी जाती है। संकाय व छात्र समाधान प्रस्ताव बनाते हैं।"
          : "Matched department faculty and student teams formulate a structured, costed engineering solution.",
      color: "text-blue",
      bg: "bg-blue-tint/50",
    },
    {
      icon: HandCoins,
      who: lang === "hi" ? "4. उद्योग सीएसआर" : "4. Industry CSR",
      t: lang === "hi" ? "फंडिंग व मेंटरशिप" : "Fund & Mentor",
      d:
        lang === "hi"
          ? "कॉर्पोरेट साझेदार प्रस्तावों की समीक्षा कर सीएसआर फंड और तकनीकी मार्गदर्शन प्रदान करते हैं।"
          : "Corporate CSR partners pledge funding and deploy technical mentors to guide live execution.",
      color: "text-purple",
      bg: "bg-purple-tint/50",
    },
    {
      icon: Bank,
      who: lang === "hi" ? "5. सरकार" : "5. Government",
      t: lang === "hi" ? "सत्यापन व समाधान" : "Verify & Resolve",
      d:
        lang === "hi"
          ? "प्रशासनिक नोडल अधिकारी पूर्ण कार्य का निरीक्षण कर शिकायत का स्थायी निस्तारण करते हैं।"
          : "Nodal government officers inspect the ground outcome, audit public expenditure, and close the case.",
      color: "text-red",
      bg: "bg-red-tint/50",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-start justify-between w-full max-w-5xl gap-4 md:gap-2">
      {journeySteps.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={s.t} className="flex-1 flex flex-row md:flex-col items-center md:items-start text-left relative z-10 group">
            {/* Desktop Connector Line */}
            {i < journeySteps.length - 1 && (
              <div className="hidden md:block absolute top-6 left-12 right-[-2rem] h-[2px] bg-line -z-10 group-hover:bg-green/50 transition-colors" />
            )}
            
            <div className={`w-12 h-12 rounded-full ${s.bg} ${s.color} flex items-center justify-center border border-line mb-4 shrink-0 group-hover:scale-110 group-hover:shadow-lg transition-all`}>
              <Icon size={24} weight="duotone" />
            </div>
            
            <div className="flex-1 pl-4 md:pl-0">
              <span className="block text-[11px] font-bold text-ink-3 uppercase tracking-wider mb-1">{s.who}</span>
              <h4 className="font-display text-[16px] font-bold text-ink mb-1">{s.t}</h4>
              <p className="text-[13px] text-ink-2 leading-relaxed">{s.d}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3. Role Dossier (Interactive 4-Stakeholder Architecture)
════════════════════════════════════════════════════════════════════════════ */
const ROLE_ICONS = {
  citizen: User,
  university: GraduationCap,
  industry: Factory,
  admin: Bank,
};

export function RoleDossier({ lang = "en" }) {
  const [role, setRole] = useState("citizen");

  const roles = [
    {
      id: "citizen",
      icon: "citizen",
      name: lang === "hi" ? "नागरिक (Citizen)" : "Citizen",
      tag: lang === "hi" ? "समस्या दर्ज करें और ट्रैक करें" : "Report & Track Grievances",
      intro:
        lang === "hi"
          ? "अपने क्षेत्र की पानी, सड़क, स्वास्थ्य जैसी समस्याओं को फोटो और लोकेशन के साथ उठाएं। समुदाय के समर्थन (वोट) से प्राथमिकता बढ़ाएं।"
          : "Submit civic grievances in your own words. Track real-time progress from AI triage to university matching and ground resolution.",
      points: [
        lang === "hi" ? "झारखण्ड के सभी 24 जिलों से सरल हिंदी या अंग्रेजी में रिपोर्ट" : "Report in plain English or Hindi across all 24 districts of Jharkhand",
        lang === "hi" ? "जीपीएस ऑटो-डिटेक्ट और कैमरा फोटो साक्ष्य" : "Instant geolocation tagging and image proof upload",
        lang === "hi" ? "पारदर्शी 5-चरणीय ट्रैकिंग और एसएलए अनुपालन" : "Full lifecycle tracking with SLA countdown and assigned officer details",
      ],
      btnText: lang === "hi" ? "नागरिक पोर्टल खोलें" : "Open Citizen Portal",
      color: "text-green",
      bg: "bg-green-tint/50",
      border: "border-green/20",
    },
    {
      id: "university",
      icon: "university",
      name: lang === "hi" ? "विश्वविद्यालय (University)" : "University & R&D",
      tag: lang === "hi" ? "वास्तविक समस्याओं का तकनीकी समाधान" : "Solve Real-World Civic Problems",
      intro:
        lang === "hi"
          ? "आपके विभाग की विशेषज्ञता से मेल खाती समस्याएं सीधे आपके इनबॉक्स में पहुंचती हैं। छात्र व प्राध्यापक टीम बनाकर व्यावहारिक समाधान तैयार करें।"
          : "Receive problem statements automatically matched to your institution's departments. Form student-faculty teams and submit funded project proposals.",
      points: [
        lang === "hi" ? "डोमेन विशेषज्ञता अनुसार स्वतः फ़िल्टर की गई समस्याएं" : "Domain-matched civic queue (Civil, Water, Renewable Energy, Health)",
        lang === "hi" ? "कॉर्पोरेट सीएसआर द्वारा वित्तपोषित अनुसंधान परियोजनाएं" : "Turn live civic challenges into credit-bearing, fully-funded research projects",
        lang === "hi" ? "परियोजना प्रस्ताव एवं बजट निर्माण टूलकिट" : "Integrated proposal builder with team rostering and milestone budgeting",
      ],
      btnText: lang === "hi" ? "विश्वविद्यालय हब में प्रवेश करें" : "Open University Portal",
      color: "text-blue",
      bg: "bg-blue-tint/50",
      border: "border-blue/20",
    },
    {
      id: "industry",
      icon: "industry",
      name: lang === "hi" ? "उद्योग व सीएसआर (Industry / CSR)" : "Industry & CSR Partners",
      tag: lang === "hi" ? "सत्यापित परियोजनाओं में सीएसआर निवेश" : "Fund & Mentor Civic Innovations",
      intro:
        lang === "hi"
          ? "विश्वविद्यालयों द्वारा तैयार किए गए व्यावहारिक समाधानों की समीक्षा करें, शेड्यूल VII के तहत सीएसआर फंड प्रदान करें और सामाजिक प्रभाव मापें।"
          : "Browse high-impact, university-scoped solutions. Allocate CSR budgets under Schedule VII with guaranteed transparency and measurable social ROI.",
      points: [
        lang === "hi" ? "जिले और क्षेत्र अनुसार सीएसआर परियोजनाओं की खोज" : "Filter project proposals by district, SDG target, and funding bracket",
        lang === "hi" ? "डिजिटल एमओयू और सीएसआर अनुपालन प्रमाणपत्र" : "Digital MoU generation with transparent expenditure milestone tracking",
        lang === "hi" ? "सत्यापित प्रभाव मेट्रिक्स (लाभांवित नागरिकों की संख्या)" : "Track verified social metrics (beneficiary reach, infrastructure impact)",
      ],
      btnText: lang === "hi" ? "उद्योग सीएसआर पोर्टल खोलें" : "Open Industry Portal",
      color: "text-purple",
      bg: "bg-purple-tint/50",
      border: "border-purple/20",
    },
    {
      id: "admin",
      icon: "admin",
      name: lang === "hi" ? "प्रशासन (Government Admin)" : "State Command Admin",
      tag: lang === "hi" ? "राज्यव्यापी निगरानी और अनुमोदन" : "Statewide Oversight & Analytics",
      intro:
        lang === "hi"
          ? "सभी 24 जिलों के लिए एकीकृत कमान केंद्र। जिलावार हीटमैप, एसएलए उल्लंघन चेतावनी और अपरिवर्तनीय ऑडिट ट्रेल।"
          : "Real-time command center for state officials. District heatmap, automated SLA escalation, proposal approvals, and immutable audit logs.",
      points: [
        lang === "hi" ? "24 जिलों का इंटरैक्टिव मानचित्र व समस्या घनत्व" : "Interactive SVG map with district-wise grievance severity and sector heat",
        lang === "hi" ? "नोडल अधिकारी आवंटन और एसएलए अनुपालन दर" : "Department routing oversight and automated administrative escalation",
        lang === "hi" ? "सरकारी रिकॉर्ड हेतु संपूर्ण ऑडिट लॉग एवं रिपोर्ट डाउनलोड" : "Immutable timestamped audit log and printable official gazette reports",
      ],
      btnText: lang === "hi" ? "प्रशासनिक कमान केंद्र खोलें" : "Open Admin Command",
      color: "text-red",
      bg: "bg-red-tint/50",
      border: "border-red/20",
    },
  ];

  const active = roles.find((r) => r.id === role);
  const ActiveIcon = ROLE_ICONS[active.icon];

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col gap-2 w-full lg:w-1/3">
        {roles.map((r) => {
          const Ic = ROLE_ICONS[r.icon];
          const isSelected = role === r.id;
          return (
            <button
              key={r.id}
              type="button"
              className={`flex items-center text-left p-4 rounded-xl border-2 transition-all duration-300 ${isSelected ? `bg-surface border-line shadow-md scale-105 z-10 ${r.color}` : "bg-transparent border-transparent hover:bg-surface-2 text-ink-2"}`}
              onClick={() => setRole(r.id)}
            >
              <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mr-4 ${isSelected ? r.bg : "bg-surface text-ink-3"}`}>
                <Ic size={24} weight="duotone" />
              </span>
              <span className="flex-1">
                <strong className={`block text-[15px] font-bold ${isSelected ? "text-ink" : ""}`}>{r.name}</strong>
                <span className="block text-[12px] opacity-80 mt-0.5">{r.tag}</span>
              </span>
              <CaretRight size={18} className={`shrink-0 transition-transform ${isSelected ? "opacity-100 translate-x-1" : "opacity-0"}`} />
            </button>
          );
        })}
      </div>

      <div className="flex-1 w-full bg-surface rounded-3xl p-8 lg:p-12 border border-line shadow-lg relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${active.bg}`} />
        <div className="animate-in fade-in slide-in-from-right-4 duration-500" key={role}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active.bg} ${active.color}`}>
              <ActiveIcon size={32} weight="duotone" />
            </div>
            <div>
              <h3 className="font-display text-[24px] lg:text-[28px] font-bold text-ink leading-tight">{active.name}</h3>
              <span className="text-[14px] font-bold text-ink-3 uppercase tracking-wide">{active.tag}</span>
            </div>
          </div>

          <p className="text-[16px] text-ink-2 leading-relaxed mb-8 border-b border-line pb-8">
            {active.intro}
          </p>

          <div className="flex flex-col gap-4 mb-10">
            {active.points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check size={20} weight="bold" className={`shrink-0 mt-0.5 ${active.color}`} />
                <span className="text-[15px] text-ink font-medium leading-snug">{pt}</span>
              </div>
            ))}
          </div>

          <div>
            <Link href={"/login?role=" + active.id} className={`inline-flex items-center justify-center h-12 px-8 rounded-lg font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 ${active.id === 'citizen' ? 'bg-green' : active.id === 'university' ? 'bg-blue-600' : active.id === 'industry' ? 'bg-purple-600' : 'bg-red-600'}`}>
              {active.btnText} <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4. District Coverage Explorer (24 Districts of Jharkhand)
════════════════════════════════════════════════════════════════════════════ */
const JHARKHAND_DISTRICTS = [
  { name: "Ranchi", hi: "रांची", activeCount: 18, resolved: 42, zone: "South Chotanagpur" },
  { name: "Dhanbad", hi: "धनबाद", activeCount: 14, resolved: 36, zone: "North Chotanagpur" },
  { name: "East Singhbhum", hi: "पूर्वी सिंहभूम", activeCount: 12, resolved: 29, zone: "Kolhan" },
  { name: "Bokaro", hi: "बोकारो", activeCount: 11, resolved: 25, zone: "North Chotanagpur" },
  { name: "Hazaribagh", hi: "हजारीबाग", activeCount: 9, resolved: 21, zone: "North Chotanagpur" },
  { name: "Deoghar", hi: "देवघर", activeCount: 8, resolved: 19, zone: "Santhal Pargana" },
  { name: "Palamu", hi: "पलामू", activeCount: 7, resolved: 18, zone: "Palamu" },
  { name: "Giridih", hi: "गिरिडीह", activeCount: 9, resolved: 22, zone: "North Chotanagpur" },
  { name: "Ramgarh", hi: "रामगढ़", activeCount: 6, resolved: 15, zone: "South Chotanagpur" },
  { name: "Dumka", hi: "दुमका", activeCount: 8, resolved: 17, zone: "Santhal Pargana" },
  { name: "West Singhbhum", hi: "पश्चिमी सिंहभूम", activeCount: 6, resolved: 14, zone: "Kolhan" },
  { name: "Gumla", hi: "गुमला", activeCount: 7, resolved: 16, zone: "South Chotanagpur" },
];

export function DistrictCoverageExplorer({ lang = "en" }) {
  const [selectedZone, setSelectedZone] = useState("all");

  const filtered = selectedZone === "all"
    ? JHARKHAND_DISTRICTS
    : JHARKHAND_DISTRICTS.filter((d) => d.zone === selectedZone);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <span className="text-[12px] font-bold tracking-widest text-ink-3 uppercase mb-4 block">STATEWIDE REACH</span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-ink mb-4">
            {lang === "hi" ? "झारखण्ड के 24 जिलों में सक्रिय विस्तार" : "Active Reach Across 24 Districts"}
          </h2>
          <p className="text-[18px] text-ink-2 leading-relaxed">
            {lang === "hi"
              ? "शहरी नगर निगमों से लेकर दूरदराज के ग्रामीण क्षेत्रों तक, हर नागरिक की आवाज सीधे समाधानकर्ताओं तक पहुंच रही है।"
              : "Bridging civic grievances from municipal corporations to remote rural panchayats."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "North Chotanagpur", "South Chotanagpur", "Kolhan", "Santhal Pargana", "Palamu"].map((z) => (
            <button
              key={z}
              type="button"
              className={`px-4 py-2 rounded-full text-[13px] font-bold transition-colors border ${selectedZone === z ? "bg-green text-white border-green" : "bg-surface border-line text-ink-2 hover:bg-surface-2"}`}
              onClick={() => setSelectedZone(z)}
            >
              {z === "all" ? (lang === "hi" ? "सभी प्रमंडल" : "All Divisions") : z}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {filtered.map((d) => (
          <div key={d.name} className="bg-surface rounded-xl p-5 border border-line shadow-sm hover:border-green hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={16} weight="fill" className="text-amber" />
                <strong className="text-[16px] font-bold text-ink">{lang === "hi" ? d.hi : d.name}</strong>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-2 text-ink-3">
                {d.zone.split(' ')[0]}
              </span>
            </div>

            <div className="flex items-center gap-4 border-t border-line pt-4">
              <div className="flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-0.5">{lang === "hi" ? "सक्रिय" : "Active"}</span>
                <span className="font-display text-[20px] font-bold text-amber">{d.activeCount}</span>
              </div>
              <div className="flex-1 pl-4 border-l border-line">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-0.5">{lang === "hi" ? "समाधित" : "Resolved"}</span>
                <span className="font-display text-[20px] font-bold text-green">{d.resolved}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-6">
        <span className="text-[13px] text-ink-3">
          📍 {lang === "hi" ? "शेष 12 जिलों के नोडल विश्वविद्यालयों की मैपिंग प्रगति पर है।" : "Remaining 12 districts currently connected via Regional Lead Institutions."}
        </span>
        <Link href="/login" className="text-[14px] font-bold text-green hover:text-green/80 transition-colors flex items-center gap-1">
          {lang === "hi" ? "प्रशासनिक जिला मानचित्र देखें" : "View Full State Map"} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
