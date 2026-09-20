"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GovUtilityBar, GovFooter } from "@/components/GovHeaderFooter";
import { BridgePanel, RoleDossier, JourneyRail, DistrictCoverageExplorer } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { Reveal, CountUp } from "@/components/ui/motion";
import { getTranslation, getStoredLang, setStoredLang } from "@/lib/i18n";
import {
  FileText,
  MagnifyingGlass,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Cpu,
  CheckCircle,
  ArrowRight,
  Sparkle,
  Clock,
} from "@phosphor-icons/react";

export default function LandingPage() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(getStoredLang());
    const onLangChange = (e) => {
      if (e.detail?.lang) setLang(e.detail.lang);
    };
    window.addEventListener("sahyog_lang_changed", onLangChange);
    return () => window.removeEventListener("sahyog_lang_changed", onLangChange);
  }, []);

  const t = getTranslation(lang);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setStoredLang(newLang);
  };

  return (
    <div className="min-h-screen bg-surface font-body text-ink flex flex-col overflow-x-hidden">
      {/* Official Government Top Utility Bar */}
      <GovUtilityBar lang={lang} setLang={handleLangChange} />

      {/* Primary service header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-md bg-green-2 flex items-center justify-center text-white font-deva font-bold text-sm shrink-0">
              सहयोग
            </span>
            <span className="min-w-0 truncate font-display font-bold text-lg sm:text-xl">
              SAHYOG <span className="text-ink-3 text-lg">
                {lang === "hi" ? "झारखण्ड" : lang === "bn" ? "ঝাড়খণ্ড" : lang === "sat" ? "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ" : lang === "ur" ? "جھارکھنڈ" : "Jharkhand"}
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex justify-self-center items-center gap-7 text-[14px] font-medium text-ink-2">
            <a href="#services" className="hover:text-green transition-colors">{t.navServices}</a>
            <a href="#how" className="hover:text-green transition-colors">{t.navHow}</a>
            <a href="#roles" className="hover:text-green transition-colors">{t.navRoles}</a>
            <a href="#districts" className="hover:text-green transition-colors">{t.navDistricts}</a>
            <a href="#tech" className="hover:text-green transition-colors">{t.navTech}</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">
                {t.btnSignIn}
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-green hover:bg-green/90 text-white shadow-md">
                {t.btnEnter}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Service gateway */}
      <main id="main-content" className="flex-1 flex flex-col">
        <section className="relative overflow-hidden bg-paper border-b border-line py-10 md:py-14 lg:py-16">
          <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-green-tint/50 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 w-[380px] h-[380px] rounded-full bg-saffron-tint/40 blur-3xl" aria-hidden="true" />

          <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_460px] gap-8 lg:gap-12 items-center">
            <div className="flex flex-col gap-5">
              <div className="hero-in hero-d1 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-line w-fit">
                <span className="px-2 py-0.5 rounded-sm bg-green-tint text-green text-[10px] font-bold tracking-widest uppercase">
                  SIH26043
                </span>
                <span className="text-[13px] font-medium text-ink-2">
                  {t.stateGov}
                </span>
              </div>

              <h1 className="hero-in hero-d2 font-display text-[36px] md:text-[48px] lg:text-[54px] font-bold leading-[1.12] text-ink max-w-3xl text-balance">
                {t.heroHead}
              </h1>

              <p className="hero-in hero-d3 text-[16px] md:text-[18px] text-ink-2 leading-relaxed max-w-2xl">
                {t.heroLead}
              </p>

              {/* Mobile-first hero illustration */}
              <div className="hero-in hero-d3 lg:hidden glow-pad -my-2">
                <Image
                  src="/illustrations/hero-civic.png"
                  alt="Illustration of a Jharkhand village and town connected by a bridge, with school, water supply and solar facilities"
                  width={1280}
                  height={1024}
                  priority
                  className="w-full max-w-[460px] mx-auto h-auto float-soft"
                />
              </div>

              <div className="hero-in hero-d4 grid grid-cols-1 sm:flex items-center gap-3 mt-2">
                <Link href="/login?role=citizen" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-6 text-[15px] lift">
                    <FileText size={20} weight="bold" className="mr-2" />
                    {t.btnReport}
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6 text-[15px] lift">
                    <MagnifyingGlass size={20} weight="bold" className="mr-2" />
                    {t.btnTrack}
                  </Button>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="hero-in hero-d5 flex flex-wrap items-center gap-2 mt-3 text-[12px] font-medium text-ink-3">
                <span className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-md border border-line">
                  <ShieldCheck size={16} weight="fill" className="text-green" />
                  GIGW 3.0 Verified
                </span>
                <span className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-md border border-line">
                  <Cpu size={16} weight="fill" className="text-amber" />
                  Groq Llama 3.3 AI Triage
                </span>
                <span className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-md border border-line">
                  <CheckCircle size={16} weight="fill" className="text-green" />
                  Aadhaar / DigiLocker Ready
                </span>
              </div>
            </div>

            {/* Right: 3D civic scene + live feed island */}
            <div className="hero-in hero-d4 w-full max-w-md mx-auto lg:ml-auto lg:mr-0 flex flex-col gap-6">
              <div className="hidden lg:block glow-pad max-w-[340px] ml-auto">
                <Image
                  src="/illustrations/hero-civic.png"
                  alt="Illustration of a Jharkhand village and town connected by a bridge, with school, water supply and solar facilities"
                  width={1280}
                  height={1024}
                  priority
                  className="w-full h-auto float-soft"
                />
              </div>
              <BridgePanel lang={lang} />
            </div>
          </div>
        </section>

        {/* Quick Discovery Services Grid (UMANG style) */}
        <section className="py-14 lg:py-18 bg-surface" id="services">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-start max-w-3xl mb-9">
              <span className="text-[12px] font-bold tracking-widest text-ink-3 uppercase mb-4">
                QUICK ACCESS TILES
              </span>
              <h2 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-ink">
                {t.quickTilesTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: "/login?role=citizen", img: "/illustrations/icon-report.png", title: t.tile1T, desc: t.tile1D, cta: "Open Citizen View", border: "hover:border-green", pad: "bg-green-tint/50", text: "text-green" },
                { href: "/login", img: "/illustrations/icon-track.png", title: t.tile2T, desc: t.tile2D, cta: "Track Application", border: "hover:border-amber", pad: "bg-amber-tint/50", text: "text-amber" },
                { href: "/login?role=university", img: "/illustrations/icon-university.png", title: t.tile3T, desc: t.tile3D, cta: "Enter Solver Portal", border: "hover:border-blue", pad: "bg-blue-tint/50", text: "text-blue" },
                { href: "/login?role=industry", img: "/illustrations/icon-csr.png", title: t.tile4T, desc: t.tile4D, cta: "Browse CSR Projects", border: "hover:border-purple", pad: "bg-purple-tint/50", text: "text-purple" },
              ].map((tile, i) => (
                <Reveal key={tile.href + i} delay={i * 80} className="h-full">
                  <Link
                    href={tile.href}
                    className={`group h-full flex flex-col p-5 rounded-lg bg-surface border border-line lift ${tile.border}`}
                  >
                    <div className={`w-16 h-16 rounded-xl ${tile.pad} flex items-center justify-center mb-6`}>
                      <Image src={tile.img} alt="" aria-hidden="true" width={816} height={816} loading="lazy" className="w-11 h-11 tilt-3d" />
                    </div>
                    <h3 className="font-display font-bold text-[18px] text-ink mb-2">{tile.title}</h3>
                    <p className="text-[14px] text-ink-2 leading-relaxed mb-6 flex-1">{tile.desc}</p>
                    <div className={`flex items-center gap-2 text-[14px] font-semibold ${tile.text} group-hover:translate-x-1 transition-transform`}>
                      {tile.cta} <ArrowRight size={16} />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Real Metrics Band (Jal Jeevan Mission / Gov Dashboard style) */}
        <section className="py-12 bg-surface-2 border-y border-line">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 lg:divide-x lg:divide-line">
              {[
                { v: t.stat1, l: t.stat1L, s: "Ranchi to Sahibganj", c: "text-ink" },
                { v: t.stat2, l: t.stat2L, s: "Water, Health, Roads...", c: "text-ink" },
                { v: t.stat3, l: t.stat3L, s: "BIT Mesra, NIT Jsr...", c: "text-ink" },
                { v: t.stat4, l: t.stat4L, s: "Zero Paid APIs", c: "text-green" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 90} className="flex flex-col items-center text-center px-2 sm:px-4">
                  <div className={`font-display text-[36px] md:text-[56px] font-bold ${s.c} leading-none mb-2`}>
                    <CountUp value={s.v} />
                  </div>
                  <div className="text-[13px] sm:text-[14px] font-bold text-ink-2 uppercase tracking-wide mb-1">{s.l}</div>
                  <div className="text-[12.5px] text-ink-3">{s.s}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Grievance Lifecycle Journey */}
        <section className="py-20 lg:py-24 bg-surface" id="how">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <span className="text-[12px] font-bold tracking-widest text-ink-3 uppercase mb-4">
                TRANSPARENT WORKFLOW
              </span>
              <h2 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-ink mb-4">
                {t.journeyTitle}
              </h2>
              <p className="text-[18px] text-ink-2 leading-relaxed">
                {t.journeyLead}
              </p>
            </div>
            
            <div className="flex w-full items-center justify-center">
               <JourneyRail lang={lang} />
            </div>
          </div>
        </section>

        {/* 4-Role Interactive Dossier */}
        <section className="py-20 lg:py-24 bg-surface-2 border-y border-line" id="roles">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <span className="text-[12px] font-bold tracking-widest text-ink-3 uppercase mb-4">
                STAKEHOLDER ARCHITECTURE
              </span>
              <h2 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-ink">
                {t.rolesTitle}
              </h2>
            </div>
            <RoleDossier lang={lang} />
          </div>
        </section>

        {/* District Coverage Explorer */}
        <section className="py-20 lg:py-24 bg-surface" id="districts">
          <div className="max-w-[1400px] mx-auto px-6">
            <DistrictCoverageExplorer lang={lang} />
          </div>
        </section>

        {/* Architecture & Gov-Cloud Roadmap */}
        <section className="py-20 lg:py-24 bg-surface-2 border-t border-line" id="tech">
          <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[12px] font-bold tracking-widest text-ink-3 uppercase mb-4 block">
                OPEN & SOVEREIGN TECH
              </span>
              <h2 className="font-display text-[36px] md:text-[44px] font-bold tracking-tight text-ink mb-6">
                {t.techTitle}
              </h2>
              <p className="text-[18px] text-ink-2 leading-relaxed mb-10">
                {t.techLead}
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  "Next.js 14 App Router",
                  "Supabase Postgres + pgvector",
                  "Groq Llama 3.3 Triage",
                  "Interactive React Leaflet",
                  "NIC MeghRaj Ready",
                  "GIGW 3.0 / WCAG 2.1 AA",
                ].map((chip) => (
                  <span key={chip} className="px-3 py-1.5 rounded-full bg-surface border border-line text-[13px] font-medium text-ink-2">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-2xl border-2 border-line p-8 shadow-xl">
              <h4 className="flex items-center gap-2 font-display text-[20px] font-bold text-ink mb-8 pb-4 border-b border-line">
                <Sparkle size={24} weight="fill" className="text-amber" />
                Production Deployment Roadmap
              </h4>
              
              <div className="flex flex-col gap-8 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-line">
                {[
                  ["Aadhaar / DigiLocker SSO", "Single verified citizen identity without password friction."],
                  ["Regional Indic NLP", "Santali (Ol Chiki), Ho, and Mundari via IndicTrans2 and IndicBERT."],
                  ["Automated SMS / IVR Push", "Zero-internet grievance reporting via toll-free voice and SMS gateway."],
                  ["NIC MeghRaj Cloud Host", "Complete data-sovereign migration to National Cloud data centres."],
                ].map(([title, desc], i) => (
                  <div key={title} className={`relative pl-8 ${i > 1 ? "opacity-50" : ""}`}>
                    <div className={`absolute left-[5px] top-1.5 w-3 h-3 rounded-full border-2 border-surface ${i > 1 ? "bg-ink-3" : "bg-green"}`} />
                    <div className="font-bold text-[16px] text-ink mb-1">{title}</div>
                    <p className="text-[14px] text-ink-2 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Official Government Footer */}
      <GovFooter lang={lang} />
    </div>
  );
}
