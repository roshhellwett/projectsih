"use client";

import { useEffect } from "react";
import "./globals.css";
import GlobalErrorFallback from "@/components/error/GlobalErrorFallback";

/**
 * Root Global Error Boundary for Next.js App Router
 * Catches fatal errors occurring inside app/layout.js.
 * Must define its own <html> and <body> tags.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("[Next.js Root Global Error Intercepted]:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Fatal Error · SETU Collaboration Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <GlobalErrorFallback
          error={error}
          reset={reset}
          origin="Root Global Layout Error Boundary"
        />
      </body>
    </html>
  );
}
