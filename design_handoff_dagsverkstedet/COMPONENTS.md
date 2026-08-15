# Komponenter

Anatomi med målverdier. `code/` har ferdig kode for Button, Card, Hero og
StepProgress — de øvrige spesifiseres her.

---

## Button — `components/ui/Button.tsx`

Ferdig kode: `code/button.tsx.txt`.

| Variant | Fyll | Tekst | Hover | Bruk |
|---|---|---|---|---|
| `primary` | `navy` | hvit | `navy-hover` | Hovedhandling. Standard |
| `accent` | `red` | hvit | `red-hover` | **Ett** konverteringspunkt per skjerm |
| `secondary` | hvit | `navy` | kant → navy, fyll → `navy-06` | Sidestilt handling |
| `ghost` | — | `navy` | `navy-06` | Tekstlenke-knapp, «Se avdelingen →» |
| `danger` | — | `danger` | `danger-bg` | «Avbestill» |
| `onNavy` | hvit | `navy` | `on-navy-bright` | På navy-flate |

Størrelser: `sm` 38px/12px · `md` 46px/13px · `lg` 54px/14px.
Radius 8px. `primary`/`accent`/`secondary`/`onNavy` er VERSALER Barlow 600
`tracking-[.1em]`; `ghost`/`danger` er sentence case.

Trykk: `translate-y-px`, aldri skalering. Laster: behold bredden, bytt label mot
15px spinner, sett `aria-busy`.

---

## Card — `components/ui/Card.tsx`

Ferdig kode: `code/card.tsx.txt`.

Tre nivåer, aldri blandet i samme kontekst:

1. **flat** — `bg-surface border border-line-strong rounded-card p-5`
2. **elevated** — samme hårlinje **pluss** `shadow-card`, `rounded-card-lg p-6`
3. **selected** — `border-2 border-navy bg-navy-06` + fylt `<Tick on />`

`Tick` er 26px rund: hvile `border-2 border-line-heavy text-transparent`, valgt
`bg-navy border-navy text-white`.

---

## Tag — `components/ui/Tag.tsx` (ny)

Lite, ikke-interaktivt statusmerke. Barlow 600, 11,5px, VERSALER,
`tracking-[.1em]`, `rounded-badge`, padding `4px 9px`, `leading-[1.4]`,
`whitespace-nowrap`.

| Variant | Bakgrunn | Tekst | Bruk |
|---|---|---|---|
| `navy` | `navy-08` | `navy` | «6 års garanti», «Lokalpris», «Kampanje» |
| `red` | `red` | hvit | «Mest booket», «Ofte valgt sammen» |
| `open` | `status-open-bg` | `status-open` | «Åpen nå» |
| `closed` | `status-closed-bg` | `status-closed` | «Stengt nå» |
| `mute` | `surface-alt` | `body-soft` | «Ikke tilgjengelig her», «Utført» |
| `out` | — | `body-soft` + `border-line-strong` | Tjenestemerke i anmeldelseskort. Sentence case, 12,5px, `whitespace-normal` |

`open`/`closed` får en 7px `rounded-full bg-current` prikk foran. Ingen andre
varianter har prikk — en prikk uten betydning er pynt.

---

## Price — `components/ui/Price.tsx` (ny)

Barlow 700, `tabular-nums`, `text-navy`.

```tsx
<Price amount={1490} from />              // fra 1 490,-   22px
<Price amount={9990} size={28} />         // 9 990,-       feature
<Price amount={1341} was={1490} />        // overstrøket + medlemspris
<Price amount={2440} suffix=" kr" vat />  // 2 440 kr inkl. mva
```

- «fra» er Source Sans 3 400, 13px, `text-body-soft`, 5px høyre marg.
- `was` er 13px `line-through text-muted-light` **over** hovedbeløpet i bookingrader.
- Formatering: `new Intl.NumberFormat("nb-NO")` — hardt mellomrom byttes til vanlig mellomrom.
- `suffix`: `",-"` i markedsføring, `" kr"` i kvitteringer og tabeller.
- **`vat` er påkrevd på hver totalsum.**

---

## Chip

Interaktiv filter-pille. `rounded-full border border-line-strong bg-surface`,
padding `8px 15px`, Barlow 600 13,5px, `whitespace-nowrap`, `shrink-0`.

- Hover: `border-navy`
- Aktiv: `bg-navy border-navy text-white`
- `aria-pressed`
- Antall bak etiketten: samme font, `opacity-65`

