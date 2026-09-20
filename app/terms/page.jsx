"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scales, ShieldWarning, Clock, CheckCircle } from "@phosphor-icons/react";
import { GovUtilityBar, GovFooter } from "@/components/GovHeaderFooter";
import { GovBrandLockup } from "@/components/ui";

export default function TermsPage() {
  const [lang, setLang] = useState("en");

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
          <span className="text-green font-bold">Terms & Conditions</span>
        </nav>

        <div className="border-b border-line pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <Scales size={16} weight="fill" className="text-amber-600" />
            JRTPS Act 2011 & IT Act 2000 Statutory Framework
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink mb-3">
            Terms & Conditions of Service
          </h1>
          <p className="text-sm text-ink-2 font-mono">
            Enacted by Directorate of Higher & Technical Education, Government of Jharkhand · Effective: September 2026
          </p>
        </div>

        <div className="flex flex-col gap-10 text-[15px] leading-relaxed text-ink-2">
          
          <section className="bg-paper p-6 rounded-2xl border border-line">
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <Clock size={20} weight="fill" className="text-green" />
              1. 72-Hour Statutory Service Level Agreement (SLA)
            </h2>
            <p className="mb-3">
              Under the <strong>Jharkhand Right to Public Services (JRTPS) Act 2011</strong>, every verified civic grievance submitted via the SAHYOG portal receives an automated statutory SLA clock of <strong>72 hours</strong>.
            </p>
            <p>
              Within this 72-hour window, the grievance must be classified, geographically validated, and routed to the jurisdictional District Collector and matching University Research Institution. If unaddressed within 72 hours, the grievance is automatically escalated to the Principal Secretary, Government of Jharkhand.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <CheckCircle size={20} weight="fill" className="text-blue" />
              2. Citizen Rights & Acceptable Usage
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-ink-2">
              <li>Every bona fide resident of Jharkhand has the right to file grievances without administrative fee or discrimination.</li>
              <li>Users may submit audio voice memos in recognized regional languages (Santhali, Khortha, Ho, Mundari, Bengali, Urdu, Hindi).</li>
              <li>All claims must reflect genuine physical civic challenges (water quality, road infrastructure, health centers, schools).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <ShieldWarning size={20} weight="fill" className="text-red-500" />
              3. Prohibition of Frivolous & Malicious Submissions
            </h2>
            <p className="mb-3">
              Users are strictly prohibited from submitting defamatory, fraudulent, fabricated, or politically motivated complaints. 
            </p>
            <p>
              Submitting falsified GPS coordinates or doctored media constitutes an offense under <strong>Section 66D of the Information Technology Act 2000</strong>. Fraudulent accounts will be blacklisted and reported to the State Cyber Crime Cell.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              4. University Research & Corporate CSR Obligations
            </h2>
            <p className="mb-3">
              Universities and researchers engaging with citizen problem statements agree to utilize open-source, non-proprietary innovations where public welfare is involved. 
            </p>
            <p>
              Corporate sponsors funding projects via the CSR Marketplace agree to disburse funds under <strong>Section 135 of the Companies Act 2013</strong> through the institutional 3-stage milestone escrow ledger verified by District Authorities.
            </p>
          </section>

          <section className="border-t border-line pt-6">
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              5. Dispute Resolution & Jurisdiction
            </h2>
            <p>
              Any legal disputes arising out of the use of this portal shall be subject to the exclusive jurisdiction of the competent courts in <strong>Ranchi, Jharkhand</strong>.
            </p>
          </section>

        </div>
      </main>

      <GovFooter lang={lang} />
    </div>
  );
}
