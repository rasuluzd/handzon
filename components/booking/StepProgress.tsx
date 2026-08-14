/**
 * Bookingflytens 7-segments progresjon (code/step-progress.tsx.txt). Stegene er
 * LÅST — de slås aldri sammen og kan aldri hoppes over.
 *
 * Aktivt segment får navy fyll + 3px navy-14 glød. Ferdige segmenter er heldekket
 * navy. Kommende er --color-line-strong.
 */
export const BOOKING_STEPS = [
  "Avdeling",
  "Bilen din",
  "Tjeneste",
  "Tidspunkt",
  "Tillegg",
  "Oppsummering",
  "Bekreftelse",
] as const;

export function StepProgress({ step }: { step: number }) {
  return (
    <>
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={BOOKING_STEPS.length}
        aria-label={`Steg ${step} av ${BOOKING_STEPS.length} — ${BOOKING_STEPS[step - 1]}`}
        className="flex gap-1.5"
      >
        {BOOKING_STEPS.map((label, i) => (
          <span
            key={label}
            className={[
              "block h-[5px] flex-1 rounded-[3px] transition-colors duration-200",
              i + 1 < step ? "bg-navy" : "",
              // Fyllet i gjeldende segment vokser fra scaleX(0) (MOTION.md).
              i + 1 === step
                ? "hz-fill bg-line-strong shadow-[0_0_0_3px_var(--color-navy-14)]"
                : "",
              i + 1 > step ? "bg-line-strong" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>
      {/* Etikettraden er desktop-only. På mobil gjentok den venstre side
          stegnavnet som står i h1-en rett under, og «Steg 1 av 7» fortalte
          kunden at det gjenstår seks steg før hun har sett en pris — et kjent
          frafallssignal. Fremdriftsstripa viser det samme uten å si det. */}
      <div className="mt-3 hidden justify-between font-heading text-[12px] uppercase tracking-[.14em] hz:flex">
        <span className="font-semibold text-navy">{BOOKING_STEPS[step - 1]}</span>
        <span className="tabular tracking-[.06em] text-body-soft">
          Steg {step} av {BOOKING_STEPS.length}
        </span>
      </div>
    </>
  );
}
