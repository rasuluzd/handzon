# Handoff: Dagsverkstedet → `handzon`-repoet

## Oversikt

Dette er implementasjonspakken for art direction-retningen **Dagsverkstedet** —
den lyse varianten av retning A som ble valgt. Den dekker to flater:

**Kundeflaten** — forside, tjenestekatalog, tjeneste-detalj, avdelingsoversikt,
avdelingsside, om oss, den 7-stegs bookingflyten og «Min side».

**Adminpanelet** — oversikt, bestillinger med statusflyt, salgsrapport for
dag/uke/måned/år per avdeling eller hele kjeden, tjeneste- og prisredigering med
lokalpriser, og bloggverktøy. Dette er en **ny flate** som ikke finnes i repoet i
dag; spesifikasjonen ligger i `ADMIN.md`.

Målet er **ikke** å bytte ut rammeverket. Repoet er allerede Next.js 16 +
TypeScript + Tailwind 4, og filstrukturen matcher skjermene én-til-én. Jobben er
å bytte ut *utformingen* i de filene som allerede finnes.

## Om designfilene i denne pakken

Filene under `design/` er **designreferanser skrevet i HTML/JSX** — prototyper
som viser tiltenkt utseende og oppførsel. De er ikke produksjonskode og skal ikke
kopieres rett inn. De kjører på plain React + Babel i nettleseren, uten
byggesteg, fordi det er formatet designverktøyet leverer i.

Åpne **`design/index.html`** — den lenker til begge prototypene:

| Prototype | Fil |
|---|---|
| Kundeflaten | `design/ui_kits/dagsverkstedet/index.html` |
| Adminpanelet | `design/ui_kits/admin/index.html` |

Filendelsen på skjermfilene er `.jsx.txt`, ikke `.jsx`. Det er bevisst — de
hentes med `fetch()` på filnavn og skal ikke plukkes opp av noe byggesteg.

Filene under `code/` er noe annet: **ferdig TypeScript/Tailwind skrevet mot
dette repoets egne konvensjoner**, klar til å limes inn. Start der.

## Fidelity

**Hi-fi.** Farger, typografi, spacing, radius, skygger og tilstander er endelige
og målt. Kontrast er verifisert mot WCAG AA på alle skjermer (0 brudd). Gjenskap
pikselnært — ikke rund av verdier til nærmeste 4px, og ikke bytt til
Tailwind-defaults. Står det 13,5px, skriv `text-[13.5px]`.

---

## Slik gjør du det — fem PR-er

### PR 1 — Tokens (30 min, ingen visuell risiko)

Bytt ut `app/globals.css` med `code/globals.css`.

Alt er additivt bortsett fra to ting:

1. **`--color-status-open`** og **`--color-status-closed`** er nye navn på farger
   som før het noe annet i komponentene. De er også nedjustert i lyshet:
   `#2e7d53 → #236b45` og `#8a6d1f → #73591a`. Grunn: de gamle lå på 4,42:1 og
   4,30:1 mot sin egen bakgrunnstint og strøk AA for normal tekst.
2. **`--color-muted` og `--color-muted-light` skal ikke lenger brukes til tekst.**
   De måler 4,26:1 og 2,60:1 på hvit — begge under AA. All sekundær tekst skal på
   `--color-body-soft` (6,12:1). Behold de to tokenene til ikonstrek, hake-ringer
   og dekorative kanter.

Kjør dette for å finne stedene som må rettes:

```bash
rg -n "text-muted(-light)?\b" app components
```

Hver treff der klassen sitter på tekst → `text-body-soft`. Treff på `<svg>`,
`stroke-` eller ringer kan stå.

### PR 2 — Primitiver (2–3 timer)

| Fil | Handling |
|---|---|
| `components/ui/Button.tsx` | Erstatt med `code/button.tsx.txt` |
| `components/ui/Card.tsx` | Erstatt med `code/card.tsx.txt` |
| `components/ui/ImagePlaceholder.tsx` | **Slett.** Dagsverkstedet har ingen plassholdere — hvert kort har ekte foto fra `public/tjenester/` |

Nye filer:

| Fil | Fra |
|---|---|
| `components/ui/Tag.tsx` | Spesifikasjon i `COMPONENTS.md` § Tag |
| `components/ui/Price.tsx` | `COMPONENTS.md` § Price |
| `components/booking/StepProgress.tsx` | `code/step-progress.tsx.txt` |

