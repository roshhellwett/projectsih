"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Question,
  User,
  GraduationCap,
  Briefcase,
  Buildings,
  CaretDown,
  CaretUp,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { GovUtilityBar, GovFooter } from "@/components/GovHeaderFooter";
import { GovBrandLockup } from "@/components/ui";

const FAQS_DATA = {
  citizens: [
    {
      q: "How do I file a civic grievance on SAHYOG?",
      a: "Navigate to the Citizen Portal or click 'Report a Grievance' on the homepage. You can either type your problem or use the Voice Recording Memo to describe the issue in your mother tongue (Hindi, Santhali, Khortha, Ho, Mundari). Select your district, provide a location, and submit.",
    },
    {
      q: "How does the 72-Hour JRTPS statutory SLA work?",
      a: "Under the Jharkhand Right to Public Services Act 2011, every grievance has a 72-hour countdown. During this window, the AI engine classifies the issue, checks for spatial duplicates within 5km, and routes it to the District Collector and matching university. If unaddressed within 72 hours, it escalates to the Principal Secretary.",
    },
    {
      q: "What if someone else in my village already reported the same issue?",
      a: "Our AI spatial deduplication engine automatically detects similar grievances within a 5km radius. Instead of creating a redundant ticket, your submission is merged as an upvote on the existing ticket, raising its severity score and priority ranking.",
    },
  ],
  universities: [
    {
      q: "How can university researchers and students participate?",
      a: "Institutions (BIT Mesra, Central University of Jharkhand, Birsa Agricultural University, NIT Jamshedpur) log in to the University R&D Sandbox. Faculty and student teams can browse routed grievances in their domain, form multidisciplinary capstone teams, and submit technical proposals.",
    },
    {
      q: "What funding is provided for student prototypes?",
      a: "Accepted university proposals are listed on the Corporate CSR Marketplace, where leading industrial partners (Tata Steel Foundation, Coal India, JSPL) sponsor the pilot under MCA Section 135 escrow.",
    },
  ],
  industry: [
    {
      q: "How does the 3-Stage Milestone Escrow Disbursal work for CSR?",
      a: "Corporate CSR funds are placed into an institutional escrow account. Funds are released in 3 verifiable stages: Milestone 1 (35% on lab equipment procurement), Milestone 2 (40% upon field pilot inspection verified by the District Collector), and Milestone 3 (25% upon formal panchayat transfer).",
    },
    {
      q: "Are contributions eligible for tax exemptions?",
      a: "Yes. All contributions qualify as statutory CSR expenditure under Section 135 of the Companies Act 2013, Schedule VII, and are eligible for 80G tax exemptions with instant downloadable certificates.",
    },
  ],
  admin: [
    {
      q: "How do District Collectors and State Secretaries monitor reach across 24 districts?",
      a: "The State Command Center HUD provides real-time GIS telemetry across all 24 Jharkhand districts, displaying active tickets, resolved counts, SLA breach alerts, and one-click actions to dispatch Mobile Water Testing Labs or trigger DC site inspections.",
    },
  ],
};

export default function FaqsPage() {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("citizens");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "citizens", label: "For Citizens (नागरिक)", icon: User },
    { id: "universities", label: "For Universities & R&D", icon: GraduationCap },
    { id: "industry", label: "For Industry & CSR", icon: Briefcase },
    { id: "admin", label: "For State Administration", icon: Buildings },
  ];

  const currentFaqs = FAQS_DATA[activeTab].filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface font-body text-ink flex flex-col">
      <GovUtilityBar lang={lang} setLang={setLang} />

      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <GovBrandLockup variant="jharkhand" theme="light" size="md" href="/" />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green hover:text-green-2 transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to Portal
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-[960px] w-full mx-auto px-4 sm:px-6 py-10 md:py-14">
        <nav className="flex items-center gap-2 text-xs font-mono text-ink-3 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <span className="text-green font-bold">Help & FAQs</span>
        </nav>

        <div className="border-b border-line pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <Question size={16} weight="bold" className="text-emerald-600" />
            Citizen & Stakeholder Support Center
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink mb-3">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-sm text-ink-2">
            Everything you need to know about filing grievances, university solutions, CSR funding, and state administration.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., 72 hours, CSR escrow, audio memo)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-2 border border-line focus:border-green focus:ring-1 focus:ring-green text-sm text-ink outline-none transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-line pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedIndex(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-green text-white shadow-xs"
                    : "bg-surface-2 text-ink-2 hover:bg-paper hover:text-ink"
                }`}
              >
                <Icon size={16} weight={isSelected ? "fill" : "bold"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* FAQs Accordion */}
        <div className="flex flex-col gap-3">
          {currentFaqs.length === 0 ? (
            <div className="text-center py-12 text-ink-3 text-sm">
              No questions found matching &ldquo;{searchQuery}&rdquo;. Try another search term.
            </div>
          ) : (
            currentFaqs.map((faq, idx) => {
              const isOpen = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-line bg-surface overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-[15px] text-ink hover:bg-surface-2 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <CaretUp size={18} weight="bold" className="text-green shrink-0" />
                    ) : (
                      <CaretDown size={18} weight="bold" className="text-ink-3 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-sm leading-relaxed text-ink-2 border-t border-line/50 bg-paper/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 rounded-2xl bg-paper-2 border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-ink text-base mb-1">Still need assistance?</h4>
            <p className="text-xs text-ink-2">Our state civic desk is available 24/7 on toll-free telephone.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-ink-3 block">Toll-Free Helpline</span>
            <strong className="text-green text-lg font-mono">1800-345-6570</strong>
          </div>
        </div>
      </main>

      <GovFooter lang={lang} />
    </div>
  );
}
