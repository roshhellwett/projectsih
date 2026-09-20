"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LinkSimple, ArrowSquareOut, ShieldCheck } from "@phosphor-icons/react";
import { GovUtilityBar, GovFooter } from "@/components/GovHeaderFooter";
import { GovBrandLockup } from "@/components/ui";

export default function HyperlinkPolicyPage() {
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
          <span className="text-green font-bold">Hyperlink Policy</span>
        </nav>

        <div className="border-b border-line pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <LinkSimple size={16} weight="bold" className="text-blue-600" />
            GIGW 3.0 External Linkage Framework
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink mb-3">
            Hyperlinking Policy
          </h1>
          <p className="text-sm text-ink-2 font-mono">
            Government of Jharkhand · Directorate of Higher & Technical Education
          </p>
        </div>

        <div className="flex flex-col gap-10 text-[15px] leading-relaxed text-ink-2">
          
          <section className="bg-paper p-6 rounded-2xl border border-line">
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <LinkSimple size={20} weight="bold" className="text-green" />
              1. Links to External Websites
            </h2>
            <p className="mb-3">
              At many places in this portal, you shall find links to other websites/portals (e.g., National Portal of India, Digital India, CPGRAMS, Smart India Hackathon, and participating university portals). These links have been placed for the user&apos;s convenience.
            </p>
            <p className="mb-3">
              The Directorate of Higher & Technical Education, Government of Jharkhand is not responsible for the contents and reliability of the linked websites and does not necessarily endorse the views expressed within them. We cannot guarantee that these links will work at all times and have no control over the availability of linked pages.
            </p>
            <div className="p-3 bg-surface rounded-xl border border-line flex items-center gap-2 text-xs font-mono text-ink-2">
              <ArrowSquareOut size={16} className="text-green shrink-0" />
              <span>All external links open in a new window/tab and are clearly marked with an external link indicator.</span>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <ShieldCheck size={20} weight="fill" className="text-blue" />
              2. Links to SAHYOG Portal by Other Websites
            </h2>
            <p className="mb-3">
              Prior permission is not required to direct hyperlinks to the SAHYOG Portal (<code className="text-xs bg-paper px-1.5 py-0.5 rounded font-mono text-ink">sahyog.jharkhand.gov.in</code>). However, we request you to inform us about any links provided to this portal so that you may be informed of any changes or updates therein.
            </p>
            <p>
              We do not permit our pages to be loaded into frames on your site. The pages belonging to this portal must load into an entire newly opened window of the user.
            </p>
          </section>

        </div>
      </main>

      <GovFooter lang={lang} />
    </div>
  );
}
