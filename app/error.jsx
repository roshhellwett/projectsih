"use client";

import { useEffect } from "react";
import GlobalErrorFallback from "@/components/error/GlobalErrorFallback";

/**
 * Route-level Error Boundary for Next.js App Router
 * Catches errors thrown inside page components and route segments.
 */
export default function RouteError({ error, reset }) {
  useEffect(() => {
    // Log route-level error
    console.error("[Next.js Route Error Intercepted]:", error);
  }, [error]);

  return (
    <GlobalErrorFallback
      error={error}
      reset={reset}
      origin="Route Segment Error Boundary"
    />
  );
}
