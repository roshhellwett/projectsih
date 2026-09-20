"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Warning,
  Bug,
  ArrowClockwise,
  House,
  ArrowLeft,
  Copy,
  Check,
  DownloadSimple,
  Trash,
  CaretDown,
  CaretUp,
  TerminalWindow,
  ShieldWarning,
  Code,
  Globe,
  Broadcast,
  Info,
} from "@phosphor-icons/react";
import { parseErrorInfo, generateErrorReport } from "./error-utils";

/**
 * Global Error Fallback UI Component
 *
 * @param {Object} props
 * @param {Error|Object|string} props.error - The error object or error event
 * @param {Object} [props.errorInfo] - Optional React errorInfo object containing componentStack
 * @param {Function} [props.reset] - Optional reset function to retry rendering
 * @param {string} [props.origin] - Where the error was caught (e.g. "Root Layout", "Route Segment", "Event Listener")
 * @param {Function} [props.onClose] - Optional close callback if rendered in a modal/drawer
 * @param {boolean} [props.isModal] - Whether this is rendered as a modal over the existing page
 * @param {boolean} [props.isHtmlBody] - If true, wraps in <html> and <body> for global-error.jsx
 */
export default function GlobalErrorFallback({
  error,
  errorInfo = null,
  reset,
  origin = "Global Error Boundary",
  onClose,
  isModal = false,
  isHtmlBody = false,
}) {
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [storageCleared, setStorageCleared] = useState(false);

  // Normalize error details
  const errorDetails = useMemo(() => {
    return parseErrorInfo(error, errorInfo, origin);
  }, [error, errorInfo, origin]);

  const handleCopyReport = async () => {
    try {
      const report = generateErrorReport(errorDetails);
      await navigator.clipboard.writeText(report);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    } catch {
      // Fallback
      setCopiedReport(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(errorDetails.errorCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  const handleDownloadLog = () => {
    try {
      const blob = new Blob([JSON.stringify(errorDetails, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sahyog-error-${errorDetails.errorCode.toLowerCase()}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download error log:", err);
    }
  };

  const handleClearCacheAndReload = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
      setStorageCleared(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      window.location.reload();
    }
  };

  const handleRetry = () => {
    if (typeof reset === "function") {
      reset();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const content = (
    <div
      data-error-fallback="true"
      className={`min-h-screen bg-paper text-ink selection:bg-red-tint selection:text-ink font-sans flex flex-col justify-between ${isModal ? "p-0" : ""}`}
    >
      {/* Indian Tricolour Top Accent Ribbon */}
      <div className="flex w-full h-1.5 shadow-sm" aria-hidden="true">
        <span className="flex-1 bg-saffron" />
        <span className="flex-1 bg-surface" />
        <span className="flex-1 bg-green" />
      </div>

      {/* Main Error Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col justify-center">
        {/* Header Badge & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-line">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ink-3">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span>SAHYOG Resilient Shield Monitor</span>
            <span>·</span>
            <span className="text-ink-2 font-semibold">{origin}</span>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                id="btn-close-fallback"
                onClick={onClose}
                className="px-3 py-1 text-xs rounded-full border border-line bg-surface hover:bg-paper-2 text-ink-2 transition-colors"
              >
                Close Fallback View
              </button>
            )}
            <button
              onClick={handleCopyCode}
              title="Click to copy error code"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-tint border border-red/20 text-red text-xs font-mono font-medium hover:bg-red/10 transition-colors"
            >
              <ShieldWarning size={14} weight="bold" />
              <span>{errorDetails.errorCode}</span>
              {copiedCode ? <Check size={12} weight="bold" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {/* Hero Alert Title */}
        <div className="bg-surface rounded-2xl border border-line p-6 md:p-8 shadow-2 relative overflow-hidden mb-6">
          {/* Subtle background decorative gradient */}
          <div
            className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-red/5 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-red/10 border border-red/20 flex items-center justify-center text-red shrink-0 shadow-sm">
              <Bug size={32} weight="duotone" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-red-tint text-red border border-red/20 uppercase tracking-wide">
                  {errorDetails.errorType}
                </span>
                {errorDetails.digest && (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-ink-3 bg-paper-2 border border-line">
                    Digest: #{errorDetails.digest}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-ink tracking-tight">
                Sorry, something got broken...
              </h1>
              <p className="text-sm md:text-base text-ink-2 mt-1 leading-relaxed">
                An unexpected error occurred while executing this view. We have captured complete
                diagnostic information below to help pinpoint and fix the root cause.
              </p>
            </div>
          </div>

          {/* Error Message Callout */}
          <div className="rounded-xl bg-surface-2 border border-line p-4 mb-6 font-mono text-xs md:text-sm text-ink-2 overflow-x-auto relative">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-ink-3 text-[11px] font-sans uppercase tracking-wider mb-1">
                <TerminalWindow size={14} weight="bold" />
                <span>Runtime Exception Message</span>
              </div>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(errorDetails.message);
                }}
                className="text-ink-3 hover:text-ink text-[11px] flex items-center gap-1 font-sans transition-colors"
                title="Copy message"
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>
            </div>
            <p className="text-red font-semibold break-words whitespace-pre-wrap selection:bg-red selection:text-white">
              {errorDetails.message || "Unknown error occurred with no message."}
            </p>
          </div>

          {/* Diagnostic Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {/* 1. What type of error */}
            <div className="p-3.5 rounded-xl bg-paper border border-line">
              <span className="text-[11px] uppercase tracking-wider text-ink-3 font-medium block mb-1">
                Error Type
              </span>
              <span className="font-mono text-xs font-bold text-ink truncate block" title={errorDetails.errorType}>
                {errorDetails.errorType}
              </span>
              <span className="text-[11px] text-ink-3 mt-1 block">
                Origin: {errorDetails.eventType}
              </span>
            </div>

            {/* 2. Where it occurred (Location/File/Line) */}
            <div className="p-3.5 rounded-xl bg-paper border border-line">
              <span className="text-[11px] uppercase tracking-wider text-ink-3 font-medium block mb-1">
                Where It Occurred
              </span>
              <span
                className="font-mono text-xs font-bold text-ink truncate block"
                title={errorDetails.where.file}
              >
                {errorDetails.where.file || "Unknown Source"}
              </span>
              <span className="text-[11px] text-ink-3 mt-1 block">
                {errorDetails.where.line ? (
                  <span>
                    Line {errorDetails.where.line}
                    {errorDetails.where.column ? ` : Col ${errorDetails.where.column}` : ""}
                  </span>
                ) : (
                  <span>Route: {errorDetails.where.route}</span>
                )}
              </span>
            </div>

            {/* 3. Component Hierarchy / Function */}
            <div className="p-3.5 rounded-xl bg-paper border border-line">
              <span className="text-[11px] uppercase tracking-wider text-ink-3 font-medium block mb-1">
                Component / Function
              </span>
              <span
                className="font-mono text-xs font-bold text-green-2 truncate block"
                title={errorDetails.where.component}
              >
                {errorDetails.where.component || "Anonymous Function"}
              </span>
              <span className="text-[11px] text-ink-3 mt-1 block">
                Route: {errorDetails.where.route}
              </span>
            </div>

            {/* 4. Error Code & Timestamp */}
            <div className="p-3.5 rounded-xl bg-paper border border-line">
              <span className="text-[11px] uppercase tracking-wider text-ink-3 font-medium block mb-1">
                Error Code & Time
              </span>
              <span className="font-mono text-xs font-bold text-red truncate block">
                {errorDetails.errorCode}
              </span>
              <span className="text-[11px] text-ink-3 mt-1 block">
                {errorDetails.timestamp}
              </span>
            </div>
          </div>

          {/* Action Recovery Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green hover:bg-green-2 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              <ArrowClockwise size={18} weight="bold" />
              <span>Try Again</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined") window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-line hover:bg-paper text-ink font-medium text-sm transition-all active:scale-[0.98]"
            >
              <ArrowClockwise size={16} />
              <span>Reload Page</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-line hover:bg-paper text-ink font-medium text-sm transition-all active:scale-[0.98]"
            >
              <House size={16} />
              <span>Return Home</span>
            </Link>

            <button
              onClick={() => {
                if (typeof window !== "undefined") window.history.back();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-line hover:bg-paper text-ink font-medium text-sm transition-all active:scale-[0.98]"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-line hover:bg-paper text-ink-2 hover:text-ink text-xs font-medium transition-colors"
                title="Copy formatted diagnostic report to clipboard"
              >
                {copiedReport ? (
                  <>
                    <Check size={14} weight="bold" className="text-green" />
                    <span className="text-green font-semibold">Report Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Bug Report</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadLog}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-line hover:bg-paper text-ink-2 hover:text-ink text-xs font-medium transition-colors"
                title="Download incident diagnostics as JSON"
              >
                <DownloadSimple size={14} />
                <span className="hidden sm:inline">Download JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Technical Diagnostics Drawer */}
        <div className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden mb-6">
          <button
            id="btn-toggle-diagnostics"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-2 transition-colors border-b border-line/60"
          >
            <div className="flex items-center gap-2.5 text-sm font-medium text-ink">
              <Code size={18} className="text-ink-2" />
              <span>Technical Diagnostics & Stack Trace</span>
              <span className="text-xs text-ink-3 font-normal">
                ({showTechnicalDetails ? "Click to collapse" : "Click to inspect stack trace and system info"})
              </span>
            </div>
            {showTechnicalDetails ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </button>

          {showTechnicalDetails && (
            <div className="p-6 space-y-5 bg-surface-2/40">
              {/* Stack Trace */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-3">
                    JavaScript Call Stack
                  </span>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(errorDetails.stack);
                    }}
                    className="text-xs text-ink-2 hover:text-ink flex items-center gap-1 font-mono transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copy Stack</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-ink text-paper text-xs font-mono overflow-x-auto max-h-72 leading-relaxed border border-line/40">
                  {errorDetails.stack}
                </pre>
              </div>

              {/* Component Stack if available */}
              {errorDetails.componentStack && (
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-3 block mb-2">
                    React Component Hierarchy
                  </span>
                  <pre className="p-4 rounded-xl bg-ink text-paper text-xs font-mono overflow-x-auto max-h-48 leading-relaxed border border-line/40">
                    {errorDetails.componentStack}
                  </pre>
                </div>
              )}

              {/* System Metadata Table */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink-3 block mb-2">
                  Session & Environment Metadata
                </span>
                <div className="border border-line rounded-xl overflow-hidden bg-surface text-xs font-mono">
                  <div className="grid grid-cols-3 p-2.5 border-b border-line/60 bg-surface-2 font-semibold text-ink-2">
                    <span>Property</span>
                    <span className="col-span-2">Value</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 border-b border-line/60 text-ink-2">
                    <span className="text-ink-3">Error Code</span>
                    <span className="col-span-2 font-bold text-red">{errorDetails.errorCode}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 border-b border-line/60 text-ink-2">
                    <span className="text-ink-3">Occurred At</span>
                    <span className="col-span-2">{errorDetails.timestamp}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 border-b border-line/60 text-ink-2">
                    <span className="text-ink-3">URL Path</span>
                    <span className="col-span-2 break-all">{errorDetails.environment.url || errorDetails.where.route}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 border-b border-line/60 text-ink-2">
                    <span className="text-ink-3">User Agent</span>
                    <span className="col-span-2 break-all text-[11px]">{errorDetails.environment.userAgent}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 text-ink-2">
                    <span className="text-ink-3">Connection & Screen</span>
                    <span className="col-span-2">
                      {errorDetails.environment.isOnline ? "🟢 Online" : "🔴 Offline"} · Screen: {errorDetails.environment.viewport}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cache clear option */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-tint/40 border border-amber/20">
                <div className="text-xs text-ink-2">
                  <strong className="block text-ink font-semibold">Persisting client corruption?</strong>
                  <span>Clear browser local storage and cached session tokens for SAHYOG.</span>
                </div>
                <button
                  onClick={handleClearCacheAndReload}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-line text-ink hover:bg-paper text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash size={14} className="text-red" />
                  <span>{storageCleared ? "Resetting..." : "Clear Cache & Reload"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-line py-4 px-4 bg-surface text-center text-xs text-ink-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SAHYOG — Societal Innovation Collaboration Portal · SIH26043</span>
          <span>Government of Jharkhand · Automated Fault Isolation System</span>
        </div>
      </footer>
    </div>
  );

  return content;
}