Raden er `flex gap-2 overflow-x-auto` + `.hz-scroll`. Første chip er alltid «Alle».
På tjenester-siden ligger raden sticky under headeren (`top-[69px]`) med
`bg-surface/95 backdrop-blur-[12px]` og hårlinje over og under. Endring annonseres
med `aria-live="polite"`: «Viser 6 tjenester i Polering».

---

## ServiceTile

Tjenestekortet i grid.

```
button.relative.flex.flex-col
  bg-surface border border-line-strong rounded-card-lg overflow-hidden
  hover: border-navy + -translate-y-0.5   (200ms ease-standard)

  ├ media    aspect-[4/3]  (forsidens trio: aspect-[4/5])
  │            img object-cover, hover scale-[1.03] 380ms
  ├ flagg    absolute top-3 left-3  →  <Tag variant="red">Mest booket</Tag>
  └ body     p-[18px_20px_20px] flex flex-col gap-2 flex-1
       ├ kategori   Barlow 600 11,5px VERSALER tracking-[.16em] text-body-soft
       │              «Bilvask · ca. 1 t 15 min»
       ├ navn       Barlow 600 21px leading-[1.25] text-ink
       ├ beskrivelse 14,5px leading-[1.5] text-body-soft
       ├ garanti    <Tag> self-start, kun når tjenesten har garanti
       └ foot       mt-auto pt-3.5 border-t border-line
                      flex justify-between items-baseline
                      <Price from />        «SE MER →» Barlow 600 11,5px
                                            VERSALER tracking-[.14em] text-body-soft
```

**«Mest booket» settes på maks ett kort per liste.** I katalogen brukes «Populær»
på de tjenestene som faktisk er merket populære i datamodellen.

---

## Row (bookingvalg / relatert tjeneste)

Tett radvariant. Dette er bookingflytens arbeidshest.

```
button.flex.items-center.gap-[15px].w-full.text-left
  bg-surface border border-line-strong rounded-card p-[13px]
  hover: border-navy + bg-navy-06
  valgt: border-2 border-navy bg-navy-06 p-3   (1px mindre padding, så boksen ikke hopper)
  disabled: opacity-50 cursor-not-allowed

  ├ img      70×70 rounded-control object-cover shrink-0
  ├ body     flex-1 min-w-0
  │    ├ navn        Barlow 600 17px leading-[1.25] text-ink
  │    │               + <Tag> inline: garanti / «Ikke tilgjengelig her»
  │    ├ beskrivelse  13,5px leading-[1.45] text-body-soft
  │    └ meta         Barlow 600 11,5px VERSALER tracking-[.12em] text-body-soft
  │                     «VARIGHET CA. 30 MIN»
  ├ pris     text-right shrink-0  Barlow tabular
  │            was:  13px line-through text-muted-light  (blokk over)
  │            beløp: 19px 700 text-ink — text-navy når valgt
  └ tick     <Tick on={valgt} />
```

---

## BranchCard

```
Card (flat på forside/steg 1, elevated på avdelingsoversikt)
  ├ top      flex justify-between items-start gap-3
  │    ├ navn      Barlow 600 18px text-ink  «Handz On Lambertseter»
  │    ├ adresse   14px text-body-soft  «Lambertseter senter · Cecilie Thoresens vei 17–21, 1153 Oslo»
  │    └ avstand   Barlow 600 14px text-navy tabular  «3,4 km»  (kun ved geolokalisering)
  ├ meta     flex gap-2 flex-wrap mt-3   <Tag open dot> + evt. <Tag navy> kampanje
  ├ timer    mt-3 pt-3 border-t border-line, 13,5px text-body-soft tabular
  │            «Man–ons 08–17 · Tors 08–18 · Fre 08–17 · Lør 10–15 · Søn stengt»
  └ acts     flex gap-2.5 mt-4   Button sm primary «Book her» + ghost «Se avdelingen →»
```

«Åpen nå» **beregnes fra åpningstidene**, hardkodes ikke. Søk uten treff viser
alle avdelinger med forklarende linje — aldri tom liste.

---

## Sticky bunnbar

Brukes på booking steg 5 og tjeneste-detalj.

```
fixed inset-x-0 bottom-0 z-30
bg-surface border-t border-line shadow-sticky p-[12px_var(--pad)]
  └ inner  max-w-[720px] mx-auto flex items-center gap-4 flex-wrap
       ├ etikett   12,5px text-body-soft   +   verdi Barlow 600 15,5px text-ink
       ├ sum       ml-auto Barlow 700 23px tabular text-ink
       └ Button lg  (w-full på mobil)
```

Innholdet over må ha `pb-[120px]` så baren ikke dekker siste rad.

---

## Vipps-knapp

