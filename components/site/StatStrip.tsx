/**
 * Statstripe (SCREENS.md § Forside punkt 2): fire celler på desktop, to på mobil,
 * med hårlinje mellom. Tallene er tabular.
 *
 * Mobil er 2×2 og SENTRERT. Fire celler på én rad ga 97px per celle på en 390px
 * skjerm: «120 000+» måtte ned i 19px for å få plass, «biler behandlet» brakk til
 * to linjer, og venstrestilt tekst i så smale celler leste som fire avkuttede
 * kolonner i stedet for fire nøkkeltall. To rader koster ~60px mer og gjør
 * tallene lesbare — som er hele poenget med dem.
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
      className={["grid grid-cols-2 border-b border-line hz:grid-cols-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map(([value, label], index) => (
        <div
          key={label}
          className={[
            "px-3 py-3.5 text-center hz:px-[clamp(16px,4vw,64px)] hz:py-[22px] hz:text-left",
            // Mobil: hårlinje mellom kolonnene og mellom de to radene.
            index % 2 === 1 ? "border-l border-line" : "",
            index >= 2 ? "border-t border-line hz:border-t-0" : "",
            // Desktop: én rad, hårlinje mellom alle fire.
            index > 0 ? "hz:border-l hz:border-line" : "hz:border-l-0",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="block font-heading text-[23px] font-bold leading-none tabular text-navy hz:text-[29px]">
            {value}
          </span>
          <span className="mt-1.5 block text-[11.5px] leading-tight uppercase tracking-[.06em] text-body-soft hz:text-[12.5px]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