Installer ikonpakken (repoet har ingen i dag — ikonografien er unicode-tegn):

```bash
npm i lucide-react
```

Brukte glyfer: `search`, `map-pin`, `check`, `shield-check`, `clock`, `car`,
`calendar`, `external-link`, `chevron-down`, `x`, `phone`. Strek 1.75, størrelse
16/18/20/24, farge `currentColor`.

**Piler og skilletegn forblir tekst** — `→`, `←`, `·`. De er typografi, ikke
ikoner, og settes i Barlow sammen med etiketten. Ingen emoji. `📍 Nær meg` i
dagens kode blir `<MapPin /> Nær meg`.

### PR 3 — Chrome + forside (1 dag)

| Fil | Handling |
|---|---|
| `components/site/Header.tsx` | Versaler i menylenkene (13px Barlow 600, `tracking-[.12em]`), aktiv rute får 2px navy understrek, sticky med `bg-surface/95 backdrop-blur-[12px]`, hårlinje under |
| `components/site/Footer.tsx` | **Navy flate** (`bg-navy`), hvit logo (`/logo-white.png`), 4 kolonner `1.5fr 1fr 1fr 1fr`, juridisk stripe skilt med `border-on-navy-hair`. Tekstfarger: overskrifter `text-on-navy-eyebrow`, lenker `text-on-navy` (hover `text-white`), juridisk `text-on-navy-soft` |
| `app/page.tsx` | Ny seksjonsrekkefølge — se `SCREENS.md` § Forside |
| `components/site/Hero.tsx` (ny) | `code/hero.tsx.txt` |

