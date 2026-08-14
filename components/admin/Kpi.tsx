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
    <div
      className={`rounded-card-lg border px-5 py-[18px] ${navy ? "on-dark border-navy bg-navy" : "border-line-strong bg-surface"}`}
    >
      <p
        className={`font-heading text-[11px] font-semibold uppercase tracking-[.16em] ${navy ? "text-on-navy-eyebrow" : "text-body-soft"}`}
      >
        {label}
      </p>
      <p
        className={`mt-2.5 font-heading text-[30px] font-bold leading-none tabular ${navy ? "text-white" : "text-ink"}`}
      >
        {value}
      </p>
      <p
        className={`mt-2 flex items-center gap-[7px] text-[13px] ${navy ? "text-on-navy" : "text-body-soft"}`}
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
