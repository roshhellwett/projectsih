"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, LockKey, FileText, CheckCircle, Database, EyeSlash } from "@phosphor-icons/react";
import { GovUtilityBar, GovFooter } from "@/components/GovHeaderFooter";
import { GovBrandLockup } from "@/components/ui";

export default function PrivacyPolicyPage() {
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
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-ink-3 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <span className="text-green font-bold">Privacy Policy</span>
        </nav>

        {/* Header Title & Compliance Banner */}
        <div className="border-b border-line pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <ShieldCheck size={16} weight="fill" className="text-emerald-600" />
            DPDPA 2023 & GIGW 3.0 Certified
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink mb-3">
            Citizen Data Privacy & Protection Policy
          </h1>
          <p className="text-sm text-ink-2 font-mono">
            Published under the Digital Personal Data Protection Act (DPDPA), 2023 · Last Updated: 21 September 2026
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="flex flex-col gap-10 text-[15px] leading-relaxed text-ink-2">
          
          <section className="bg-paper p-6 rounded-2xl border border-line">
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <LockKey size={20} weight="fill" className="text-green" />
              1. Sovereign Commitment to Data Privacy
            </h2>
            <p className="mb-3">
              The Government of Jharkhand and the Directorate of Higher & Technical Education are committed to protecting the privacy, dignity, and personal data of every citizen submitting grievances or collaborating on societal innovations via the <strong>SAHYOG Portal (SIH26043)</strong>.
            </p>
            <p>
              In strict accordance with the <strong>Digital Personal Data Protection Act (DPDPA) 2023</strong> and the <strong>Information Technology Act 2000</strong>, personal data is collected solely for the legitimate purpose of resolving civic grievances, matching university research solutions, and disbursing corporate CSR funding.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <Database size={20} weight="fill" className="text-amber" />
              2. Nature of Data Collected & Purpose Limitation
            </h2>
            <div className="overflow-x-auto my-4 border border-line rounded-xl shadow-xs">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-paper-2 text-ink border-b border-line font-bold">
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Data Elements</th>
                    <th className="p-3.5">Specific Purpose</th>
                    <th className="p-3.5">Retention Mandate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <tr>
                    <td className="p-3.5 font-bold text-ink">Citizen Identity</td>
                    <td className="p-3.5">Name, masked mobile number, cadastral ward, district</td>
                    <td className="p-3.5">Authentication via Jan Parichay / DigiLocker & ticket receipt</td>
                    <td className="p-3.5">Active until grievance closure + 180 days audit</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-ink">Geo-Spatial Data</td>
                    <td className="p-3.5">GPS coordinates (latitude/longitude), site photographs</td>
                    <td className="p-3.5">Spatial deduplication (5km cluster) & field inspection routing</td>
                    <td className="p-3.5">Archived in State Spatial Data Infrastructure</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-ink">Speech & Dialect Memos</td>
                    <td className="p-3.5">Audio recordings in Santhali, Khortha, Ho, Mundari</td>
                    <td className="p-3.5">IndicTrans2 & IndicBERT NLP transcription into administrative text</td>
                    <td className="p-3.5">Raw audio deleted after text transcription verification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <EyeSlash size={20} weight="fill" className="text-green" />
              3. Automatic PII Masking & Public Redaction
            </h2>
            <p className="mb-3">
              To guarantee <strong>Zero Data Leakage</strong>, all public interfaces (including the Live Civic Grievance Feed, statewide heatmaps, and research solver dashboards) automatically mask Personally Identifiable Information (PII):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-ink-2">
              <li><strong>Mobile Numbers:</strong> Displayed in masked format (e.g., <code className="text-xs bg-paper-2 px-1.5 py-0.5 rounded font-mono text-ink">+91 98*** **420</code>).</li>
              <li><strong>Email Addresses:</strong> Redacted across public views (e.g., <code className="text-xs bg-paper-2 px-1.5 py-0.5 rounded font-mono text-ink">pr***@gov.in</code>).</li>
              <li><strong>National Identity Tokens:</strong> Never exposed; hashed via one-way SHA-256 tokens.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <CheckCircle size={20} weight="fill" className="text-blue" />
              4. Data Sovereignty & Hosting Infrastructure
            </h2>
            <p className="mb-3">
              All SAHYOG databases and application services are hosted strictly within sovereign Indian borders on <strong>MeghRaj NIC National Cloud</strong> and verified State Data Centres (SDC Ranchi). No data is ever transmitted to or stored in servers outside the Republic of India.
            </p>
            <p>
              All data transmissions are safeguarded using <strong>256-Bit TLS 1.3 / SSL encryption</strong>, strict Content Security Policies (CSP), and HTTP Strict Transport Security (HSTS).
            </p>
          </section>

          <section className="border-t border-line pt-6">
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              5. Citizen Data Rights & Data Protection Officer (DPO)
            </h2>
            <p className="mb-3">
              Under DPDPA 2023, citizens possess the right to access, rectify, or request erasure of their non-statutory personal data. To exercise your rights or report privacy concerns:
            </p>
            <div className="bg-surface-2 p-4 rounded-xl border border-line text-sm">
              <strong className="text-ink block mb-1">State Nodal Data Protection Officer (DPO):</strong>
              <p className="text-ink-2">Directorate of Higher & Technical Education, Government of Jharkhand, Nepal House, Doranda, Ranchi – 834002</p>
              <p className="mt-2 text-ink font-mono text-xs">Email: dpo.sahyog@jharkhand.gov.in · Toll-Free: 1800-345-6570</p>
            </div>
          </section>

        </div>
      </main>

      <GovFooter lang={lang} />
    </div>
  );
}
