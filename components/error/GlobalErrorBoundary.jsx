"use client";

import React, { Component } from "react";
import GlobalErrorFallback from "./GlobalErrorFallback";
import { Warning, Bug, X, Eye, ArrowClockwise, Sparkle } from "@phosphor-icons/react";
import { parseErrorInfo } from "./error-utils";

/**
 * GlobalErrorBoundary catches:
 * 1. React tree render errors (via getDerivedStateFromError & componentDidCatch)
 * 2. Unhandled promise rejections (via window.onunhandledrejection)
 * 3. Uncaught window runtime & event handler errors (via window.onerror)
 */
export class GlobalErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasFatalError: false,
      fatalError: null,
      errorInfo: null,
      runtimeErrors: [],
      activeModalError: null,
      forceFullScreenOnAnyError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasFatalError: true,
      fatalError: error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[GlobalErrorBoundary] Caught React render error:", error, errorInfo);
    this.setState({
      fatalError: error,
      errorInfo: errorInfo,
    });
  }

  componentDidMount() {
    if (typeof window === "undefined") return;

    // Check if user preferred full fallback screen on any error
    try {
      const savedPref = localStorage.getItem("sahyog_error_force_fullscreen") || localStorage.getItem("setu_error_force_fullscreen");
      if (savedPref === "true") {
        this.setState({ forceFullScreenOnAnyError: true });
      }
    } catch {
      // ignore
    }

    // 1. Capture Uncaught window errors (event handlers, script errors, etc.)
    const handleWindowError = (event) => {
      // Avoid infinite error loop if error originated within error fallback
      if (event?.filename?.includes("GlobalErrorFallback")) return;

      const parsed = parseErrorInfo(event.error || event.message, null, "Window Runtime Error");
      console.warn("[GlobalErrorBoundary] Intercepted runtime error:", parsed);

      if (this.state.forceFullScreenOnAnyError) {
        this.setState({
          hasFatalError: true,
          fatalError: event.error || new Error(event.message || "Runtime Error"),
        });
      } else {
        this.setState((prev) => ({
          runtimeErrors: [parsed, ...prev.runtimeErrors.slice(0, 9)],
        }));
      }
    };

    // 2. Capture Unhandled Promise Rejections (failed fetch, Supabase, async/await)
    const handleUnhandledRejection = (event) => {
      const parsed = parseErrorInfo(event.reason, null, "Unhandled Promise Rejection");
      console.warn("[GlobalErrorBoundary] Intercepted unhandled promise rejection:", parsed);

      if (this.state.forceFullScreenOnAnyError) {
        this.setState({
          hasFatalError: true,
          fatalError:
            event.reason instanceof Error
              ? event.reason
              : new Error(typeof event.reason === "string" ? event.reason : "Unhandled Promise Rejection"),
        });
      } else {
        this.setState((prev) => ({
          runtimeErrors: [parsed, ...prev.runtimeErrors.slice(0, 9)],
        }));
      }
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    this.cleanupListeners = () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }

  componentWillUnmount() {
    if (this.cleanupListeners) {
      this.cleanupListeners();
    }
  }

  handleReset = () => {
    this.setState({
      hasFatalError: false,
      fatalError: null,
      errorInfo: null,
      activeModalError: null,
    });
  };

  handleDismissRuntimeError = (id) => {
    this.setState((prev) => ({
      runtimeErrors: prev.runtimeErrors.filter((e) => e.id !== id),
    }));
  };

  handleClearAllRuntimeErrors = () => {
    this.setState({ runtimeErrors: [] });
  };

  toggleForceFullScreen = () => {
    this.setState(
      (prev) => ({ forceFullScreenOnAnyError: !prev.forceFullScreenOnAnyError }),
      () => {
        try {
          localStorage.setItem(
            "sahyog_error_force_fullscreen",
            this.state.forceFullScreenOnAnyError ? "true" : "false"
          );
        } catch {}
      }
    );
  };

  render() {
    const {
      hasFatalError,
      fatalError,
      errorInfo,
      runtimeErrors,
      activeModalError,
      forceFullScreenOnAnyError,
    } = this.state;

    // 1. If a fatal React render crash occurred, show full-page fallback
    if (hasFatalError && fatalError) {
      return (
        <GlobalErrorFallback
          error={fatalError}
          errorInfo={errorInfo}
          reset={this.handleReset}
          origin="React Render Error Boundary"
        />
      );
    }

    // 2. If user clicked to view any captured runtime error as full fallback
    if (activeModalError) {
      return (
        <GlobalErrorFallback
          error={activeModalError}
          reset={this.handleReset}
          origin={`Runtime Monitor (${activeModalError.eventType})`}
          onClose={() => this.setState({ activeModalError: null })}
          isModal={true}
        />
      );
    }

    const isFallbackVisible =
      hasFatalError ||
      Boolean(activeModalError) ||
      (typeof document !== "undefined" && Boolean(document.querySelector('[data-error-fallback="true"]')));

    // 3. Normal view with children + floating small errors monitor
    return (
      <>
        {this.props.children}

        {/* Floating Small Errors Alert Banner / Monitor */}
        {runtimeErrors.length > 0 && !isFallbackVisible && (
          <aside
            aria-label="Error Diagnostic Monitor"
            className="fixed bottom-4 right-4 z-[9999] max-w-md w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-5 duration-200"
          >
            <div className="bg-surface border-2 border-red/30 rounded-2xl shadow-2 p-4 text-ink overflow-hidden relative">
              {/* Top alert bar */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red" />
                  </span>
                  <span className="text-xs font-mono font-bold text-red uppercase tracking-wider">
                    {runtimeErrors.length} Small Error{runtimeErrors.length > 1 ? "s" : ""} Caught
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={this.handleClearAllRuntimeErrors}
                    className="text-[11px] text-ink-3 hover:text-ink px-2 py-0.5 rounded hover:bg-paper-2 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => this.handleDismissRuntimeError(runtimeErrors[0].id)}
                    className="text-ink-3 hover:text-ink p-1 rounded hover:bg-paper-2 transition-colors"
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Latest Caught Error Detail */}
              {runtimeErrors[0] && (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-red-tint text-red border border-red/20 inline-block mb-1">
                        {runtimeErrors[0].errorType}
                      </span>
                      <p className="text-xs font-mono text-ink-2 font-medium line-clamp-2">
                        {runtimeErrors[0].message}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-ink-3 font-mono flex items-center justify-between">
                    <span>
                      Loc: {runtimeErrors[0].where.file || runtimeErrors[0].where.route}
                      {runtimeErrors[0].where.line ? `:${runtimeErrors[0].where.line}` : ""}
                    </span>
                    <span className="text-red font-semibold">{runtimeErrors[0].errorCode}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => this.setState({ activeModalError: runtimeErrors[0] })}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red hover:bg-red/90 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
                    >
                      <Bug size={14} weight="bold" />
                      <span>View Full Fallback Page</span>
                    </button>

                    <button
                      onClick={this.toggleForceFullScreen}
                      title="If enabled, any small error will immediately open the full-screen fallback page"
                      className={`px-2.5 py-2 rounded-xl border text-[11px] font-mono transition-colors ${
                        forceFullScreenOnAnyError
                          ? "bg-red-tint border-red/40 text-red font-bold"
                          : "bg-surface-2 border-line text-ink-3 hover:text-ink"
                      }`}
                    >
                      {forceFullScreenOnAnyError ? "Auto-Full: ON" : "Auto-Full: OFF"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </>
    );
  }
}

/**
 * Functional wrapper for export
 */
export default function GlobalErrorBoundary({ children }) {
  return <GlobalErrorBoundaryClass>{children}</GlobalErrorBoundaryClass>;
}
