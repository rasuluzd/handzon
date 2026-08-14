"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Teller et beløp opp eller ned når summen endrer seg (MOTION.md § Summen):
 * 340 ms, easeOutCubic, via requestAnimationFrame. Respekterer
 * `prefers-reduced-motion` ved å hoppe rett til målet.
 */
export function useCountUp(target: number, duration = 340): number {
  const [value, setValue] = useState(target);
  const shown = useRef(target);

  useEffect(() => {
    shown.current = value;
  }, [value]);

  useEffect(() => {
    const from = shown.current;
    if (from === target) return;
    // Reduced motion hopper rett til målet ved å gi animasjonen null varighet.
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const span = reduced ? 0 : duration;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = span <= 0 ? 1 : Math.min(1, (now - start) / span);
      setValue(Math.round(from + (target - from) * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