**Vipps' egen låsning. Ikke en generisk knapp med Vipps-tekst.**

```
inline-flex items-center justify-center gap-[9px]
min-h-[48px] px-[26px] rounded-full
bg-vipps text-white   hover:bg-vipps-hover   active:translate-y-px
  ├ «Logg inn med»   Barlow 600 16px
  └ ordmerke         Barlow 700 19px tracking-[-.01em]  «Vipps»
                       + 9px hvit rund prikk, translate-y-[-6px], ml-px
```

Pille-radius (den ene i systemet), fast oransje, aldri omfarget. Maks én per
skjerm. Kontrasten hvit-på-oransje er Vipps' eget valg og skal ikke justeres.

Opptrer i: booking steg 3 (medlemspris), steg 6 (fyll ut kontaktinfo), Min side
(innlogging).

---

## RegNr-felt

Booking steg 2.

```
w-full bg-surface border-[1.5px] border-line-heavy rounded-card
p-[18px_12px] text-center
font-heading text-[30px] font-bold uppercase tabular
tracking-[.26em] indent-[.26em]
placeholder:text-neutral-300
focus: border-navy + ring-3 ring-navy/16
feil:  border-danger bg-danger-bg
```

Normaliser i `onChange`: `value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,7)`.
Gyldig: `/^[A-Z]{2}\d{5}$/`. Brukeren skal aldri måtte holde shift.

Under feltet: hjelpetekst 13,5px `text-body-soft`. «Hent bilinfo» er disabled til
formatet er gyldig.

---

## Dag-velger og timeliste

**Dag-chip** 66px bred, `rounded-card border border-line-heavy`, tre linjer:
ukedag 12,5px `text-body-soft` / dato Barlow 700 22px tabular `text-ink` /
måned 11,5px. Aktiv: `bg-navy border-navy`, tekst hvit / `text-white/85`.
Raden er `flex gap-2.5 overflow-x-auto snap-x snap-mandatory` + `.hz-scroll`.

**Timeliste** `grid grid-cols-3 gap-2.5`. Hver `rounded-control border
border-line-strong p-[12px_6px] text-center`: tid Barlow 700 17px tabular
`text-ink`, under den kapasitet 12px `text-body-soft` — «3 plasser», og
`text-danger` ved «1 plass igjen». Hover `border-navy bg-navy-06`.

Tom dag → EmptyState med vei videre, ikke bare «ingen treff».

---

## EmptyState

```
flex flex-col items-center text-center gap-2.5
bg-surface-alt rounded-card-lg p-[44px_24px]
  ├ ikon      Lucide 40px text-muted-light   (dekorativt, aria-hidden)
  ├ tittel    Barlow 600 19px text-ink
  ├ tekst     15px text-body-soft max-w-[42ch]
  └ Button secondary  ← alltid en vei videre
```

Eksempel: «Ingen ledige tider denne dagen» / «Prøv en annen dag — det er som
regel god plass tidlig i uka.» / «Vis neste ledige dag».

---

## Sosialt bevis

```
grid grid-cols-[320px_1fr] gap-4 items-start   (1 kolonne under 900px)
  ├ ratingkort   bg-navy rounded-card-lg p-7
  │    ├ «4,8»      Barlow 700 64px leading-[.92] tabular hvit
  │    ├ stjerner   18px tracking-[.22em] text-cyan-on-navy   ← ikke --color-cyan
  │    ├ ingress    14,5px leading-[1.55] text-on-navy
  │    └ kilder     mt-[22px] pt-4 border-t border-on-navy-hair
  │                   flex-col gap-2.5, 13,5px text-on-navy-soft
  │                   hver rad: flex justify-between tabular
  │                   Google 4,8 · 1 612 / Trustpilot 4,7 · 421 / Gjestebok 4,9 · 107
  └ anmeldelser  grid grid-cols-2 gap-4   (1 kolonne under 900px)
       Card flat p-[22px]
         ├ topp    flex items-center gap-[11px] mb-3
         │    ├ avatar  38px rounded-full, Barlow 700 14px hvit, initialer
         │    │           farger: #1e3a70 / #236b45 / #e41830 / #0c6f96
         │    │           (alle ≥4,6:1 mot hvit tekst — ikke bruk #00a8e4, det gir 2,7)
         │    └ navn 15px Barlow 600 text-ink  +  sted/dato 12,5px text-body-soft
         ├ sitat   15px leading-[1.55] text-body, i «norske anførselstegn»
         └ tjeneste <Tag variant="out">
```

Navnene, stedene, datoene og sitatene er ekte kundeinnhold — ikke bytt dem mot
lorem eller generiske sitater.
