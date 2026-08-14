/**
 * Statstripe (SCREENS.md § Forside punkt 2): fire celler på desktop, to på mobil,
 * med hårlinje mellom. Tallene er tabular.
 */
export function StatStrip({
  items,
  className,
}: {
  items: Array<[value: string, label: string]>;
  className?: string;
}) {
  return (
    <div
      /* Én rad med fire celler også på mobil. To rader à 94px var 189px
         vanity-tall rett under heroen — nå 78px, og tallene leses like godt. */
      className={["grid grid-cols-4 border-b border-line", className]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map(([value, label], index) => (
        <div
          key={label}
          className={[
            "px-2 py-3 hz:px-[clamp(16px,4vw,64px)] hz:py-[22px]",
            index > 0 ? "border-l border-line" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="block font-heading text-[19px] font-bold leading-none tabular text-navy hz:text-[29px]">
            {value}
          </span>
          <span className="mt-1 block text-[10.5px] leading-tight uppercase tracking-[.04em] text-body-soft hz:mt-1.5 hz:text-[12.5px] hz:tracking-[.06em]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
