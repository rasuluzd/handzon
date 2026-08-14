import { Check } from "lucide-react";

/**
 * Kundeklubb-stempelkort (5+1): fem fylte stempler + et fremhevet «GRATIS»-felt.
 * Ment å ligge på en marineblå flate. Selve raden er dekorativ (`aria-hidden`);
 * en `sr-only`-setning formidler status for skjermlesere.
 */
export function StampCard({
  filled = 5,
  total = 5,
  className = "",
}: {
  filled?: number;
  total?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {/* Stemplene er 38px på mobil og 44px fra 900px. Fem 44px-sirkler pluss
          GRATIS-pilla måler 360px — bredere enn de 298px et navy-panel har på
          en 390px skjerm — og raden brøt til to linjer midt i metaforen. */}
      <div className="flex flex-nowrap items-center gap-2 hz:gap-2.5" aria-hidden>
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={`grid size-9 shrink-0 place-items-center rounded-full hz:size-11 ${
              index < filled ? "bg-white/14 text-on-navy-bright" : "bg-white/6 text-on-navy-soft"
            }`}
          >
            <Check className="size-4 hz:size-[18px]" strokeWidth={1.75} />
          </span>
        ))}
        <span className="grid h-9 shrink-0 place-items-center rounded-full bg-white px-3 font-heading text-[11.5px] font-bold tracking-[.06em] text-navy shadow-[0_0_0_3px_rgba(255,255,255,.28)] hz:h-11 hz:px-[18px] hz:text-[13px]">
          GRATIS
        </span>
      </div>
      <span className="sr-only">
        {filled} av {total + 1} stempler fylt — {filled >= total ? "neste" : `etter ${total - filled} vasker til er neste`} utvendige Basic-vask gratis.
      </span>
    </div>
  );
}
