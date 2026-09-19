"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bug,
  Warning,
  ArrowLeft,
  Bomb,
  Lightning,
  ClockCounterClockwise,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";
import GlobalErrorFallback from "@/components/error/GlobalErrorFallback";

export default function TestErrorPage() {
  const [shouldCrashRender, setShouldCrashRender] = useState(false);
  const [previewDirectFallback, setPreviewDirectFallback] = useState(false);

  // 1. Crash during React Render
  if (shouldCrashRender) {
    throw new Error(
      "Simulated Critical Component Crash: Component failed during render lifecycle at <TestErrorPage />"
    );
  }

  // 2. Direct preview of the fallback screen
  if (previewDirectFallback) {
    const mockError = new TypeError(
      "Cannot read properties of undefined (reading 'calculatePriorityScore') at ProblemTriageEngine"
    );
    mockError.digest = "SIH26043_DEMO_DIGEST_982";
    return (
      <GlobalErrorFallback
        error={mockError}
        origin="Simulated Diagnostic Preview"
        onClose={() => setPreviewDirectFallback(false)}
        reset={() => setPreviewDirectFallback(false)}
      />
    );
  }

  // 3. Event handler error
  const triggerEventHandlerError = () => {
    // Intentionally accessing property on null
    const nullObj = null;
    nullObj.executeOperation();
  };

  // 4. Unhandled Promise Rejection
  const triggerUnhandledRejection = () => {
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            "UnhandledPromiseRejection: Groq API upstream gateway timed out after 5000ms while analyzing grievance sentiment."
          )
        );
      }, 100);
    });
  };

  // 5. Async fetch rejection
  const triggerAsyncFetchError = async () => {
    const fakeAsyncCall = async () => {
      throw new URIError("NetworkURIException: Malformed URI encountered in /api/external/gis-map-layer");
    };
    fakeAsyncCall();
  };

  return (
    <div className="min-h-screen bg-paper text-ink p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-3 hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to SETU Portal</span>
        </Link>

        <div className="bg-surface rounded-2xl border border-line p-6 md:p-8 shadow-1 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-tint text-red flex items-center justify-center border border-red/20">
              <Bug size={24} weight="duotone" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-ink">
                SETU Error Boundary & Fallback Test Suite
              </h1>
              <p className="text-xs text-ink-3 font-mono">
                Verify error interception, type classification, source location, and diagnostic fallbacks.
              </p>
            </div>
          </div>

          <p className="text-sm text-ink-2 leading-relaxed mb-6">
            Use the triggers below to test that both fatal crashes and small runtime errors are caught,
            parsed, and displayed with accurate error types, location coordinates, and the
            <strong> &ldquo;Sorry, something got broken...&rdquo;</strong> fallback page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direct Preview */}
            <div className="p-4 rounded-xl bg-paper border border-line flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green" />
                  <h3 className="font-semibold text-sm text-ink">Preview Fallback Screen</h3>
                </div>
                <p className="text-xs text-ink-3 mb-4">
                  Directly preview the exact global error fallback page with full diagnostic UI.
                </p>
              </div>
              <button
                id="btn-preview-fallback"
                onClick={() => setPreviewDirectFallback(true)}
                className="w-full py-2 px-3 rounded-lg bg-green text-white font-medium text-xs hover:bg-green-2 transition-colors"
              >
                Open Fallback Preview
              </button>
            </div>

            {/* Fatal Render Crash */}
            <div className="p-4 rounded-xl bg-paper border border-line flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-red" />
                  <h3 className="font-semibold text-sm text-ink">Fatal Component Render Error</h3>
                </div>
                <p className="text-xs text-ink-3 mb-4">
                  Throws during React component render. Triggers the full global fallback page.
                </p>
              </div>
              <button
                id="btn-trigger-render-crash"
                onClick={() => setShouldCrashRender(true)}
                className="w-full py-2 px-3 rounded-lg bg-red text-white font-medium text-xs hover:bg-red/90 transition-colors"
              >
                Trigger Render Crash
              </button>
            </div>

            {/* Event Handler Error */}
            <div className="p-4 rounded-xl bg-paper border border-line flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber" />
                  <h3 className="font-semibold text-sm text-ink">Event Handler TypeError</h3>
                </div>
                <p className="text-xs text-ink-3 mb-4">
                  Throws an error inside a button click (e.g. accessing property of null).
                </p>
              </div>
              <button
                id="btn-trigger-event-error"
                onClick={triggerEventHandlerError}
                className="w-full py-2 px-3 rounded-lg bg-surface border border-line hover:bg-paper-2 font-medium text-xs text-ink transition-colors"
              >
                Trigger Event Handler Error
              </button>
            </div>

            {/* Unhandled Rejection */}
            <div className="p-4 rounded-xl bg-paper border border-line flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-violet" />
                  <h3 className="font-semibold text-sm text-ink">Unhandled Promise Rejection</h3>
                </div>
                <p className="text-xs text-ink-3 mb-4">
                  Simulates a failed background API call or unhandled async exception.
                </p>
              </div>
              <button
                id="btn-trigger-unhandled-rejection"
                onClick={triggerUnhandledRejection}
                className="w-full py-2 px-3 rounded-lg bg-surface border border-line hover:bg-paper-2 font-medium text-xs text-ink transition-colors"
              >
                Trigger Promise Rejection
              </button>
            </div>

            {/* Async Exception */}
            <div className="p-4 rounded-xl bg-paper border border-line flex flex-col justify-between sm:col-span-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-info" />
                  <h3 className="font-semibold text-sm text-ink">Async Network URI Exception</h3>
                </div>
                <p className="text-xs text-ink-3 mb-4">
                  Simulates an asynchronous error inside a detached task or background routine.
                </p>
              </div>
              <button
                id="btn-trigger-async-uri"
                onClick={triggerAsyncFetchError}
                className="w-full py-2 px-3 rounded-lg bg-surface border border-line hover:bg-paper-2 font-medium text-xs text-ink transition-colors"
              >
                Trigger Async URI Exception
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
