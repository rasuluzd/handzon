"use client";

import { useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { locations } from "@/lib/mock-data";

type Field = "navn" | "epost" | "telefon" | "type" | "avdeling" | "melding" | "samtykke";

const henvendelsestyper = [
  "Endring av booking",
  "Generell forespørsel",
  "Reklamasjon",
  "Samarbeid / presse",
  "Annet",
] as const;

const inputBase =
  "w-full min-h-[46px] rounded-control border bg-surface px-3.5 py-[11px] text-[16px] text-ink outline-none " +
  "transition-[border-color,box-shadow] placeholder:text-body-soft focus:border-navy focus:shadow-[0_0_0_3px_var(--color-navy-14)]";

const labelCls = "mb-[7px] block font-heading text-[13px] font-semibold text-body-strong";

function borderFor(hasError: boolean) {
  return hasError ? "border-danger bg-danger-bg" : "border-line-heavy";
}

export function KontaktForm() {
  const uid = useId();
  const [values, setValues] = useState({
    navn: "",
    epost: "",
    telefon: "",
    type: "",
    avdeling: "",
    melding: "",
    samtykke: false,
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  /* Skjemaet er ~750px høyt på mobil, så «Send melding» ligger nederst mens
     feilen typisk er «Navn» eller «E-post» langt over skjermkanten. Uten
     disse refene setter en mislykket innsending bare tekst brukeren aldri
     ser — knappen ser ut som den er død. Fokus flyttes i hendelses-
     håndtereren, aldri i en effekt. */
  const fieldRefs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  function bindField(field: Field) {
    return (el: HTMLElement | null) => {
      fieldRefs.current[field] = el;
    };
  }

  function update(field: Field, value: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const next: Partial<Record<Field, string>> = {};
    if (!values.navn.trim()) next.navn = "Fyll inn navnet ditt.";
    if (!values.epost.trim()) {
      next.epost = "Fyll inn e-postadressen din.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.epost.trim())) {
      next.epost = "Sjekk at e-postadressen er riktig.";
    }
    if (!values.type) next.type = "Velg hva henvendelsen gjelder.";
    if (!values.melding.trim()) next.melding = "Skriv en kort melding.";
    if (!values.samtykke) next.samtykke = "Du må samtykke for at vi kan svare deg.";
    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // Demo: ingen ekte innsending — vi viser bare en bekreftelse.
      setSent(true);
      return;
    }
    /* validate() fyller feilene i samme rekkefølge som feltene står, så
       første nøkkel er også det øverste feltet med feil. Fokus først uten
       hopp, deretter myk rulling — bevegelsen er selve tilbakemeldingen. */
    const first = Object.keys(next)[0] as Field;
    const el = fieldRefs.current[first];
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  if (sent) {
    return (
      <Card elevated role="status">
        <span
          aria-hidden
          className="mb-4 grid size-12 place-items-center rounded-full bg-status-open-bg text-status-open"
        >
          <Check className="size-6" strokeWidth={1.75} />
        </span>
        <h2 className="mb-2 font-heading text-[21px] font-bold text-ink hz:text-[23px]">
          Takk, {values.navn.trim().split(" ")[0] || "vi har mottatt meldingen"}.
        </h2>
        <p className="max-w-[48ch] text-[16px] leading-[1.5] text-body-soft hz:text-[16.5px] hz:leading-[1.55]">
          Meldingen din er registrert. En av avdelingene tar kontakt på{" "}
          <span className="font-semibold text-ink">{values.epost.trim()}</span> så snart som
          mulig — vanligvis innen én til to virkedager.
        </p>
        <p className="mt-3.5 rounded-control bg-surface-alt px-4 py-3 text-[13.5px] leading-[1.5] text-body-soft">
          Dette er en demo — ingen melding blir faktisk sendt.
        </p>
        <div className="mt-4 flex flex-col items-start gap-2 hz:flex-row hz:items-center hz:gap-3">
          {/* Kvitteringen var en blindvei. Den som venter på svar kan like
              gjerne sikre seg en time i mellomtiden — men ikke den som nettopp
              meldte en reklamasjon. */}
          {values.type !== "Reklamasjon" && (
            <ButtonLink href="/booking" size="lg" className="max-hz:w-full">
              Bestill time
            </ButtonLink>
          )}
          <Button
            variant="ghost"
            className="!px-0 hz:!px-3"
            onClick={() => {
              setValues({
                navn: "",
                epost: "",
                telefon: "",
                type: "",
                avdeling: "",
                melding: "",
                samtykke: false,
              });
              setSent(false);
            }}
          >
            Send en ny melding
          </Button>
        </div>
      </Card>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <Card elevated>
      {/* 20px mellom sju feltgrupper er desktop-luft. På 390px er det ren
          rullehøyde mellom brukeren og «Send melding». */}
      <form noValidate onSubmit={handleSubmit} className="grid gap-4 hz:gap-5">
        <div>
          <label htmlFor={`${uid}-navn`} className={labelCls}>
            Navn
          </label>
          <input
            id={`${uid}-navn`}
            ref={bindField("navn")}
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            value={values.navn}
            onChange={(event) => update("navn", event.target.value)}
            aria-invalid={Boolean(errors.navn)}
            aria-describedby={errors.navn ? `${uid}-navn-err` : undefined}
            className={`${inputBase} ${borderFor(Boolean(errors.navn))}`}
          />
          {errors.navn && (
            <p id={`${uid}-navn-err`} className="mt-1.5 text-[13.5px] text-danger">
              {errors.navn}
            </p>
          )}
        </div>

        <div className="grid gap-4 hz:grid-cols-2 hz:gap-5">
          <div>
            <label htmlFor={`${uid}-epost`} className={labelCls}>
              E-post
            </label>
            <input
              id={`${uid}-epost`}
              ref={bindField("epost")}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={values.epost}
              onChange={(event) => update("epost", event.target.value)}
              aria-invalid={Boolean(errors.epost)}
              aria-describedby={errors.epost ? `${uid}-epost-err` : undefined}
              className={`${inputBase} ${borderFor(Boolean(errors.epost))}`}
            />
            {errors.epost && (
              <p id={`${uid}-epost-err`} className="mt-1.5 text-[13.5px] text-danger">
                {errors.epost}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={`${uid}-telefon`} className={labelCls}>
              Telefon <span className="font-sans font-normal text-body-soft">(valgfritt)</span>
            </label>
            <input
              id={`${uid}-telefon`}
              ref={bindField("telefon")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.telefon}
              onChange={(event) => update("telefon", event.target.value)}
              className={`${inputBase} border-line-heavy`}
            />
          </div>
        </div>

        <div className="grid gap-4 hz:grid-cols-2 hz:gap-5">
          <div>
            <label htmlFor={`${uid}-type`} className={labelCls}>
              Hva gjelder det?
            </label>
            <select
              id={`${uid}-type`}
              ref={bindField("type")}
              value={values.type}
              onChange={(event) => update("type", event.target.value)}
              aria-invalid={Boolean(errors.type)}
              aria-describedby={errors.type ? `${uid}-type-err` : undefined}
              className={`${inputBase} ${borderFor(Boolean(errors.type))} ${values.type ? "" : "text-body-soft"}`}
            >
              <option value="" disabled>
                Velg type henvendelse
              </option>
              {henvendelsestyper.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p id={`${uid}-type-err`} className="mt-1.5 text-[13.5px] text-danger">
                {errors.type}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={`${uid}-avdeling`} className={labelCls}>
              Avdeling{" "}
              <span className="font-sans font-normal text-body-soft">(valgfritt)</span>
            </label>
            <select
              id={`${uid}-avdeling`}
              ref={bindField("avdeling")}
              value={values.avdeling}
              onChange={(event) => update("avdeling", event.target.value)}
              className={`${inputBase} border-line-heavy ${values.avdeling ? "" : "text-body-soft"}`}
            >
              <option value="">Gjelder kjeden / ikke sikker</option>
              {locations.map((location) => (
                <option key={location.slug} value={location.slug}>
                  Handz On {location.name} ({location.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={`${uid}-melding`} className={labelCls}>
            Melding
          </label>
          {/* Fire rader på mobil i stedet for fem: feltet kan dras større,
              og 24px spart her er 24px nærmere sendeknappen. */}
          <textarea
            id={`${uid}-melding`}
            ref={bindField("melding")}
            rows={4}
            value={values.melding}
            onChange={(event) => update("melding", event.target.value)}
            aria-invalid={Boolean(errors.melding)}
            aria-describedby={errors.melding ? `${uid}-melding-err` : undefined}
            className={`${inputBase} min-h-[104px] resize-y leading-[1.5] hz:min-h-[132px] ${borderFor(Boolean(errors.melding))}`}
          />
          {errors.melding && (
            <p id={`${uid}-melding-err`} className="mt-1.5 text-[13.5px] text-danger">
              {errors.melding}
            </p>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 py-1">
            <input
              ref={bindField("samtykke")}
              type="checkbox"
              checked={values.samtykke}
              onChange={(event) => update("samtykke", event.target.checked)}
              aria-invalid={Boolean(errors.samtykke)}
              aria-describedby={errors.samtykke ? `${uid}-samtykke-err` : undefined}
              className="mt-0.5 size-5 shrink-0 accent-navy"
            />
            <span className="text-[14.5px] leading-[1.5] text-body-soft">
              Jeg samtykker til at Handz On lagrer opplysningene mine for å kunne svare på
              henvendelsen. Se personvernerklæringen.
            </span>
          </label>
          {errors.samtykke && (
            <p id={`${uid}-samtykke-err`} className="mt-1.5 text-[13.5px] text-danger">
              {errors.samtykke}
            </p>
          )}
        </div>

        {/* Oppsummeringen står der fingeren er i det brukeren trykker, mens
            fokus samtidig flyttes opp til første felt med feil. Uten den er
            eneste tilbakemelding en rulling brukeren ikke ba om. */}
        {errorCount > 0 && (
          <p
            role="alert"
            className="rounded-control border border-danger bg-danger-bg px-4 py-3 text-[14.5px] leading-[1.5] text-danger"
          >
            {errorCount === 1
              ? "Ett felt må rettes før du kan sende. Vi har hoppet opp til det."
              : `${errorCount} felt må rettes før du kan sende. Vi har hoppet opp til det første.`}
          </p>
        )}

        <div className="grid gap-2.5 hz:justify-items-start">
          <Button type="submit" size="lg">
            Send melding
          </Button>
          {/* Svartiden hører hjemme ved knappen, ikke bare i metadata — det er
              der brukeren bestemmer seg for om det er verdt å sende. */}
          <p className="text-[13.5px] leading-[1.5] text-body-soft">
            Vi svarer vanligvis innen én til to virkedager.
          </p>
        </div>
      </form>
    </Card>
  );
}
