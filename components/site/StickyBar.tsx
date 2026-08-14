import type { ReactNode } from "react";

/**
 * Sticky bunnbar (COMPONENTS.md § Sticky bunnbar). Skygge oppover.
 * Innholdet over må ha `pb-[100px]`–`pb-[120px]` så baren ikke dekker siste rad.
 *
 * Baren er `sticky` og ikke `fixed`, fordi hele appen ligger i en 1180px-container
 * mot canvas — en fixed bar ville strukket seg ut over containerkanten.
 */
export function StickyBar({
  maxWidth = 720,
  children,
}: {
  maxWidth?: number;
  children: ReactNode;
}) {
  return (
    <div className="hz-rise sticky bottom-0 z-30 border-t border-line bg-surface px-[clamp(16px,4vw,64px)] pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-sticky">
      <div
        className="mx-auto flex flex-nowrap items-center gap-3 hz:flex-wrap hz:gap-4"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
