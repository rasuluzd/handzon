import { formatKr, formatKrPlain } from "@/lib/format";

/**
 * Pris (COMPONENTS.md § Price). Barlow 700, tabular-nums, text-navy.
 *
 * Beløp oppgis i ØRE — repoets domenevaluta — ikke i kroner som i handoff-
 * eksemplene, så det ikke kan blandes med `priceOre` fra datamodellen.
 *
 *   <Price ore={149000} from />              fra 1 490,-
 *   <Price ore={999000} size={28} />         9 990,-  (feature)
 *   <Price ore={134100} was={149000} />      overstrøket kjedepris + medlemspris
 *   <Price ore={244000} plain vat />         2 440 kr inkl. mva
 *
 * `vat` er påkrevd på hver totalsum.
 */
export function Price({
  ore,
  from,
  was,
  size = 22,
  sizeClass,
  plain,
  vat,
  className,
}: {
  ore: number;
  /** «fra» foran prisen når prisen varierer per avdeling. */
  from?: boolean;
  /** Kjedepris som overstrykes over medlems-/lokalprisen. */
  was?: number;
  /** Fontstørrelse i px (22 inline, 28 feature). */
  size?: number;
  /**
   * Erstatter `size` når størrelsen må variere med skjermbredden — en inline
   * `fontSize` kan ikke overstyres av en `hz:`-klasse utenfra.
   * F.eks. `"text-[19px] hz:text-[22px]"`.
   */
  sizeClass?: string;
  /** « kr» i stedet for «,-» — kvitteringer og tabeller. */
  plain?: boolean;
  /** Legger på «inkl. mva» — påkrevd på hver totalsum. */
  vat?: boolean;
  className?: string;
}) {
  const format = plain ? formatKrPlain : formatKr;
  return (
    <span className={["inline-flex flex-col items-end", className].filter(Boolean).join(" ")}>
      {was !== undefined && was !== ore && (
        <span className="tabular text-[13px] leading-tight text-body-soft line-through">
          {format(was)}
        </span>
      )}
      <span
        className={["font-heading font-bold tabular text-navy", sizeClass]
          .filter(Boolean)
          .join(" ")}
        style={sizeClass ? undefined : { fontSize: size }}
      >
        {from && (
          <span className="mr-[5px] font-sans text-[13px] font-normal text-body-soft">
            fra
          </span>
        )}
        {format(ore)}
      </span>
      {vat && <span className="text-[12.5px] text-body-soft">inkl. mva</span>}
    </span>
  );
}
