# MOTION.md — Bevegelse

Alle varigheter bor i `design/tokens/motion.css`. Endre dem der, ikke i
komponentene. I Tailwind eksponeres de som `duration-[var(--dur-page)]` eller
via `theme.extend.transitionDuration`.

```css
--dur-fast:120ms;    /* farge, opasitet, hover              */
--dur:200ms;         /* standard transform                  */
--dur-slow:500ms;    /* on-scroll reveal                    */
--dur-hero:700ms;    /* hero-kryssfade                      */
--dur-page:420ms;    /* sidebytte                           */
--page-shift:18px;   /* hvor langt innholdet stiger          */
--dur-fill:420ms;    /* fremdriftslinjens fyll              */
--dur-xfade:160ms;   /* kryssfade av filtrert grid          */
--ease-standard:cubic-bezier(0.2,0.6,0.2,1);
--ease-out:cubic-bezier(0.16,1,0.3,1);
```

**Alt ligger bak `prefers-reduced-motion: reduce`**, som er en global regel i
`tokens/base.css` og slår av samtlige animasjoner og transisjoner. Ikke skriv
egne unntak per komponent.

**Ingen bounce, ingen spring, ingen parallax, ingen auto-spillende video.**

---

## Kundeflaten

| Hva | Utløser | Hvordan | Hvor |
|---|---|---|---|
| **Sidebytte** | Navigasjon | Innholdet stiger `--page-shift` (18 px) og toner inn over `--dur-page` (420 ms), `--ease-out`. Nav og footer står stille. | Wrapper rundt `<main>`-innholdet, nøklet på ruten |
| **Bookingsteg** | Stegskifte | Retningsbevisst: framover glir inn fra +24 px, tilbake fra −24 px, 260 ms | Wrapper rundt stegets innhold, nøklet på stegnummer |
| **Fremdriftslinjen** | Stegskifte | Fyllet i gjeldende segment vokser fra `scaleX(0)` til `scaleX(1)` over `--dur-fill`, `transform-origin: left` | `::after` inne i segmentet |
| **Bilinfo-kortet** | Oppslag mot Statens vegvesen treffer | Folder seg ut nedenfra: `max-height`, padding, margin og opasitet fra 0 over 300 ms | Steg 2 |
| **Kategorifilteret** | Kategori byttes | Grid-et krysstoner over `--dur-xfade` (160 ms). **Ingen stagger** — det gjør siden treg når man klikker seg rundt | Tjenester-siden, nøklet på kategori |
| **Sticky bunnbar** | Bunnbaren monteres | Reiser seg fra `translateY(100%)`, 280 ms | Steg 5, tjeneste-detalj |
| **Summen** | Tillegg hukes av | Teller opp eller ned over 340 ms, `easeOutCubic`, via `requestAnimationFrame` | Steg 5s sticky sum |
| **Haken** | Kort velges | Spretter inn fra `scale(.55)`, 220 ms, `--ease-standard` | Alle valgkort i bookingen |
| **Tidsluker** | Dag byttes | Kommer inn etter hverandre, 20 ms mellom, maks 12 trinn | Steg 4 |
| **Medlemsprisen** | Vipps-innlogging | Priskolonnen toner inn (240 ms) fordi verdien endret seg | Steg 3 |
| **Bekreftelsesringen** | Steg 7 vises | Skalerer inn fra `scale(.55)`, 420 ms | Steg 7 |
| **Mobilmenyen** | Hamburger trykkes | Glir inn fra +30 px, 240 ms | Under 900 px |
| **Sticky header** | 40 px rulling | Krymper: padding 16 → 9 px, logo 36 → 29 px, 200 ms. **Kun under 900 px** | Global header |
| **Kartet** | Utsnittet byttes | Dempes til 35 % opasitet mens nytt utsnitt lastes, 240 ms. Byttes mot `panTo()` når Google Maps JS API-nøkkelen er inne | Avdelingsoversikten |
| **Reveal** | Blokken kommer i syne | Opasitet 0→1 og `translateY(14px)`→0 over `--dur-slow`, 70 ms forskyvning. Én gang. **Kun to blokker: «Slik gjør du» og populære tjenester** | Forsiden |
| **Kort-hover** | Hover | `translateY(-2px)`, dypere skygge, media `scale(1.03)`, tittel → navy | Tjeneste- og avdelingskort |
| **Knapp** | Hover / trykk | Hover: lysere navy `#294b8c`, **aldri opacity**. Trykk: mørkere `#16294f` + `translateY(1px)`, **aldri skalering** | Alle knapper |

### Reveal — implementasjonsnote

Bruk en rulle-lytter, ikke `IntersectionObserver`. Ved et hopp i rullefeltet
(anker-lenke, gjenopprettet posisjon, programmatisk `scrollTo`) rekker ikke
observatøren å se selve inngangen, og blokken kan bli stående usynlig. En lytter
som sjekker `getBoundingClientRect().top < innerHeight * 0.9` og fjerner seg selv
etter første treff dekker begge tilfeller.

---

## Adminpanelet

| Hva | Hvordan |
|---|---|
| Segmentert velger | Hvit indikator glir til valgt knapp, 200 ms. Bredden måles per knapp og animeres, fordi «Måned» og «År» er ulikt brede |
| Panel (drawer) | Skyves inn fra høyre. Bakteppe `rgba(14,22,38,.55)` + `blur(4px)`. Escape lukker |
| Toast | Nederst høyre, auto-lukk etter 5 s |
| Bryter | Knappen glir 18 px, 120 ms |
| Stolper i diagram | **Ingen inn-animasjon.** Data skal ikke vente på pynt |

Et internt verktøy skal føles raskt, ikke levende.

---

## Vurdert og forkastet

Disse tre ble bygget, demonstrert side ved side og valgt bort. Ikke legg dem inn
uten at Handz On ber om det:

| Forslag | Hvorfor ikke |
|---|---|
| **Opptelling av statstripen** (14, 120 000+, 4,8, 20 år) | Fungerte fint, men ble vurdert som pynt på tall som taler for seg |
| **«Avriving» av kvitteringen** på steg 7 | Sjarmerende, men det første en streng art director stryker |
| **Sakte zoom på hero-fotoet** (1,00 → 1,05 over 9 s) | Bryter med «ingen auto-spillende bevegelse» i retningslinjene |

Alle tre står fortsatt demonstrert med og uten i bevegelseslaben, hvis dere vil
se dem igjen: `art_directions/bevegelse-lab.html` i designsystem-prosjektet.
