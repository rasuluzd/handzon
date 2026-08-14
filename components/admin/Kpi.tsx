/**
 * KPI-kort (ADMIN.md § 2). Endringen vises som `↑ +29,3 %` i status-open,
 * `↓ −4,1 %` i danger og `→ 0,0 %` i body-soft — alltid med en tekstlig
 * forklaring ved siden, aldri pil alene.
 */
export function Kpi({
  label,
  value,
  delta,
  hint,
  navy,
}: {
  label: string;
  value: string;
  /** Relativ endring, eller null når det ikke finnes sammenligningsgrunnlag. */
  delta?: number | null;
  hint: string;
  navy?: boolean;
}) {
  const direction =
    delta == null || Math.abs(delta) <= 0.005 ? "flat" : delta > 0 ? "up" : "down";
  const formatted =
    delta == null
      ? "—"
      : `${delta > 0 ? "+" : ""}${(delta * 100).toFixed(1).replace(".", ",")} %`;
  const arrow = direction === "up" ? "↑" : direction === "down" ? "↓" : "→";
  const tone =
    direction === "up"
      ? "text-status-open"
      : direction === "down"
        ? "text-danger"
        : "text-body-soft";

  return (
    /* Kompakt på telefon: kortene ligger to og to, og et 30px tall med 20px
       sidepadding sprengte en 170px kolonne. Med 22px og 14px padding får alle
       fire nøkkeltallene plass på én skjerm i stedet for fire. */
    <div
      className={`rounded-card-lg border px-3.5 py-3.5 admin-sm:px-5 admin-sm:py-[18px] ${navy ? "on-dark border-navy bg-navy" : "border-line-strong bg-surface"}`}
    >
      <p
        className={`font-heading text-[10.5px] font-semibold uppercase tracking-[.14em] admin-sm:text-[11px] admin-sm:tracking-[.16em] ${navy ? "text-on-navy-eyebrow" : "text-body-soft"}`}
      >
        {label}
      </p>
      <p
        className={`mt-2 font-heading text-[22px] font-bold leading-none tabular admin-sm:mt-2.5 admin-sm:text-[30px] ${navy ? "text-white" : "text-ink"}`}
      >
        {value}
      </p>
      <p
        className={`mt-1.5 flex flex-wrap items-center gap-x-[7px] text-[12px] leading-[1.35] admin-sm:mt-2 admin-sm:text-[13px] ${navy ? "text-on-navy" : "text-body-soft"}`}
      >
        {delta != null && (
          <span className={`font-heading font-bold tabular ${navy ? "" : tone}`}>
            {arrow} {formatted}
          </span>
        )}
        <span>{hint}</span>
      </p>
    </div>
  );
}
