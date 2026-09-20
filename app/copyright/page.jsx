"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copyright, FileText, CheckCircle } from "@phosphor-icons/react";
import { GovUtilityBar, GovFooter } from "@/components/GovHeaderFooter";
import { GovBrandLockup } from "@/components/ui";

export default function CopyrightPolicyPage() {
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
          <span className="text-green font-bold">Copyright Policy</span>
        </nav>

        <div className="border-b border-line pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <Copyright size={16} weight="bold" className="text-purple-600" />
            Open Government Data (OGD) Framework
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink mb-3">
            Copyright & Open Intellectual Property Policy
          </h1>
          <p className="text-sm text-ink-2 font-mono">
            Government of Jharkhand · Directorate of Higher & Technical Education · Smart India Hackathon 2026
          </p>
        </div>

        <div className="flex flex-col gap-10 text-[15px] leading-relaxed text-ink-2">
          
          <section className="bg-paper p-6 rounded-2xl border border-line">
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <Copyright size={20} weight="bold" className="text-green" />
              1. Ownership of Content
            </h2>
            <p className="mb-3">
              The material featured on this portal is subject to copyright protection under the <strong>Indian Copyright Act 1957</strong> and is the intellectual property of the <strong>Directorate of Higher & Technical Education, Government of Jharkhand</strong> unless otherwise indicated.
            </p>
            <p>
              The official State Seal of Jharkhand and national emblems are protected under the <strong>State Emblem of India (Prohibition of Improper Use) Act, 2005</strong> and may not be reproduced without explicit prior sanction.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <FileText size={20} weight="fill" className="text-blue" />
              2. Open Academic & Public Reuse
            </h2>
            <p className="mb-3">
              In the spirit of societal innovation, anonymized civic datasets and public problem taxonomies may be reproduced free of charge in any format or media for educational, research, and non-commercial public policy purposes under the <strong>National Data Sharing and Accessibility Policy (NDSAP)</strong>, subject to the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-ink-2">
              <li>The material must be reproduced accurately and not used in a derogatory manner or in a misleading context.</li>
              <li>Wherever the material is being published or issued to others, the source must be prominently acknowledged as <em>&ldquo;SAHYOG Portal, Government of Jharkhand (SIH26043)&rdquo;</em>.</li>
              <li>No personal citizen data or contact information may be republished.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <CheckCircle size={20} weight="fill" className="text-amber" />
              3. University R&D Intellectual Property Rights
            </h2>
            <p>
              Technical solutions, capstone prototypes, and engineering designs formulated by participating universities (BIT Mesra, CUJ, BAU, NIT Jamshedpur) remain the joint intellectual property of the respective academic institutions and the Government of Jharkhand, prioritized for statewide public deployment.
            </p>
          </section>

        </div>
      </main>

      <GovFooter lang={lang} />
    </div>
  );
}
