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
import { getCatLabel, getTranslation } from "@/lib/i18n";

const CAT_COLOR = {
  education: "bg-blue-500",
  health: "bg-red-500",
  agriculture: "bg-lime-600",
  water: "bg-blue-400",
  infrastructure: "bg-amber-600",
  environment: "bg-green-600",
  other: "bg-stone-500",
};

/* ════════════════════════════════════════════════════════════════════════════
   1. Live Bridge Panel (Real-Time Feed with Fallback Civic Stream)
════════════════════════════════════════════════════════════════════════════ */
export function BridgePanel({ lang = "en" }) {
  const [items, setItems] = useState(null);
  const t = getTranslation(lang);

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
            {t.liveStreamTitle}
          </h3>
          <span className="text-[12px] text-ink-3">
            {t.liveStreamSub}
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
                <span className="font-medium text-ink-2 inline-flex items-center gap-1">
                  <MapPin size={12} weight="fill" className="text-green shrink-0" />
                  {p.district || "Jharkhand"}
                </span>
                <span>•</span>
                <span>{getCatLabel(lang, p.category)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2 border-l border-line">
              <b className="text-[15px] text-green font-display">{p.votes ?? 0}</b>
              <span className="text-[10px] text-ink-3 uppercase font-bold tracking-wider">{t.votes}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-2 border-t border-line p-3 px-4 flex items-center justify-between">
        <span className="text-[11px] text-ink-3 font-medium">
          {t.triagedByAI}
        </span>
        <Link href="/login" className="text-[12px] font-bold text-green hover:text-green/80 transition-colors flex items-center gap-1">
          {t.viewAllReports} <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2. Grievance Lifecycle Journey Pipeline (UX4G Compliant Stepper)
════════════════════════════════════════════════════════════════════════════ */
const JOURNEY_DATA = {
  en: [
    { who: "1. Citizen", t: "Report", d: "Plain language description with geotagged photo and automated GPS pin from any district." },
    { who: "2. AI Engine", t: "Classify & Triage", d: "Groq Llama 3.3 classifies into 7 civic sectors, checks duplicate reports, and assigns SLA priority." },
    { who: "3. University", t: "Solve & Propose", d: "Matched department faculty and student teams formulate a structured, costed engineering solution." },
    { who: "4. Industry CSR", t: "Fund & Mentor", d: "Corporate CSR partners pledge funding and deploy technical mentors to guide live execution." },
    { who: "5. Government", t: "Verify & Resolve", d: "Nodal government officers inspect the ground outcome, audit public expenditure, and close the case." },
  ],
  hi: [
    { who: "1. नागरिक", t: "शिकायत दर्ज", d: "सरल भाषा में समस्या लिखें। फोटो और जीपीएस स्थान स्वतः संलग्न होता है।" },
    { who: "2. एआई इंजन", t: "वर्गीकरण व स्कोरिंग", d: "Groq AI 7 नागरिक श्रेणियों में वर्गीकरण, डुप्लिकेशन जांच और तात्कालिकता स्कोर देता है।" },
    { who: "3. विश्वविद्यालय", t: "अनुसंधान व समाधान", d: "संबंधित इंजीनियरिंग/कृषि विभाग को समस्या भेजी जाती है। संकाय व छात्र समाधान प्रस्ताव बनाते हैं।" },
    { who: "4. उद्योग सीएसआर", t: "फंडिंग व मेंटरशिप", d: "कॉर्पोरेट साझेदार प्रस्तावों की समीक्षा कर सीएसआर फंड और तकनीकी मार्गदर्शन प्रदान करते हैं।" },
    { who: "5. सरकार", t: "सत्यापन व समाधान", d: "प्रशासनिक नोडल अधिकारी पूर्ण कार्य का निरीक्षण कर शिकायत का स्थायी निस्तारण करते हैं।" },
  ],
  bn: [
    { who: "১. নাগরিক", t: "অভিযোগ দায়ের", d: "সহজ ভাষায় সমস্যা লিখুন। ছবি এবং স্বয়ংক্রিয় জিপিএস লোকেশন সরাসরি যুক্ত হয়।" },
    { who: "২. এআই ইঞ্জিন", t: "শ্রেণিবিভাগ ও স্কোরিং", d: "Groq AI সাতটি বিভাগে শ্রেণিবিভাগ, পুনরাবৃত্তি যাচাই এবং অগ্রাধিকার নির্ধারণ করে।" },
    { who: "৩. বিশ্ববিদ্যালয়", t: "গবেষণা ও সমাধান", d: "সম্পর্কিত ইঞ্জিনিয়ারিং বিভাগকে বরাদ্দ করা হয়। গবেষক ও ছাত্ররা বাস্তব সমাধান প্রস্তুত করেন।" },
    { who: "৪. শিল্প সিএসআর", t: "অর্থায়ন ও মেন্টরশিপ", d: "শিল্প অংশীদাররা প্রস্তাব পর্যালোচনা করে সিএসআর তহবিল ও প্রযুক্তিগত দিকনির্দেশনা প্রদান করেন।" },
    { who: "৫. প্রশাসন", t: "যাচাই ও সমাধান", d: "সরকারি নোডাল অফিসার সরেজমিনে কাজ পরিদর্শন করে সমস্যা স্থায়ীভাবে সমাধান করেন।" },
  ],
  sat: [
    { who: "᱑. ᱱᱟᱜᱟᱨᱤᱭᱟᱹ", t: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ", d: "ᱟᱞᱜᱟ ᱛᱮ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ᱾ ᱪᱤᱛᱟᱹᱨ ᱟᱨ GPS ᱞᱳᱠᱮᱥᱚᱱ ᱱᱤᱡᱮ ᱛᱮ ᱡᱚᱲᱟᱣᱜᱼᱟ᱾" },
    { who: "᱒. AI ᱤᱱᱡᱤᱱ", t: "ᱛᱷᱚᱠ ᱵᱟᱪᱷᱟᱣ", d: "Groq AI ᱗ ᱜᱚᱴᱟᱝ ᱛᱷᱚᱠ ᱨᱮ ᱦᱟᱹᱴᱤᱧ ᱟᱨ ᱞᱟᱹᱠᱛᱤ ᱥᱠᱳᱨ ᱮ ᱮᱢᱟ᱾" },
    { who: "᱓. ᱡᱮᱜᱮᱛ ᱵᱤᱨᱫᱟᱹᱜᱟᱲ", t: "ᱥᱚᱞᱦᱮ ᱵᱮᱱᱟᱣ", d: "ᱤᱱᱡᱤᱱᱤᱭᱟᱨᱤᱝ ᱵᱤᱵᱷᱟᱜᱽ ᱥᱚᱞᱦᱮ ᱞᱟᱹᱜᱤᱫ ᱯᱨᱚᱯᱚᱡᱟᱞ ᱮ ᱵᱮᱱᱟᱣᱟ᱾" },
    { who: "᱔. ᱤᱱᱰᱟᱥᱴᱨᱤ CSR", t: "ᱯᱷᱟᱱᱰ ᱟᱨ ᱜᱚᱲᱚ", d: "ᱠᱚᱢᱯᱟᱱᱤ ᱠᱚ CSR ᱯᱷᱟᱱᱰ ᱟᱨ ᱴᱮᱠᱱᱤᱠᱟᱞ ᱜᱚᱲᱚ ᱠᱚ ᱮᱢᱟ᱾" },
    { who: "᱕. ᱥᱚᱨᱠᱟᱨ", t: "ᱥᱟᱹᱨᱤ ᱯᱚᱨᱢᱟᱬ", d: "ᱥᱚᱨᱠᱟᱨᱤ ᱚᱯᱷᱤᱥᱟᱨ ᱠᱟᱹᱢᱤ ᱧᱮᱞ ᱠᱟᱛᱮ ᱥᱚᱞᱦᱮ ᱯᱩᱨᱟᱹᱣ ᱢᱟ᱾" },
  ],
  ur: [
    { who: "1. شہری", t: "شکایت کا اندراج", d: "آسان زبان میں مسئلہ بیان کریں۔ تصویر اور خودکار GPS لوکیشن فوری شامل ہو جاتی ہے۔" },
    { who: "2. AI انجن", t: "درجہ بندی اور ترجیح", d: "Groq AI 7 شعبوں میں تقسیم، نقل کی جانچ اور ترجیحی اسکور کا تعین کرتا ہے۔" },
    { who: "3. یونیورسٹی", t: "تحقیق اور حل", d: "متعلقہ انجینئرنگ شعبہ تفصیلی اور لاگت کا تخمینہ حل تیار کرتا ہے۔" },
    { who: "4. انڈسٹری CSR", t: "فنڈنگ اور رہنمائی", d: "کارپوریٹ پارٹنرز فنڈنگ کی ضمانت دیتے ہیں اور رہنمائی فراہم کرتے ہیں۔" },
    { who: "5. حکومت", t: "تصدیق اور حل", d: "سرکاری افسران زمینی معائنہ کرتے ہیں اور مسئلہ حل کر کے بند کرتے ہیں۔" },
  ],
};

const STEP_ICONS = [User, Brain, GraduationCap, HandCoins, Bank];
const STEP_COLORS = [
  { color: "text-green", bg: "bg-green-tint/50" },
  { color: "text-amber", bg: "bg-amber-tint/50" },
  { color: "text-blue", bg: "bg-blue-tint/50" },
  { color: "text-purple", bg: "bg-purple-tint/50" },
  { color: "text-red", bg: "bg-red-tint/50" },
];

export function JourneyRail({ lang = "en" }) {
  const steps = JOURNEY_DATA[lang] || JOURNEY_DATA.en;
  const journeySteps = steps.map((s, idx) => ({
    ...s,
    icon: STEP_ICONS[idx],
    ...STEP_COLORS[idx],
  }));

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

const ROLE_DATA = {
  en: {
    citizen: {
      name: "Citizen",
      tag: "Report & Track Grievances",
      intro: "Submit civic grievances in your own words. Track real-time progress from AI triage to university matching and ground resolution.",
      points: [
        "Report in plain English or regional languages across all 24 districts",
        "Instant geolocation tagging and image proof upload",
        "Full lifecycle tracking with SLA countdown and assigned officer details",
      ],
      btnText: "Open Citizen Portal",
    },
    university: {
      name: "University & R&D",
      tag: "Solve Real-World Civic Problems",
      intro: "Receive problem statements automatically matched to your institution's departments. Form student-faculty teams and submit funded project proposals.",
      points: [
        "Domain-matched civic queue (Civil, Water, Renewable Energy, Health)",
        "Turn live civic challenges into credit-bearing, fully-funded research projects",
        "Integrated proposal builder with team rostering and milestone budgeting",
      ],
      btnText: "Open University Portal",
    },
    industry: {
      name: "Industry & CSR Partners",
      tag: "Fund & Mentor Civic Innovations",
      intro: "Browse high-impact, university-scoped solutions. Allocate CSR budgets under Schedule VII with guaranteed transparency and measurable social ROI.",
      points: [
        "Filter project proposals by district, SDG target, and funding bracket",
        "Digital MoU generation with transparent expenditure milestone tracking",
        "Track verified social metrics (beneficiary reach, infrastructure impact)",
      ],
      btnText: "Open Industry Portal",
    },
    admin: {
      name: "State Command Admin",
      tag: "Statewide Oversight & Analytics",
      intro: "Real-time command center for state officials. District heatmap, automated SLA escalation, proposal approvals, and immutable audit logs.",
      points: [
        "Interactive SVG map with district-wise grievance severity and sector heat",
        "Department routing oversight and automated administrative escalation",
        "Immutable timestamped audit log and printable official gazette reports",
      ],
      btnText: "Open Admin Command",
    },
  },
  hi: {
    citizen: {
      name: "नागरिक (Citizen)",
      tag: "समस्या दर्ज करें और ट्रैक करें",
      intro: "अपने क्षेत्र की पानी, सड़क, स्वास्थ्य जैसी समस्याओं को फोटो और लोकेशन के साथ उठाएं। समुदाय के समर्थन से प्राथमिकता बढ़ाएं।",
      points: [
        "झारखण्ड के सभी 24 जिलों से सरल हिंदी या क्षेत्रीय भाषा में रिपोर्ट",
        "जीपीएस ऑटो-डिटेक्ट और कैमरा फोटो साक्ष्य",
        "पारदर्शी 5-चरणीय ट्रैकिंग और एसएलए अनुपालन",
      ],
      btnText: "नागरिक पोर्टल खोलें",
    },
    university: {
      name: "विश्वविद्यालय (University)",
      tag: "वास्तविक समस्याओं का तकनीकी समाधान",
      intro: "आपके विभाग की विशेषज्ञता से मेल खाती समस्याएं सीधे आपके इनबॉक्स में पहुंचती हैं। छात्र व प्राध्यापक टीम बनाकर व्यावहारिक समाधान तैयार करें।",
      points: [
        "डोमेन विशेषज्ञता अनुसार स्वतः फ़िल्टर की गई समस्याएं",
        "कॉर्पोरेट सीएसआर द्वारा वित्तपोषित अनुसंधान परियोजनाएं",
        "परियोजना प्रस्ताव एवं बजट निर्माण टूलकिट",
      ],
      btnText: "विश्वविद्यालय हब में प्रवेश करें",
    },
    industry: {
      name: "उद्योग व सीएसआर (Industry / CSR)",
      tag: "सत्यापित परियोजनाओं में सीएसआर निवेश",
      intro: "विश्वविद्यालयों द्वारा तैयार किए गए व्यावहारिक समाधानों की समीक्षा करें, शेड्यूल VII के तहत सीएसआर फंड प्रदान करें और सामाजिक प्रभाव मापें।",
      points: [
        "जिले और क्षेत्र अनुसार सीएसआर परियोजनाओं की खोज",
        "डिजिटल एमओयू और सीएसआर अनुपालन प्रमाणपत्र",
        "सत्यापित प्रभाव मेट्रिक्स (लाभांवित नागरिकों की संख्या)",
      ],
      btnText: "उद्योग सीएसआर पोर्टल खोलें",
    },
    admin: {
      name: "प्रशासन (Government Admin)",
      tag: "राज्यव्यापी निगरानी और अनुमोदन",
      intro: "सभी 24 जिलों के लिए एकीकृत कमान केंद्र। जिलावार हीटमैप, एसएलए उल्लंघन चेतावनी और अपरिवर्तनीय ऑडिट ट्रेल।",
      points: [
        "24 जिलों का इंटरैक्टिव मानचित्र व समस्या घनत्व",
        "नोडल अधिकारी आवंटन और एसएलए अनुपालन दर",
        "सरकारी रिकॉर्ड हेतु संपूर्ण ऑडिट लॉग एवं रिपोर्ट डाउनलोड",
      ],
      btnText: "प्रशासनिक कमान केंद्र खोलें",
    },
  },
  bn: {
    citizen: {
      name: "নাগরিক (Citizen)",
      tag: "অভিযোগ জানান ও ট্র্যাক করুন",
      intro: "আপনার এলাকার পানি, রাস্তা, স্বাস্থ্য ইত্যাদির সমস্যা ছবি এবং লোকেশন সহ দায়ের করুন। স্বচ্ছ উপায়ে অগ্রগতি ট্র্যাক করুন।",
      points: [
        "ঝাড়খণ্ডের ২৪টি জেলা থেকে সহজ ভাষায় অভিযোগ দায়ের",
        "স্বয়ংক্রিয় জিপিএস লোকেশন ও ছবির প্রমাণ আপলোড",
        "৫-ধাপের স্বচ্ছ লাইফসাইকেল ট্র্যাকিং ও এসএলএ তথ্য",
      ],
      btnText: "নাগরিক পোর্টাল খুলুন",
    },
    university: {
      name: "বিশ্ববিদ্যালয় (University)",
      tag: "বাস্তব সমস্যার প্রযুক্তিগত সমাধান",
      intro: "আপনার বিভাগের সাথে সম্পর্কিত সমস্যা সরাসরি ইনবক্সে আসবে। শিক্ষক ও ছাত্রদের দল গঠন করে উদ্ভাবনী প্রকল্প প্রস্তাব জমা দিন।",
      points: [
        "বিষয়ভিত্তিক পৌর সমস্যা তালিকা (সিভিল, জল, স্বাস্থ্য)",
        "বাস্তব চ্যালেঞ্জকে অর্থায়িত গবেষণা প্রকল্পে রূপান্তর",
        "সমন্বিত প্রস্তাবনা ও বাজেট তৈরির বিশেষ টুলকিট",
      ],
      btnText: "বিশ্ববিদ্যালয় পোর্টালে যান",
    },
    industry: {
      name: "শিল্প সিএসআর (Industry)",
      tag: "প্রকল্পে সিএসআর অনুদান প্রদান",
      intro: "বিশ্ববিদ্যালয় কর্তৃক প্রণীত সমাধান পর্যালোচনা করুন এবং তফসিল ৭-এর অধীনে স্বচ্ছ সিএসআর অর্থায়ন নিশ্চিত করুন।",
      points: [
        "জেলা ও ক্ষেত্রভিত্তিক সিএসআর প্রকল্প অনুসন্ধান",
        "ডিজিটাল সমঝোতা স্মারক ও সিএসআর অডিট সনদ",
        "যাচাইকৃত সামাজিক প্রভাব ও উপকারভোগীর সংখ্যা ট্র্যাকিং",
      ],
      btnText: "শিল্প সিএসআর পোর্টাল খুলুন",
    },
    admin: {
      name: "প্রশাসন (Admin)",
      tag: "সরাসরি পর্যবেক্ষণ ও রূপায়ণ",
      intro: "রাজ্যের সকল ২৪টি জেলার জন্য একীভূত কমান্ড সেন্টার। জেলাওয়ারি হিটম্যাপ এবং এসএলএ প্রতিপালন নজরদারি।",
      points: [
        "২৪টি জেলার ইন্টারঅ্যাক্টিভ মানচিত্র ও সমস্যা ঘনত্ব",
        "নোডাল অফিসার নিয়োগ এবং প্রশাসনিক সমাধান ট্র্যাকিং",
        "অপরিবর্তনীয় টাইমস্ট্যাম্পড অডিট ট্রেইল ও রিপোর্ট ডাউনলোড",
      ],
      btnText: "প্রশাসনিক কমান্ড সেন্টার খুলুন",
    },
  },
  sat: {
    citizen: {
      name: "ᱱᱟᱜᱟᱨᱤᱭᱟᱹ (Citizen)",
      tag: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱟᱨ ᱧᱮᱞ ᱢᱮ",
      intro: "ᱟᱯᱱᱟᱨᱟᱜ ᱟᱹᱛᱩ-ᱴᱚᱞᱟ ᱨᱮᱱᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱞᱳᱠᱮᱥᱚᱱ ᱥᱟᱶ ᱚᱞ ᱢᱮ᱾ ᱥᱚᱞᱦᱮ ᱦᱟᱞᱚᱛ ᱧᱮᱞ ᱢᱮ᱾",
      points: [
        "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱒᱔ ᱦᱚᱱᱚᱛ ᱠᱷᱚᱱ ᱟᱞᱜᱟ ᱛᱮ ᱠᱷᱚᱵᱚᱨ ᱮᱢ",
        "GPS ᱞᱳᱠᱮᱥᱚᱱ ᱟᱨ ᱠᱮᱢᱮᱨᱟ ᱪᱤᱛᱟᱹᱨ ᱯᱚᱨᱢᱟᱬ",
        "᱕ ᱫᱷᱟᱯ ᱨᱮᱱᱟᱜ ᱥᱟᱯᱷᱟ ᱴᱟᱭᱤᱢᱞᱟᱭᱤᱱ ᱟᱨ ᱚᱯᱷᱤᱥᱟᱨ ᱠᱟᱛᱷᱟ",
      ],
      btnText: "ᱱᱟᱜᱟᱨᱤᱭᱟᱹ ᱯᱳᱨᱴᱟᱞ ᱡᱷᱤᱡ ᱢᱮ",
    },
    university: {
      name: "ᱡᱮᱜᱮᱛ ᱵᱤᱨᱫᱟᱹᱜᱟᱲ (University)",
      tag: "ᱴᱮᱠᱱᱤᱠᱟᱞ ᱥᱚᱞᱦᱮ ᱵᱮᱱᱟᱣ",
      intro: "ᱵᱤᱵᱷᱟᱜᱽ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱢᱤ ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱧᱟᱢ ᱢᱮ᱾ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱟᱨ ᱢᱟᱪᱮᱛ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱥᱚᱞᱦᱮ ᱵᱮᱱᱟᱣ ᱢᱟ᱾",
      points: [
        "ᱵᱤᱵᱷᱟᱜᱽ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱪᱷᱟᱣ ᱟᱠᱟᱱ ᱮᱴᱠᱮᱴᱚᱬᱮ",
        "ᱠᱚᱢᱯᱟᱱᱤ CSR ᱯᱷᱟᱱᱰ ᱛᱮ ᱨᱤᱥᱟᱨᱪ ᱯᱨᱚᱡᱮᱠᱴ",
        "ᱯᱨᱚᱯᱚᱡᱟᱞ ᱟᱨ ᱵᱟᱡᱮᱴ ᱵᱮᱱᱟᱣ ᱴᱩᱞ",
      ],
      btnText: "ᱡᱮᱜᱮᱛ ᱵᱤᱨᱫᱟᱹᱜᱟᱲ ᱦᱟᱵᱽ ᱵᱚᱞᱚᱱ ᱢᱮ",
    },
    industry: {
      name: "ᱤᱱᱰᱟᱥᱴᱨᱤ CSR (Industry)",
      tag: "ᱥᱚᱞᱦᱮ ᱞᱟᱹᱜᱤᱫ CSR ᱯᱷᱟᱱᱰ",
      intro: "ᱡᱮᱜᱮᱛ ᱵᱤᱨᱫᱟᱹᱜᱟᱲ ᱨᱮᱱᱟᱜ ᱥᱚᱞᱦᱮ ᱧᱮᱞ ᱠᱟᱛᱮ CSR ᱴᱟᱠᱟ ᱟᱨ ᱢᱮᱱᱴᱚᱨ ᱜᱚᱲᱚ ᱮᱢ ᱢᱮ᱾",
      points: [
        "ᱦᱚᱱᱚᱛ ᱟᱨ ᱠᱟᱹᱢᱤ ᱞᱮᱠᱟᱛᱮ ᱯᱨᱚᱡᱮᱠᱴ ᱵᱟᱪᱷᱟᱣ",
        "ᱰᱤᱡᱤᱴᱟᱞ MoU ᱟᱨ CSR ᱯᱚᱨᱢᱟᱬ ᱥᱟᱠᱟᱢ",
        "ᱥᱟᱹᱨᱤ ᱩᱛᱱᱟᱹᱣ ᱨᱮᱠᱳᱨᱰ ᱧᱮᱞ",
      ],
      btnText: "ᱤᱱᱰᱟᱥᱴᱨᱤ CSR ᱯᱳᱨᱴᱟᱞ ᱡᱷᱤᱡ ᱢᱮ",
    },
    admin: {
      name: "ᱥᱚᱨᱠᱟᱨ ᱟᱨ ᱯᱨᱚᱥᱟᱥᱚᱱ (Admin)",
      tag: "ᱧᱮᱞ ᱥᱟᱢᱴᱟᱣ ᱟᱨ ᱥᱟᱹᱨᱤ ᱯᱚᱨᱢᱟᱬ",
      intro: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱒᱔ ᱦᱚᱱᱚᱛ ᱞᱟᱹᱜᱤᱫ ᱢᱩᱬᱩᱛ ᱠᱚᱢᱟᱱᱰ ᱥᱮᱱᱴᱟᱨ᱾ ᱦᱤᱴᱢᱮᱯ ᱟᱨ SLA ᱧᱮᱞ ᱢᱮ᱾",
      points: [
        "᱒᱔ ᱦᱚᱱᱚᱛ ᱨᱮᱱᱟᱜ ᱢᱮᱯ ᱟᱨ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱰᱮᱱᱥᱤᱴᱤ",
        "ᱱᱳᱰᱟᱞ ᱚᱯᱷᱤᱥᱟᱨ ᱟᱨ SLA ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ",
        "ᱥᱚᱨᱠᱟᱨᱤ ᱚᱰᱤᱴ ᱞᱚᱜᱽ ᱟᱨ ᱨᱤᱯᱳᱨᱴ ᱰᱟᱩᱱᱞᱳᱰ",
      ],
      btnText: "ᱮᱰᱢᱤᱱ ᱠᱚᱢᱟᱱᱰ ᱡᱷᱤᱡ ᱢᱮ",
    },
  },
  ur: {
    citizen: {
      name: "شہری (Citizen)",
      tag: "شکایات درج اور ٹریک کریں",
      intro: "اپنے علاقے کے مسائل تصویر اور لوکیشن کے ساتھ درج کریں۔ عوامی حمایت سے ترجیح میں اضافہ کریں۔",
      points: [
        "تمام 24 اضلاع سے آسان زبان میں شکایت کا اندراج",
        "خودکار GPS لوکیشن اور تصویری ثبوت",
        "5 مراحل پر مشتمل شفاف ٹریکنگ اور SLA تفصیلات",
      ],
      btnText: "شہری پورٹل کھولیں",
    },
    university: {
      name: "یونیورسٹی (University)",
      tag: "شہری مسائل کے تکنیکی حل",
      intro: "اپنے شعبے سے متعلق مسائل موصول کریں۔ اساتذہ اور طلباء مل کر فنڈڈ حل کا منصوبہ تیار کریں۔",
      points: [
        "شعبہ جاتی بنیاد پر فلٹر شدہ مسائل",
        "کارپوریٹ CSR کے تحت فنڈڈ ریسرچ پروجیکٹس",
        "پروجیکٹ پروپوزل اور بجٹ ٹول کٹ",
      ],
      btnText: "یونیورسٹی حب میں داخل ہوں",
    },
    industry: {
      name: "انڈسٹری CSR (Industry)",
      tag: "منصوبوں میں CSR سرمایہ کاری",
      intro: "یونیورسٹی کے تیار کردہ حل کا جائزہ لیں، شیڈول VII کے تحت فنڈز اور رہنمائی فراہم کریں۔",
      points: [
        "اضلاع اور شعبہ جات کے لحاظ سے منصوبوں کی تلاش",
        "ڈیجیٹل MoU اور CSR آڈٹ سرٹیفکیٹ",
        "عوامی فائدہ اور بنیادی ڈھانچے کے اثرات کی ٹریکنگ",
      ],
      btnText: "انڈسٹری پورٹل کھولیں",
    },
    admin: {
      name: "حکومت اور انتظامیہ (Admin)",
      tag: "نگرانی اور ریاستی تجزیات",
      intro: "تمام 24 اضلاع کے لیے مرکزی کمانڈ سینٹر۔ ضلعی نقشہ، خودکار SLA الرٹس اور آڈٹ ٹریل۔",
      points: [
        "24 اضلاع کا انٹرایکٹو نقشہ اور کثافت",
        "نوڈل افسران کی تعیناتی اور SLA رپورٹ",
        "مکمل سرکاری آڈٹ لاگ اور رپورٹ ڈاؤن لوڈ",
      ],
      btnText: "ایڈمن کمانڈ پورٹل کھولیں",
    },
  },
};

export function RoleDossier({ lang = "en" }) {
  const [role, setRole] = useState("citizen");
  const dict = ROLE_DATA[lang] || ROLE_DATA.en;

  const roles = [
    {
      id: "citizen",
      icon: "citizen",
      color: "text-green",
      bg: "bg-green-tint/50",
      border: "border-green/20",
      ...dict.citizen,
    },
    {
      id: "university",
      icon: "university",
      color: "text-blue",
      bg: "bg-blue-tint/50",
      border: "border-blue/20",
      ...dict.university,
    },
    {
      id: "industry",
      icon: "industry",
      color: "text-purple",
      bg: "bg-purple-tint/50",
      border: "border-purple/20",
      ...dict.industry,
    },
    {
      id: "admin",
      icon: "admin",
      color: "text-red",
      bg: "bg-red-tint/50",
      border: "border-red/20",
      ...dict.admin,
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

const ZONE_LABELS = {
  all: { en: "All Divisions", hi: "सभी प्रमंडल", bn: "সকল বিভাগ", sat: "ᱡᱚᱛᱚ ᱛᱷᱚᱠ", ur: "تمام ڈویژنز" },
  "North Chotanagpur": { en: "North Chotanagpur", hi: "उत्तरी छोटानागपुर", bn: "উত্তর ছোটনাগপুর", sat: "ᱠᱚᱸᱭᱮ ᱪᱷᱳᱴᱟᱱᱟᱜᱽᱯᱩᱨ", ur: "شمالی چھوٹا ناگپور" },
  "South Chotanagpur": { en: "South Chotanagpur", hi: "दक्षिणी छोटानागपुर", bn: "দক্ষিণ ছোটনাগপুর", sat: "ᱮᱛᱚᱢ ᱪᱷᱳᱴᱟᱱᱟᱜᱽᱯᱩᱨ", ur: "جنوبی چھوٹا ناگپور" },
  Kolhan: { en: "Kolhan", hi: "कोल्हान", bn: "কোলহান", sat: "ᱠᱳᱞᱦᱟᱱ", ur: "کولہان" },
  "Santhal Pargana": { en: "Santhal Pargana", hi: "संथाल परगना", bn: "সাঁওতাল পরগনা", sat: "ᱥᱟᱱᱛᱟᱲ ᱯᱟᱨᱜᱟᱱᱟ", ur: "سنتھال پرگنہ" },
  Palamu: { en: "Palamu", hi: "पलामू", bn: "পলামু", sat: "ᱯᱟᱞᱟᱢᱩ", ur: "پلامو" },
};

export function DistrictCoverageExplorer({ lang = "en" }) {
  const [selectedZone, setSelectedZone] = useState("all");

  const filtered = selectedZone === "all"
    ? JHARKHAND_DISTRICTS
    : JHARKHAND_DISTRICTS.filter((d) => d.zone === selectedZone);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 mb-10">
        <div className="max-w-2xl">
          <span className="text-[12px] font-bold tracking-widest text-ink-3 uppercase mb-4 block">STATEWIDE REACH</span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-ink mb-4">
            {lang === "hi"
              ? "झारखण्ड के 24 जिलों में सक्रिय विस्तार"
              : lang === "bn"
              ? "ঝাড়খণ্ডের ২৪টি জেলায় সক্রিয় বিস্তার"
              : lang === "sat"
              ? "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱒᱔ ᱦᱚᱱᱚᱛ ᱨᱮ ᱠᱟᱹᱢᱤ"
              : lang === "ur"
              ? "جھارکھنڈ کے 24 اضلاع میں فعال رسائی"
              : "Active Reach Across 24 Districts"}
          </h2>
          <p className="text-[18px] text-ink-2 leading-relaxed">
            {lang === "hi"
              ? "शहरी नगर निगमों से लेकर दूरदराज के ग्रामीण क्षेत्रों तक, हर नागरिक की आवाज सीधे समाधानकर्ताओं तक पहुंच रही है।"
              : lang === "bn"
              ? "পৌর নিগম থেকে শুরু করে প্রত্যন্ত গ্রামীণ পঞ্চায়েত পর্যন্ত প্রতিটি নাগরিকের সমস্যার সমাধান।"
              : lang === "sat"
              ? "ᱥᱟᱦᱟᱨ ᱠᱷᱚᱱ ᱟᱹᱛᱩ ᱴᱚᱞᱟ ᱫᱷᱟᱹᱵᱤᱡ, ᱡᱚᱛᱚ ᱱᱟᱜᱟᱨᱤᱭᱟᱹ ᱟᱜ ᱠᱟᱛᱷᱟ ᱥᱚᱞᱦᱮ ᱴᱷᱮᱱ ᱥᱮᱴᱮᱨᱚᱜ ᱠᱟᱱᱟ᱾"
              : lang === "ur"
              ? "میونسپل کارپوریشنز سے لے کر دور دراز دیہی پنچایتوں تک، ہر شہری کے مسائل کا ازالہ۔"
              : "Bridging civic grievances from municipal corporations to remote rural panchayats."}
          </p>
        </div>

        {/* Full-width Division Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface border border-line rounded-2xl w-fit shadow-xs">
          {["all", "North Chotanagpur", "South Chotanagpur", "Kolhan", "Santhal Pargana", "Palamu"].map((z) => {
            const zLabel = ZONE_LABELS[z]?.[lang] || ZONE_LABELS[z]?.en || z;
            const isSelected = selectedZone === z;
            return (
              <button
                key={z}
                type="button"
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
                  isSelected 
                    ? "bg-green text-white shadow-sm" 
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
                onClick={() => setSelectedZone(z)}
              >
                {zLabel}
              </button>
            );
          })}
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
                <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-0.5">
                  {lang === "hi" ? "सक्रिय" : lang === "bn" ? "সক্রিয়" : lang === "sat" ? "ᱪᱟᱞᱟᱜ ᱠᱟᱱ" : lang === "ur" ? "فعال" : "Active"}
                </span>
                <span className="font-display text-[20px] font-bold text-amber">{d.activeCount}</span>
              </div>
              <div className="flex-1 pl-4 border-l border-line">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-0.5">
                  {lang === "hi" ? "समाधित" : lang === "bn" ? "সমাধানকৃত" : lang === "sat" ? "ᱥᱚᱞᱦᱮ ᱦᱩᱭᱮᱱ" : lang === "ur" ? "حل شدہ" : "Resolved"}
                </span>
                <span className="font-display text-[20px] font-bold text-green">{d.resolved}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-6">
        <span className="text-[13px] text-ink-3 flex items-center gap-1.5">
          <MapPin size={14} weight="fill" className="text-amber shrink-0" />
          {lang === "hi"
            ? "शेष 12 जिलों के नोडल विश्वविद्यालयों की मैपिंग प्रगति पर है।"
            : lang === "bn"
            ? "বাকি ১২টি জেলার সমন্বয় কাজ চলছে।"
            : lang === "sat"
            ? "ᱵᱟᱹᱲᱛᱤ ᱑᱒ ᱦᱚᱱᱚᱛ ᱨᱮᱱᱟᱜ ᱡᱚᱲᱟᱣ ᱠᱟᱹᱢᱤ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ᱾"
            : lang === "ur"
            ? "باقی 12 اضلاع کی میپنگ کا کام جاری ہے۔"
            : "Remaining 12 districts currently connected via Regional Lead Institutions."}
        </span>
        <Link href="/login" className="text-[14px] font-bold text-green hover:text-green/80 transition-colors flex items-center gap-1">
          {lang === "hi"
            ? "प्रशासनिक जिला मानचित्र देखें"
            : lang === "bn"
            ? "প্রশাসনিক জেলা মানচিত্র দেখুন"
            : lang === "sat"
            ? "ᱦᱚᱱᱚᱛ ᱢᱮᱯ ᱧᱮᱞ ᱢᱮ"
            : lang === "ur"
            ? "مکمل ضلعی نقشہ دیکھیں"
            : "View Full State Map"} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
