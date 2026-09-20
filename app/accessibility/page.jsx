"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wheelchair, Eye, Keyboard, SpeakerHigh, CheckCircle } from "@phosphor-icons/react";
import { GovUtilityBar, GovFooter } from "@/components/GovHeaderFooter";
import { GovBrandLockup } from "@/components/ui";

export default function AccessibilityStatementPage() {
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
          <span className="text-green font-bold">Accessibility Statement</span>
        </nav>

        <div className="border-b border-line pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <Wheelchair size={16} weight="fill" className="text-emerald-600" />
            WCAG 2.1 Level AA & GIGW 3.0 Standard
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink mb-3">
            Accessibility Statement
          </h1>
          <p className="text-sm text-ink-2 font-mono">
            Committed to Universal Inclusivity for Persons with Disabilities (Divyangjan) · September 2026
          </p>
        </div>

        <div className="flex flex-col gap-10 text-[15px] leading-relaxed text-ink-2">
          
          <section className="bg-paper p-6 rounded-2xl border border-line">
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <Eye size={20} weight="fill" className="text-green" />
              1. Universal Accessibility Mandate
            </h2>
            <p className="mb-3">
              We are committed to ensuring that the <strong>SAHYOG Portal</strong> is accessible to all users irrespective of device in use, technology, or ability. It has been built with the objective of providing maximum accessibility and usability to its visitors, including citizens with visual, auditory, cognitive, and motor impairments.
            </p>
            <p>
              The portal complies with <strong>World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> and the <strong>Rights of Persons with Disabilities Act, 2016</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2.5">
              <CheckCircle size={20} weight="fill" className="text-blue" />
              2. Implemented Accessibility Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl bg-surface-2 border border-line">
                <div className="flex items-center gap-2 font-bold text-ink mb-1.5">
                  <Keyboard size={18} weight="fill" className="text-green" />
                  Keyboard Accessibility
                </div>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Every interactive element, modal, form input, and navigation link can be operated solely using the Tab, Enter, Space, and Arrow keys.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-2 border border-line">
                <div className="flex items-center gap-2 font-bold text-ink mb-1.5">
                  <Eye size={18} weight="fill" className="text-amber" />
                  Text Resizing & Contrast Toggle
                </div>
                <p className="text-xs text-ink-2 leading-relaxed">
                  The utility header provides instant A-, A, A+ text scaling controls and a high-contrast mode with color contrast ratios exceeding 7:1 (WCAG AAA).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-2 border border-line">
                <div className="flex items-center gap-2 font-bold text-ink mb-1.5">
                  <SpeakerHigh size={18} weight="fill" className="text-blue" />
                  Screen Reader Compatibility
                </div>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Compatible with NVDA, JAWS, and VoiceOver. All images include descriptive alt tags; icons use aria-hidden or aria-labels.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-2 border border-line">
                <div className="flex items-center gap-2 font-bold text-ink mb-1.5">
                  <CheckCircle size={18} weight="fill" className="text-purple" />
                  Multilingual Voice Memos
                </div>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Illiterate or visually impaired citizens can speak grievances in their mother tongue (Santhali, Khortha, Ho, Mundari), auto-transcribed via IndicTrans2.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-line pt-6">
            <h2 className="font-display text-xl font-bold text-ink mb-3">
              3. Feedback & Contact Information
            </h2>
            <p className="mb-3">
              If you encounter any difficulty accessing any information on this portal or require assistance with assistive technologies, please contact our Nodal Accessibility Officer:
            </p>
            <div className="bg-surface-2 p-4 rounded-xl border border-line text-sm">
              <strong className="text-ink block mb-1">State Accessibility Coordinator:</strong>
              <p className="text-ink-2">Department of Higher & Technical Education, Government of Jharkhand, Ranchi – 834002</p>
              <p className="mt-2 text-ink font-mono text-xs">Email: accessibility.sahyog@jharkhand.gov.in · Helpline: 1800-345-6570</p>
            </div>
          </section>

        </div>
      </main>

      <GovFooter lang={lang} />
    </div>
  );
}
