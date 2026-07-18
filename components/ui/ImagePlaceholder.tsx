import type { ComponentProps } from "react";

/**
 * Nøytral bildeplassholder. Fotografi er bevisst plassholder i prototypen
 * (README: Assets) — byttes mot rolige, cinematiske bilpleiebilder i produksjon.
 * Holder en dempet, tilsiktet flate i stedet for en «manglende bilde»-boks.
 */
export function ImagePlaceholder({
  label,
  className = "",
  ...rest
}: { label?: string } & ComponentProps<"div">) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-[#eef1f5] to-[#e2e6ec] ${className}`}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {label ? (
        <span className="px-4 text-center font-heading text-sm font-medium tracking-wide text-muted-light">
          {label}
        </span>
      ) : null}
    </div>
  );
}
