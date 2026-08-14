"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

/**
 * Redigeringspanel (drawer). Skyves inn fra høyre, bakteppe
 * `rgba(14,22,38,.55)` + blur(4px). Escape lukker (MOTION.md § Adminpanelet).
 */
export function Panel({
  title,
  sub,
  onClose,
  foot,
  children,
}: {
  title: string;
  sub?: string;
  onClose: () => void;
  foot?: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-[rgba(14,22,38,.55)] backdrop-blur-[4px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="hz-sheet fixed inset-y-0 right-0 z-[80] flex w-[min(560px,100%)] flex-col bg-surface shadow-pop"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="font-heading text-[20px] font-bold leading-[1.2] text-ink">{title}</p>
            {sub && <p className="mt-1 text-[13.5px] text-body-soft">{sub}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Lukk"
            className="shrink-0 px-1.5 py-0.5 text-[24px] leading-none text-body-soft hover:text-navy"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-[22px]">{children}</div>
        {foot && (
          <div className="flex items-center gap-2.5 border-t border-line bg-surface-alt px-6 py-3.5">
            {foot}
          </div>
        )}
      </div>
    </>
  );
}
