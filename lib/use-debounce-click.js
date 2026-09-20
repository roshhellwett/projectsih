"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Hook to prevent rapid repeat taps, double-clicks, and spam on buttons.
 * Enforces a minimum interval between triggers and locks execution while
 * an async promise is in-flight.
 *
 * @param {Function} action - The async or sync callback to execute
 * @param {number} delayMs - Minimum cooldown delay in ms (default: 450ms)
 * @returns {[Function, boolean]} - [guardedHandler, isPending]
 */
export function useDebouncedClick(action, delayMs = 450) {
  const [isPending, setIsPending] = useState(false);
  const lastClickRef = useRef(0);
  const isPendingRef = useRef(false);

  const guardedHandler = useCallback(
    async (...args) => {
      const now = Date.now();

      // Block if action is currently in-flight
      if (isPendingRef.current) {
        return;
      }

      // Block if within debounce cooldown period
      if (now - lastClickRef.current < delayMs) {
        return;
      }

      lastClickRef.current = now;
      isPendingRef.current = true;
      setIsPending(true);

      try {
        const result = await Promise.resolve(action(...args));
        return result;
      } finally {
        // Enforce a small grace delay before unlocking to avoid double tap bounce
        setTimeout(() => {
          isPendingRef.current = false;
          setIsPending(false);
        }, Math.max(100, delayMs - (Date.now() - now)));
      }
    },
    [action, delayMs]
  );

  return [guardedHandler, isPending];
}
