"use client";

import { Check, Info } from "lucide-react";
import type { Toast } from "@/app/admin/admin-context";

/** Toast nederst til høyre, auto-lukk etter 5 s (MOTION.md § Adminpanelet). */
export function Toasts({
  items,
  dismiss,
}: {
  items: Toast[];
  dismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[90] flex max-w-[360px] flex-col gap-2.5"
    >
      {items.map((item) => {
        const Icon = item.variant === "info" ? Info : Check;
        return (
          <div
            key={item.id}
            className="flex items-start gap-[11px] rounded-card border border-line-strong bg-surface px-4 py-3.5 shadow-pop"
          >
            <Icon
              aria-hidden
              className={`mt-px size-[19px] shrink-0 ${item.variant === "info" ? "text-navy" : "text-status-open"}`}
              strokeWidth={1.75}
            />
            <div className="min-w-0">
              <p className="font-heading text-[14.5px] font-semibold text-ink">{item.title}</p>
              {item.text && (
                <p className="text-[13px] leading-[1.45] text-body-soft">{item.text}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Lukk melding"
              className="ml-auto shrink-0 px-1 text-[16px] leading-none text-body-soft hover:text-navy"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
