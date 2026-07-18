"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Subtil on-scroll reveal (README: Motion). Én IntersectionObserver ser alle
 * `[data-reveal]`-seksjoner og legger på `is-visible` når de kommer i view.
 * Selve skjulingen skjer i CSS (`.js [data-reveal]`), så innhold vises alltid
 * uten JS. Re-skanner ved ruteendring.
 */
export function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    elements.forEach((element, index) => {
      // Liten stagger, som i prototypen.
      element.style.transitionDelay = `${(index % 5) * 0.04}s`;
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
