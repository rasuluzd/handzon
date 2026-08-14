import type { ReactNode } from "react";

/**
 * Tom tilstand (COMPONENTS.md § EmptyState) — alltid med en vei videre.
 * Ikonet er dekorativt og skal sendes inn med `aria-hidden`.
 */
export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon?: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-card-lg bg-surface-alt px-6 py-11 text-center">
      {icon && <span className="text-muted-light">{icon}</span>}
      <p className="font-heading text-[19px] font-semibold text-ink">{title}</p>
      <p className="max-w-[42ch] text-[15px] text-body-soft">{text}</p>
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  );
}
