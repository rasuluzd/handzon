"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Tick } from "@/components/ui/Card";
import { formatKr } from "@/lib/format";

/**
 * Bookingflytens arbeidshest (COMPONENTS.md § Row): bilde, navn med merkelapper,
 * beskrivelse, meta, pris og hake. Valgt rad får 2px navy kant og 1px mindre
 * padding, så boksen ikke hopper.
 */
export function OptionRow({
  image,
  title,
  tags,
  description,
  meta,
  priceOre,
  wasOre,
  pricePrefix,
  selected,
  disabled,
  onClick,
}: {
  image?: string;
  title: string;
  tags?: ReactNode;
  description?: string;
  meta?: string;
  priceOre?: number;
  wasOre?: number;
  pricePrefix?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "flex w-full items-center gap-3 rounded-card bg-surface text-left hz:gap-[15px]",
        "transition-[border-color,background-color] duration-[120ms] ease-standard",
        selected
          ? "border-2 border-navy bg-navy-06 p-2.5 hz:p-3"
          : "border border-line-strong p-[11px] hover:border-navy hover:bg-navy-06 hz:p-[13px]",
        disabled ? "cursor-not-allowed opacity-50 hover:border-line-strong hover:bg-surface" : "cursor-pointer",
      ].join(" ")}
    >
      {image && (
        <Image
          src={image}
          alt=""
          width={70}
          height={70}
          sizes="(min-width: 900px) 70px, 54px"
          className="size-[54px] shrink-0 rounded-control object-cover hz:size-[70px]"
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 hz:gap-2.5">
          <span className="font-heading text-[15.5px] font-semibold leading-[1.2] text-ink hz:text-[17px] hz:leading-[1.25]">
            {title}
          </span>
          {tags}
        </span>
        {description && (
          <span className="mt-0.5 line-clamp-2 block text-[13px] leading-[1.35] text-body-soft hz:mt-1 hz:line-clamp-none hz:text-[13.5px] hz:leading-[1.45]">
            {description}
          </span>
        )}
        {/* På mobil ligger pris og varighet på samme linje under tittelen i
            stedet for i en egen kolonne. Med bilde, priskolonne og hake alle
            `shrink-0` fikk tekstkolonnen bare ~108px på en 390px skjerm, og
            tjenestenavnet brakk til fire linjer. */}
        <span className="mt-1 flex flex-wrap items-baseline gap-x-2 hz:mt-1.5">
          {priceOre !== undefined && (
            <span
              key={`${priceOre}-${wasOre ?? ""}`}
              className="hz-fade font-heading tabular hz:hidden"
            >
              {wasOre !== undefined && wasOre !== priceOre && (
                <s className="mr-1.5 text-[12.5px] font-medium text-body-soft">
                  {formatKr(wasOre)}
                </s>
              )}
              <b
                className={`text-[16px] font-bold ${selected ? "text-navy" : "text-ink"}`}
              >
                {pricePrefix}
                {formatKr(priceOre)}
              </b>
            </span>
          )}
          {meta && (
            <span className="font-heading text-[11px] font-semibold uppercase tracking-[.1em] text-body-soft hz:mt-1.5 hz:block hz:text-[11.5px] hz:tracking-[.12em]">
              {meta}
            </span>
          )}
        </span>
      </span>
      {priceOre !== undefined && (
        // Nøklet på beløpet: priskolonnen toner inn når verdien endrer seg
        // (medlemspris slås på i steg 3) — MOTION.md § Medlemsprisen.
        <span
          key={`${priceOre}-${wasOre ?? ""}`}
          className="hz-fade hidden shrink-0 text-right font-heading tabular hz:block"
        >
          {wasOre !== undefined && wasOre !== priceOre && (
            <s className="block text-[13px] font-medium text-body-soft">{formatKr(wasOre)}</s>
          )}
          <b
            className={`block text-[19px] font-bold leading-[1.2] ${selected ? "text-navy" : "text-ink"}`}
          >
            {pricePrefix}
            {formatKr(priceOre)}
          </b>
        </span>
      )}
      <Tick on={selected} />
    </button>
  );
}
