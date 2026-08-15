# Tokens

Alle verdier finnes i `code/globals.css`. Tailwind 4 genererer utilities fra
`--color-*`-navnene automatisk: `--color-body-soft` → `text-body-soft`,
`bg-body-soft`, `border-body-soft`.

## Farge — merkevare

Pikselprøvet fra `public/logo-original.webp`.

| Token | Hex | Klasse | Hvor |
|---|---|---|---|
| `--color-navy` | `#1E3A70` | `navy` | Logoens bilstrek. Primærknapp, lenker, priser, aktiv tilstand, footer |
| `--color-navy-hover` | `#294B8C` | `navy-hover` | Hover på primærknapp |
| `--color-navy-active` | `#16294F` | `navy-active` | Trykk |
| `--color-navy-deep` | `#16223A` | `navy-deep` | Dypeste navy = `ink` |
| `--color-red` | `#E41830` | `red` | Logoens «z» og arbeidstøyet. **Ett** punkt per skjerm: «Mest booket», «Ofte valgt sammen» |
| `--color-cyan` | `#00A8E4` | `cyan` | «Auto Care»-linjen i logoen. Kun i logoen |
| `--color-cyan-on-navy` | `#55C5EF` | `cyan-on-navy` | Cyan tekst/ikon **på** navy — `#00A8E4` gir bare 4,08:1 der |

## Farge — navy-transparenser

Brukes i stedet for lyse blåtoner, slik at paletten holder seg på tre farger.

| Token | Verdi | Bruk |
|---|---|---|
| `--color-navy-06` | `rgba(30,58,112,.06)` | Valgt kort, hover-fyll på sekundærknapp |
| `--color-navy-08` | `rgba(30,58,112,.08)` | Merkelapp, chip |
| `--color-navy-10` | `rgba(30,58,112,.10)` | Aktiv chip |
| `--color-navy-14` | `rgba(30,58,112,.14)` | Trykk-fyll, glød rundt aktivt stegsegment |
| `--color-red-08` | `rgba(228,24,48,.08)` | Aksentmerkelapp |

## Farge — overflatenivåer

| Token | Hex | Bruk |
|---|---|---|
| `--color-surface` | `#FFFFFF` | Kort, hero-kort, hovedflate |
| `--color-surface-alt` | `#F4F5F7` | Annenhver seksjon, sosialt bevis, footer i tidligere versjon |
| `--color-surface-sunken` | `#EDEFF3` | Bildeplassholder mens foto laster |
| `--color-canvas` | `#DCDEE3` | Bak app-containeren |
| `--color-surface-shop` | `#0E1626` | Mørk verkstedsflate — ikke i bruk i Dagsverkstedet |

## Farge — tekst

| Token | Hex | På hvit | Bruk |
|---|---|---|---|
| `--color-ink` | `#16223A` | 14,8:1 | Overskrifter, tall, kortnavn |
| `--color-body-strong` | `#333B4A` | 10,7:1 | Feltetiketter |
| `--color-body` | `#444C5C` | 8,6:1 | Brødtekst, ingress |
| `--color-body-soft` | `#5A6273` | 6,1:1 | **All sekundær tekst.** Meta, hjelpetekst, disclaimere |
| `--color-muted` | `#737B8A` | 4,3:1 ✗ | **Ikke tekst.** Ikonstrek, kanter |
| `--color-muted-light` | `#9AA1AD` | 2,6:1 ✗ | **Ikke tekst.** Hake-ring i hvile |

## Farge — på navy

| Token | Hex | På navy | Bruk |
|---|---|---|---|
| `#FFFFFF` | — | 8,9:1 | Overskrifter |
| `--color-on-navy-bright` | `#EAF0FB` | 8,0:1 | Fremhevet tekst |
| `--color-on-navy` | `#D6E0F1` | 6,6:1 | Brødtekst, footerlenker |
| `--color-on-navy-soft` | `#B7C6E4` | 5,1:1 | Juridisk stripe. **Aldri `text-white/45`** (3,6:1) |
| `--color-on-navy-eyebrow` | `#9EB6E0` | 4,6:1 | Eyebrows, kolonnetitler |
| `--color-on-navy-hair` | `rgba(255,255,255,.14)` | — | Delelinjer på navy |

## Farge — semantikk

Grønn og varselrød opptrer aldri som flater eller ikoner større enn ~10px.

| Token | Hex | Bruk |
|---|---|---|
| `--color-status-open` | `#236B45` | «Åpen nå», «Bekreftet», haker i «Dette inngår» |
| `--color-status-open-bg` | `rgba(35,107,69,.10)` | Bakgrunn for åpen-merkelapp |
| `--color-status-closed` | `#73591A` | «Stengt nå» — bevisst gyllen, ikke rød |
| `--color-danger` | `#B4232A` | Validering, «1 plass igjen», «Avbestill». Mørkere og mattere enn merkevarerødt så de ikke forveksles |
| `--color-vipps` | `#FF5B24` | **Kun** Vipps-knappen, i Vipps' egen låsning |
| `--color-disabled` / `-text` | `#E3E5E9` / `#A5AAB4` | Kun disabled-kontroller (unntatt fra kontrastkravet) |

