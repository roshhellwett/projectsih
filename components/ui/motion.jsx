"use client";

import { useEffect, useRef, useState } from "react";

/** Reveals children with a short rise-and-fade when scrolled into view. */
export function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Counts up to a numeric value when scrolled into view. Non-numeric values render as-is. */
export function CountUp({ value, duration = 1100, className = "" }) {
  const ref = useRef(null);
  const raw = String(value ?? "");
  const match = raw.match(/-?\d+(\.\d+)?/);
  const target = match ? parseFloat(match[0]) : null;
  const prefix = match ? raw.slice(0, match.index) : "";
  const suffix = match ? raw.slice(match.index + match[0].length) : "";
  const [n, setN] = useState(target === null ? null : 0);

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setN(target);
      return;
    }
    let frame;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(target * eased);
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  if (target === null) return <span className={className}>{raw}</span>;

  const decimals = match[0].includes(".") ? 1 : 0;
  return (
    <span ref={ref} className={className}>
      {prefix}
      {(n ?? 0).toFixed(decimals)}
      {suffix}
    </span>
  );
}
