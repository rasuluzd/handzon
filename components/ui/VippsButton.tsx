import type { ComponentProps } from "react";

/**
 * Vipps-knappen i Vipps' egen låsning (COMPONENTS.md § Vipps-knapp):
 * pille-radius (den ene i systemet), fast oransje, hvitt ordmerke, aldri
 * omfarget. Maks én per skjerm. Kontrasten hvit-på-oransje er Vipps' eget valg
 * og skal ikke justeres.
 */
export function VippsButton({
  label = "Logg inn med",
  block,
  className,
  ...rest
}: { label?: string; block?: boolean } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={[
        /* 44px og strammere padding på mobil: i full størrelse tvang knappen
           medlemsblokka i bookingens steg 3 til å brekke i to rader. */
        "inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full px-3.5",
        "hz:min-h-[48px] hz:gap-[9px] hz:px-[26px]",
        "bg-vipps text-white transition-colors duration-[120ms] ease-standard hover:bg-vipps-hover active:translate-y-px",
        block ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <span className="font-heading text-[13.5px] font-semibold hz:text-[16px]">{label}</span>
      <span className="inline-flex items-center font-heading text-[16px] font-bold tracking-[-.01em] hz:text-[19px]">
        Vipps
        <span
          aria-hidden
          className="ml-px inline-block size-2 -translate-y-[5px] rounded-full bg-white hz:size-[9px] hz:-translate-y-[6px]"
        />
      </span>
    </button>
  );
}