## Typografi

Barlow bærer alt konstruert, Source Sans 3 bærer alt som leses.

| Rolle | Font | Mobil → desktop | Line-height | Tracking |
|---|---|---|---|---|
| Hero h1 | Barlow 700 | `clamp(38px,5.4vw,64px)` | .99 | −.032em |
| Side-h1 | Barlow 700 | `clamp(32px,4vw,46px)` | 1.02 | −.03em |
| h2 | Barlow 700 | `clamp(26px,3.2vw,38px)` | 1.06 | −.024em |
| Steg-h1 | Barlow 700 | `clamp(27px,3.6vw,34px)` | 1.08 | −.024em |
| h3 / kortnavn | Barlow 600 | 21px | 1.25 | — |
| Radnavn | Barlow 600 | 17px | 1.25 | — |
| Ingress | Source Sans 3 400 | 19px | 1.55 | — |
| Brødtekst | Source Sans 3 400 | 16px | 1.55 | — |
| Meta / hjelp | Source Sans 3 400 | 13,5–14px | 1.45–1.6 | — |
| Eyebrow | Barlow 600 VERSALER | 12px | — | .2em |
| Knapp | Barlow 600 VERSALER | 12 / 13 / 14px | — | .1em |
| Kolonneetikett | Barlow 600 VERSALER | 11–11,5px | — | .16em |
| Pris inline | Barlow 700 tabular | 19–22px | — | — |
| Pris feature | Barlow 700 tabular | 28px | 1 | — |

Brødtekst maks **~68 tegn** bred. Tall i kolonne alltid `tabular-nums`.

## Spacing

4px-basis. Semantiske verdier:

| Rolle | Verdi |
|---|---|
| Seksjon horisontalt | `clamp(20px,4vw,64px)` |
| Seksjon vertikalt | `clamp(40px,5vw,76px)` |
| Kort-padding | 20px (flat) / 24px (elevated) |
| Grid-gap | 16px |
| eyebrow → h2 | 12px |
| h2 → ingress | 8px |
| Seksjonshode → innhold | 26–28px |
| Bookingkolonne | `max-w-[720px]` |
| App-container | `max-w-[1180px]` |
| Tjeneste-detalj | `max-w-[820px]` |
| Minste trykkflate | 44px |

## Radius

| Token | Verdi | Bruk |
|---|---|---|
| `--radius-badge` | 6px | Merkelapper |
| `--radius-control` | 8px | Knapper, input |
| `--radius-card` | 10px | Flate kort, bookingvalg |
| `--radius-card-lg` | 12px | Nøkkelkort, hero-kort, media, navy-paneler |
| pille | 999px | Chips, statusmerker |

Ingenting er helt firkantet, ingenting er overrundet.

## Skygger

| Token | Verdi | Bruk |
|---|---|---|
| `--shadow-card` | `0 6px 20px -8px rgba(20,32,58,.12)` | Nøkkelkort i hvile |
| `--shadow-card-hover` | `0 14px 30px -10px rgba(20,32,58,.18)` | Hover, med `-translate-y-0.5` |
| `--shadow-pop` | `0 18px 44px -14px rgba(20,32,58,.24)` | Dropdown, modal |
| `--shadow-sticky` | `0 -10px 28px -16px rgba(20,32,58,.22)` | Sticky bunnbar — **oppover** |
| `--shadow-hero` | `0 24px 60px -28px rgba(20,32,58,.45)` | Hero-kortet over fotoet |
| `--shadow-app` | `0 0 60px rgba(20,32,58,.14)` | App-containeren mot canvas |

Ingen innerskygger. Ingen fargede skygger. Maks ett skyggenivå per kortkontekst.

## Bevegelse

| Varighet | Bruk |
|---|---|
| 120ms | Farge på hover, chip-toggle |
| 200ms | Transform, kort-hover |
| 500ms | On-scroll reveal, 60ms stagger |

Easing: `--ease-standard: cubic-bezier(.2,.6,.2,1)` inn/ut,
`--ease-out-soft: cubic-bezier(.16,1,.3,1)` for reveal og paneler.

**Ingen bounce, ingen spring, ingen parallax, ingen autospillende video.**
`prefers-reduced-motion: reduce` slår av alt.

## Tilstander

| Tilstand | Uttrykk |
|---|---|
| Hover primærknapp | Lysere navy `#294B8C` — aldri opacity |
| Hover sekundærknapp | Kant → navy, fyll → `navy-06` |
| Hover kort | `-translate-y-0.5` + dypere skygge, media `scale(1.03)` |
| Trykk | Mørkere navy `#16294F` + `translate-y-px` — aldri skalering |
| Fokus | 2px navy outline, 2px offset. På navy: hvit |
| Valgt | 2px navy kant + `navy-06` fyll + fylt hake |
| Disabled | `#E3E5E9` / `#A5AAB4`, ingen hover, **alltid forklarende hjelpetekst ved siden** |
| Laster | Behold bredde, bytt label mot 15px spinner, `aria-busy="true"` |