⚠ Juridisk stripe: bruk **ikke** `text-white/45`. Det måler 3,56:1 på navy og
strøk AA. `text-on-navy-soft` (#b7c6e4) gir 6,45:1.

### PR 4 — Bookingflyten (2–3 dager)

`app/booking/wizard.tsx` har allerede riktig reducer og riktige sju steg.
Behold logikken. Bytt utformingen per steg — `SCREENS.md` § Booking har
anatomi for hvert av dem.

Det som må stemme:

- Sticky topp-chrome: «← Tilbake» venstre (skjult på steg 1 og 7), logo midt, «Avbryt» høyre, deretter `StepProgress`.
- **Header og footer er skjult gjennom hele flyten.** Ingenting skal konkurrere med steget.
- Kolonnen kappes til `max-w-[720px]`, sentrert.
- Steg 5 har sticky bunnbar med løpende sum. Steg 2 og 6 har full-bredde primærknapp nederst i innholdet.
- Auto-advance på steg 1, 3 og 4 (valg → neste steg). Flytt fokus til nytt stegs `<h1>` og annonser med `aria-live="polite"`.
- Regnr-feltet: sentrert, Barlow 700, 30px, `tracking-[.26em]` + `indent-[.26em]`, auto-versaler, maks 7 tegn.

### PR 5 — Resten av sidene (2–3 dager)

| Repo-fil | Referanse |
|---|---|
| `app/tjenester/page.tsx` | `SCREENS.md` § Tjenester |
| `app/tjenester/[slug]/page.tsx` | § Tjeneste-detalj |
| `app/avdelinger/page.tsx` + `location-list.tsx` | § Avdelinger |
| `app/avdelinger/[slug]/page.tsx` | § Avdelingsside |
| `app/om-oss/page.tsx` | § Om oss |
| `app/min-side/min-side-client.tsx` | § Min side — **denne er godkjent som den er.** Bytt bare de to tekstfargene fra PR 1 og la layout og innhold stå |

`app/kontakt/`, `app/kundeklubb/` er ikke tegnet i denne retningen. Følg
mønstrene: `dg-pagehead` for topp, `dg-sec` for seksjoner, `Card elevated` for
nøkkelkort. `app/nyheter/` skal nå mates av bloggverktøyet i adminpanelet — se
PR 6.

### PR 6 — Adminpanelet (1–2 uker)

Ny flate, ingen eksisterende filer å bytte ut. Full spesifikasjon i **`ADMIN.md`**.

```
app/admin/
  layout.tsx                 Sidestolpe + toppbar-skall
  page.tsx                   Oversikt
  bestillinger/page.tsx      Dag for dag, statusflyt
  rapport/page.tsx           Salgsrapport — dag/uke/måned/år
  tjenester/page.tsx         Tjeneste- og prisredigering
  blogg/page.tsx             Blogg og nyheter
components/admin/
  Rail.tsx  Top.tsx  BranchPicker.tsx  Kpi.tsx  Chart.tsx
  Seg.tsx   Panel.tsx  Toast.tsx  Switch.tsx
lib/
  sales.ts                   Aggregering over Order[]
```

Tre ting må avklares med Handz On **før** dette bygges ferdig, fordi de endrer
datamodellen: rolledeling mellom franchisetaker og kjedekontor, om salgstallene
kommer fra kassesystemet eller bookingbasen, og om prisendringer skal godkjennes
sentralt. Se `ADMIN.md` § 0.

Rekkefølge inne i PR-en: skallet (sidestolpe + toppbar) → Oversikt →
Salgsrapport → Tjenester → Blogg → Bestillinger. Salgsrapporten er den som gir
mest verdi først; Bestillinger overlapper med driften de har i dag.

Aggregeringen i `design/ui_kits/admin/sales-data.js` er ren utregning over en
`Order[]` og kan løftes rett inn i `lib/sales.ts`. Selve ordregenereringen er
demodata og skal erstattes.

---

## Mobil — regelen som overstyrer alt

Ett brytepunkt: **900px**, som repoet allerede har som `hz:`.

Primærknappen bor i **nederste tredjedel** av skjermen. Ingen primær-CTA over
fold på mobil når skjermen har en flyt-oppgave. Konkret:

- Booking steg 5 og tjeneste-detalj: sticky bunnbar med `shadow-sticky` (skygge oppover).
- Booking steg 2, 6, 7: full-bredde primærknapp nederst i innholdet.
- Hero: kortet trekkes 44px opp over bildekanten, knappene er `flex-1` side ved side.
- Chip-rader og dag-velgeren scroller horisontalt med `snap-x snap-mandatory` + `.hz-scroll`.
- Minste trykkflate 44px.

Desktop er sekundært. Bygg mobilvisningen først i hver komponent.

---

## Bevegelse

Full tabell i **`MOTION.md`** — hver animasjon med varighet, utløser og hvor den
hører hjemme. Kortversjonen:

- Varighetene bor i `design/tokens/motion.css` (`--dur-page`, `--dur-fill`,
  `--dur-xfade`, `--page-shift`). Endre der, ikke i komponentene.
- **Sidebytte:** innholdet stiger 18 px og toner inn over 420 ms. Nav og footer
  står stille.
- **Bookingsteg:** retningsbevisst — framover fra høyre, tilbake fra venstre.
- Alt ligger bak `prefers-reduced-motion`, som en global regel. Ikke skriv egne
  unntak per komponent.
- Ingen bounce, ingen spring, ingen parallax.
- Tre forslag ble bygget og valgt bort (opptelling av statstripen, avriving av
  kvitteringen, zoom på hero). De står listet i `MOTION.md` — ikke legg dem inn
  uten at Handz On ber om det.

---

## Innhold og språk

Ikke oversett, ikke omskriv. Reglene som gjelder hver streng:

- **Norsk bokmål.** Ingen engelske ord i UI — «Bestill time», ikke «Book now».
- **Du-form** til kunden, **vi-form** om kjeden.
- **Sentence case** overalt. VERSALER kun i eyebrows og knappelabels.
- Pris: `1 490,-` i markedsføring, `1 490 kr` i kvitteringer. **«fra» foran pris**
  når prisen varierer per avdeling. **«inkl. mva» på hver totalsum.**
- Mva-linjen med to desimaler: «Herav mva. (25 %) 488,00 kr».
- Varighet: «30 min», «1 t 15 min», «ca. 5 t».
- Referanse: `HOAC-4271`. Regnr: `EB12345` (versaler, uten mellomrom).
- Tall i kolonne: `tabular-nums` (klassen `.tabular`).
- Knappetekst er verb + objekt: «Hent bilinfo», «Dette stemmer — gå videre»,
  «Gå videre uten tillegg», «Bekreft bestilling – 2 440,-».
- Feil har alltid vei videre: «Vi fikk ikke svar fra motorvognregisteret. Fyll inn
  bilinfo manuelt, så går bestillingen like fint.»

Full gjennomgang med flere eksempler: `CONTENT.md`.

---

## Kart

Repoet har `components/site/GoogleBranchMap.tsx`. Behold den. Demoen bruker
OpenStreetMap kun fordi den ikke har nøkkelen deres.

Forsiden trenger et oversiktskart over alle 14 (zoom 5, hele Norge), avdelingssiden
et enkeltkart (zoom 15). Toning: `filter: saturate(.55) contrast(1.05)` så kartet
ikke konkurrerer med navy.

## Assets

Alt ligger allerede i repoet under `public/` — ingenting nytt skal lages.

| Fil | Bruk |
|---|---|
| `public/logo-original.webp` | Header, booking-chrome, lyse flater |
| `public/logo-white.png` | Navy footer, kvitteringens topplinje |
| `public/tjenester/*.webp` | Tjeneste-detaljens fullbleed topp, hero |
| `public/tjenester/*-thumb.webp` | Kortminiatyrer, bookingrader |
| `public/hero-hjulskift.webp` | Dekk & Felg-tjenestene |
| `public/om-oss/detaljering.webp` | Om oss-banner, sesongkampanje |

Fotografiet byttes til Cowork-bilder når de er klare. Behold filnavnene, så
følger alt annet med.

## Filer i denne pakken

```
README.md          Denne filen — start her
TOKENS.md          Hver token med hex, Tailwind-klasse og hvor den brukes
COMPONENTS.md      Anatomi for hver primitiv, med tilstander og målverdier
SCREENS.md         Kundeflaten skjerm for skjerm: layout, seksjoner, copy
ADMIN.md           Adminpanelet skjerm for skjerm, med datamodell
MOTION.md          Hver animasjon med varighet, utløser og plassering
CONTENT.md         Språkregler med eksempler
code/              Ferdig TypeScript/Tailwind — lim inn direkte
design/            Prototypene. Åpne design/index.html
  ui_kits/dagsverkstedet/   Kundeflaten
  ui_kits/admin/            Adminpanelet
  tokens/ components/       Kildestilene prototypene bruker
assets/            Logo og foto (identiske med repoets public/)
```

Åpne `design/index.html` i en nettleser for å klikke gjennom begge flatene mens
du implementerer. Alt der er ekte innhold — ekte tjenestenavn, ekte priser, ekte
avdelinger.

### Nyttige tilstander i prototypene

| Prøv | Hva du ser |
|---|---|
| `EB12345` i booking steg 2 | Tesla Model Y — vellykket oppslag |
| `FE11111` i booking steg 2 | Feiltilfellet med manuell utfylling |
| Vipps-knappen i steg 3 | Medlemspris med overstrøket standardpris |
| Søndag i dag-velgeren, steg 4 | Stengt-tilstanden med vei videre |
| Moa eller Ski i steg 1 | «Ikke tilgjengelig her» på enkelte tjenester |
| Adminpanelet → Salgsrapport → År | Sesongkurven med oktober som topp |
| Adminpanelet → Tjenester → Rediger | Lokalpriser per avdeling |

## Sjekkliste før merge

- [ ] `rg "text-muted(-light)?\b" app components` returnerer bare ikon- og kant-treff
- [ ] `rg "text-white/\d" app components` er tom (bruk `on-navy-*`-tokens)
- [ ] Ingen `@apply`, ingen nye hex-verdier utenfor `globals.css`
- [ ] Kontrast: alle tekstfarger ≥ 4,5:1 mot sin faktiske bakgrunn (husk å regne alfa-blending)
- [ ] Alle sju bookingsteg går fram og tilbake uten å miste tilstand
- [ ] «inkl. mva» står på hver totalsum
- [ ] Fokusring synlig på alt som kan tabbes
- [ ] `prefers-reduced-motion` slår av reveal og transformasjoner
- [ ] Mobil 375px: primærknappen er i nederste tredjedel på hver flyt-skjerm
- [ ] Adminpanelet: rolledeling avklart før publiseringsflyten kobles på
- [ ] CSV-eksporten åpner riktig i norsk Excel (semikolon + BOM)
