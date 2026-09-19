"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Sun,
  Moon,
  TextT,
  MagnifyingGlass,
  ArrowSquareOut,
  Phone,
  EnvelopeSimple,
  MapPin,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";

export function GovUtilityBar({ lang, setLang }) {
  const [fontSize, setFontSize] = useState("normal");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === "small") {
      root.style.fontSize = "14px";
    } else if (fontSize === "large") {
      root.style.fontSize = "17.5px";
    } else {
      root.style.fontSize = "15px";
    }
  }, [fontSize]);

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle("high-contrast");
  };

  return (
    <div className="w-full relative z-50">
      {/* Indian Tricolour top ribbon */}
      <div className="flex w-full h-1" aria-hidden="true">
        <span className="flex-1 bg-saffron" />
        <span className="flex-1 bg-surface" />
        <span className="flex-1 bg-green" />
      </div>

      <div className="bg-surface-2 border-b border-line py-1.5 px-4 text-[12px] md:text-[13px]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          {/* Left: State / National Identification */}
          <div className="flex items-center gap-4 text-ink-2 font-medium">
            <span className="flex min-w-0 items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-info shrink-0" />
              <span className="flex min-w-0 items-center gap-1.5">
                <strong className="text-ink truncate">Government of Jharkhand</strong>
                <span className="hidden sm:inline text-ink-3">|</span>
                <span className="hidden sm:inline">झारखण्ड सरकार</span>
              </span>
            </span>
            <span className="hidden md:inline-block px-2 py-0.5 rounded bg-surface border border-line text-[11px] uppercase tracking-wide font-bold">
              SIH 2026 Civic Innovation Portal
            </span>
          </div>

          {/* Right: Accessibility & Internationalization tools */}
          <div className="flex items-center gap-2 sm:gap-4 text-ink-2 font-medium shrink-0">
            <a href="#main-content" className="hidden lg:inline hover:text-ink transition-colors underline decoration-transparent hover:decoration-ink underline-offset-2">
              Skip to Main Content
            </a>

            {/* Font Resize Controls */}
            <div className="hidden sm:flex items-center border border-line rounded bg-surface" role="group" aria-label="Text Size Controls">
              <button
                type="button"
                onClick={() => setFontSize("small")}
                className={`px-2 py-0.5 hover:bg-surface-2 transition-colors ${fontSize === "small" ? "bg-surface-2 text-ink font-bold" : ""}`}
                title="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize("normal")}
                className={`px-2 py-0.5 border-x border-line hover:bg-surface-2 transition-colors ${fontSize === "normal" ? "bg-surface-2 text-ink font-bold" : ""}`}
                title="Normal font size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("large")}
                className={`px-2 py-0.5 hover:bg-surface-2 transition-colors ${fontSize === "large" ? "bg-surface-2 text-ink font-bold" : ""}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Contrast / Dark Toggle */}
            <button
              type="button"
              onClick={toggleContrast}
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
              title="Toggle High Contrast Mode"
            >
              {highContrast ? <Sun size={14} weight="bold" /> : <Moon size={14} weight="bold" />}
              <span className="hidden sm:inline">{highContrast ? "Normal" : "High Contrast"}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 border-l border-line pl-4">
              <Globe size={14} weight="bold" />
              <button
                type="button"
                className={`hover:text-ink transition-colors ${lang === "en" ? "text-ink font-bold" : ""}`}
                onClick={() => setLang && setLang("en")}
              >
                EN
              </button>
              <span className="text-ink-3">/</span>
              <button
                type="button"
                className={`hover:text-ink transition-colors ${lang === "hi" ? "text-ink font-bold" : ""}`}
                onClick={() => setLang && setLang("hi")}
              >
                HI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GovFooter({ lang = "en" }) {
  const [visitorCount, setVisitorCount] = useState("1,428,950");
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    setTodayDate(new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }));
  }, []);

  return (
    <footer className="w-full bg-surface-2 border-t border-line text-ink-2 mt-auto" role="contentinfo">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Col 1: Portal Identity */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-green flex items-center justify-center text-white font-serif font-bold text-lg">
                सेतु
              </span>
              <div>
                <h3 className="font-display font-bold text-ink text-lg leading-tight">SETU Portal</h3>
                <span className="text-[13px] font-medium text-ink-3">
                  {lang === "hi"
                    ? "सामाजिक नवाचार सहयोग सेतु · झारखण्ड सरकार"
                    : "Societal Innovation Collaboration Portal"}
                </span>
              </div>
            </div>
            <p className="text-[14px] leading-relaxed">
              An intelligent, transparent civic grievance redressing and research matching platform developed under Smart India Hackathon (SIH26043) for the Department of Higher & Technical Education, Government of Jharkhand.
            </p>
            <div className="inline-flex items-center gap-3 bg-surface p-3 rounded-lg border border-line mt-2">
              <div className="w-10 h-10 rounded-full bg-green-tint/50 flex items-center justify-center text-green">
                <Phone size={20} weight="duotone" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Toll-Free Civic Helpline</div>
                <strong className="text-ink text-[16px]">1800-345-6570</strong>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-ink text-[15px] uppercase tracking-wide">Quick Navigation</h4>
            <ul className="flex flex-col gap-3 text-[14px]">
              <li>
                <Link href="/login?role=citizen" className="hover:text-green transition-colors">
                  {lang === "hi" ? "शिकायत दर्ज करें (Citizen Portal)" : "File a Grievance (Citizen Portal)"}
                </Link>
              </li>
              <li>
                <Link href="/login?role=university" className="hover:text-green transition-colors">
                  {lang === "hi" ? "विश्वविद्यालय अनुसंधान हब" : "University Research & Solutions"}
                </Link>
              </li>
              <li>
                <Link href="/login?role=industry" className="hover:text-green transition-colors">
                  {lang === "hi" ? "उद्योग सीएसआर फंडिंग" : "Industry CSR & Sponsorship"}
                </Link>
              </li>
              <li>
                <Link href="/login?role=admin" className="hover:text-green transition-colors">
                  {lang === "hi" ? "राज्य प्रशासनिक डैशबोर्ड" : "State Administrative Command"}
                </Link>
              </li>
              <li>
                <a href="#how" className="hover:text-green transition-colors">How the AI Engine Works</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Portals */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-ink text-[15px] uppercase tracking-wide">Official Portals</h4>
            <ul className="flex flex-col gap-3 text-[14px]">
              <li>
                <a href="https://jharkhand.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-green transition-colors">
                  Government of Jharkhand <ArrowSquareOut size={14} />
                </a>
              </li>
              <li>
                <a href="https://www.digitalindia.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-green transition-colors">
                  Digital India Initiative <ArrowSquareOut size={14} />
                </a>
              </li>
              <li>
                <a href="https://www.sih.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-green transition-colors">
                  Smart India Hackathon 2026 <ArrowSquareOut size={14} />
                </a>
              </li>
              <li>
                <a href="https://cpgrams.nic.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-green transition-colors">
                  CPGRAMS National Portal <ArrowSquareOut size={14} />
                </a>
              </li>
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-green transition-colors">
                  National Portal of India <ArrowSquareOut size={14} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Security & Compliance */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-ink text-[15px] uppercase tracking-wide">Compliance & Security</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-surface p-2.5 rounded-lg border border-line text-[13px] font-medium text-ink">
                <ShieldCheck size={20} weight="fill" className="text-green shrink-0" />
                <span>GIGW 3.0 & WCAG 2.1 AA Certified</span>
              </div>
              <div className="flex items-center gap-3 bg-surface p-2.5 rounded-lg border border-line text-[13px] font-medium text-ink">
                <CheckCircle size={20} weight="fill" className="text-green shrink-0" />
                <span>DPDPA 2023 Citizen Data Privacy Protected</span>
              </div>
              <div className="flex items-center gap-3 bg-surface p-2.5 rounded-lg border border-line text-[13px] font-medium text-ink">
                <CheckCircle size={20} weight="fill" className="text-green shrink-0" />
                <span>256-Bit SSL Secured Transmission</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Government Policies Strip */}
      <div className="border-t border-line bg-surface">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] font-medium text-ink-3">
          <a href="#" className="hover:text-ink transition-colors">Website Policies</a>
          <span>|</span>
          <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-ink transition-colors">Terms & Conditions</a>
          <span>|</span>
          <a href="#" className="hover:text-ink transition-colors">Hyperlink Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-ink transition-colors">Copyright Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-ink transition-colors">Accessibility Statement</a>
          <span>|</span>
          <a href="#" className="hover:text-ink transition-colors">Help & FAQs</a>
        </div>
      </div>

      {/* Bottom Authority & Hosting Credits */}
      <div className="bg-ink text-paper border-t border-ink-1">
        <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-center md:text-left">
          <div className="flex flex-col gap-2 max-w-2xl text-paper/70">
            <p>
              <strong className="text-paper">Content Owned & Maintained by:</strong> Directorate of Higher & Technical Education, Government of Jharkhand.
            </p>
            <p>
              Platform conceived & built for Smart India Hackathon 2026. Hosted on cloud infrastructure adhering to MeitY Guidelines.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4 text-paper/80">
            <div className="flex items-center gap-3">
              <span>Last Updated: <strong className="text-paper">{todayDate}</strong></span>
              <span className="text-paper/40">•</span>
              <span>Total Visitors: <strong className="text-paper">{visitorCount}</strong></span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-2 py-1 rounded bg-ink-2 text-paper text-[11px] font-bold uppercase tracking-wider">🇮🇳 Digital India</span>
              <span className="px-2 py-1 rounded bg-ink-2 text-paper text-[11px] font-bold uppercase tracking-wider">NIC Powered</span>
              <span className="px-2 py-1 rounded bg-ink-2 text-paper text-[11px] font-bold uppercase tracking-wider">MeitY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
