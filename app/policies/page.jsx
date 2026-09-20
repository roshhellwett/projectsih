"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { GovUtilityBar, GovFooter } from "@/components/GovHeaderFooter";
import { GovBrandLockup } from "@/components/ui";

export default function WebsitePoliciesPage() {
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
          <span className="text-green font-bold">Website Policies</span>
        </nav>

        <div className="border-b border-line pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <ShieldCheck size={16} weight="fill" className="text-emerald-600" />
            GIGW 3.0 Mandatory Governance Standards
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink mb-3">
            Website Policies & Governance Framework
          </h1>
          <p className="text-sm text-ink-2 font-mono">
            Compliant with Guidelines for Indian Government Websites (GIGW 3.0) · Directorate of Higher & Technical Education
          </p>
        </div>

        <div className="flex flex-col gap-10 text-[15px] leading-relaxed text-ink-2">
          
          <section className="bg-paper p-6 rounded-2xl border border-line">
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <FileText size={20} weight="fill" className="text-green" />
              1. Content Contribution, Moderation & Approval Policy (CMAP)
            </h2>
            <p className="mb-3">
              All citizen grievances submitted to SAHYOG are ingested through our multi-tiered automated moderation pipeline:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-ink-2">
              <li><strong>Tier 1:</strong> Automated Groq Llama 3.3 NLP scanning for obscenity, hate speech, or PII leaks.</li>
              <li><strong>Tier 2:</strong> Geodesic clustering to merge identical complaints within a 5km radius into unified community tickets.</li>
              <li><strong>Tier 3:</strong> Administrative verification by the District Nodal Officer prior to university matching.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <CheckCircle size={20} weight="fill" className="text-blue" />
              2. Content Review Policy (CRP) & Archival
            </h2>
            <p className="mb-3">
              All official departmental data, university researcher rosters, and CSR project listings are audited every <strong>30 days</strong> by designated nodal officers.
            </p>
            <p>
              Resolved grievances are retained in the active state database for <strong>180 days</strong> post-resolution, after which they are transferred to the State Digital Archives for longitudinal policy analysis.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <WarningCircle size={20} weight="fill" className="text-amber" />
              3. Security Audit & CERT-In Certification
            </h2>
            <p className="mb-3">
              The SAHYOG application codebase and infrastructure undergo periodic vulnerability assessment and penetration testing (VAPT) conducted by a <strong>CERT-In empanelled security auditor</strong>.
            </p>
            <p>
              Security controls adhere strictly to ISO/IEC 27001 standards, OWASP Top 10 web security protocols, and Government of India Cyber Crisis Management Plan (CCMP).
            </p>
          </section>

          <section className="border-t border-line pt-6">
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              4. Contingency Management & Disaster Recovery (DR)
            </h2>
            <p>
              In the event of network disruption or catastrophic server failure, failover is provisioned across geographically dispersed National Data Centres (Ranchi SDC and Delhi NDC) with a Recovery Point Objective (RPO) of &lt; 15 minutes and Recovery Time Objective (RTO) of &lt; 1 hour.
            </p>
          </section>

        </div>
      </main>

      <GovFooter lang={lang} />
    </div>
  );
}
