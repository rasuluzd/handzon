# UI-kit — Dagsverkstedet (kundedemo)

Den komplette klikkbare demoen i valgt art direction. Dette er filen du viser
Handz On: én lenke, hele reisen, ekte innhold, mobil og desktop.

Åpne **`index.html`**.

## Flyten kunden kan klikke

| Skjerm | Rute | Hva som virker |
|---|---|---|
| **Forside** | `/` | Hero, statstripe, «Slik gjør du», populære tjenester, sesongkampanje, kart + fire avdelinger, sosialt bevis, trygghetsband, kundeklubb |
| **Tjenester** | `/tjenester` | Sticky kategorifilter (7 chips med antall), sortering (populær / pris opp / pris ned), levende antallstekst |
| **Tjeneste-detalj** | `/tjeneste/:id` | Alle 18 tjenester har egen side: fullbleed foto, sti, nøkkeltall, «Dette inngår», «Ofte valgt sammen», relaterte tjenester, sticky «Bestill denne» som sender valget rett inn i bookingen |
| **Avdelinger** | `/avdelinger` | Søk (by/postnummer/senter), «Nær meg» med avstand, sticky kart som følger hover, 14 ekte avdelinger |
| **Avdelingsside** | `/avdeling/:slug` | Åpningstider med dagen i dag markert, telefon, kart, lokalpriser merket, «ikke tilgjengelig her»-liste, lokale anmeldelser |
| **Om oss** | `/om-oss` | Historie, statstripe, HANDZON-verdiene, tidslinje 2005→2025, bærekraft, trygghetsband |
| **Booking** | `/booking` | De sju låste stegene — se under |
| **Min side** | `/min-side` | Vipps-innlogging → avtaler, kundeklubb, biler, historikk, kvitteringer, personvern |

Snarveier som er koblet: «Bestill denne» på en tjenestesiden hopper til steg 2 med
tjenesten valgt (`/booking?service=…`), «Book her» på et avdelingskort hopper til
steg 2 med avdelingen valgt (`/booking?loc=…`).

## Bookingflyten — de sju låste stegene

1. **Avdeling** — søk, «Nær meg», 14 avdelinger med åpningsstatus og kampanje. Valg går videre automatisk.
2. **Bilen din** — registreringsnummer med auto-blokkbokstaver. «Hent bilinfo» slår opp mot Statens vegvesen (simulert, ~750 ms). Prøv `EB12345`, `DR34567`, `SU98765`, `EK55443`. **`FE11111` viser feiltilfellet** med manuelle merke-/modellfelt og «Fortsett uten oppslag».
3. **Tjeneste** — Vipps-innlogging gir medlemspris (10 %) med overstrøket standardpris, kategorifilter, lokale prisoverstyringer, «ikke tilgjengelig her» dempet og merket.
4. **Tidspunkt** — 14 dag-chips i snap-strimmel, timegrid med kapasitet («1 plass igjen» i rødt), stengt på søndager med vei videre.
5. **Tillegg** — anbefalte først («Ofte valgt sammen» per tjeneste), sticky bunnbar som viser løpende sum.
6. **Oppsummering** — «Endre» hopper tilbake til riktig steg, full prisspesifikasjon med mva-linje, kontaktkort med Vipps-utfylling. Bekreft er sperret til navn og mobil er utfylt.
7. **Bekreftelse** — referanse `HOAC-XXXX`, digital kvittering med org.nr., «Slik blir det», og lenke rett til Min side.

Ingen steg slås sammen, ingen kan hoppes over. Header og footer er skjult gjennom
hele flyten — ingenting skal konkurrere med steget.

## Bevegelse

Alt ligger bak `prefers-reduced-motion`, og varighetene bor i
`tokens/motion.css` (`--dur-page`, `--dur-fill`, `--dur-xfade`,
`--page-shift`) — endre dem der, ikke i komponentene.

| Hva | Hvordan |
|---|---|
| **Sidebytte** | Innholdet stiger 18 px og toner inn over 420 ms (variant B fra bevegelseslaben). Nav og footer står stille. |
| **Bookingsteg** | Retningsbevisst: framover glir inn fra høyre, «← Tilbake» fra venstre, 260 ms. |
| **Fremdriftslinjen** | Fyllet i gjeldende segment vokser inn fra venstre, 420 ms `scaleX`. |
| **Bilinfo-kortet** | Folder seg ut nedenfra når oppslaget mot Statens vegvesen treffer, 300 ms. |
| **Kategorifilteret** | Grid-et krysstoner over 160 ms når kategorien byttes. Ingen stagger. |
| **Sticky bunnbar** | Reiser seg når den dukker opp (steg 5, tjeneste-detalj). |
| **Summen** | Teller opp og ned når tillegg hukes av. |
| **Haken** | Spretter inn ved valg av avdeling, tjeneste eller tillegg. |
| **Tidsluker** | Kommer inn etter hverandre, 20 ms mellom, når dagen byttes. |
| **Medlemspris** | Priskolonnen toner inn når Vipps-innlogging slår inn rabatten. |
| **Bekreftelsesringen** | Skalerer inn én gang på steg 7. |
| **Mobilmenyen** | Glir inn fra høyre. |
| **Sticky header** | Krymper etter 40 px rulling — kun under 900 px, der pikslene betyr noe. |
| **Kartet** | Dempes til 35 % mens nytt utsnitt lastes, i stedet for å blinke. Byttes mot `panTo()` når Google Maps JS API-nøkkelen er inne. |
| **Reveal** | Kun to blokker på forsiden: «Slik gjør du» og populære tjenester, 70 ms forskyvning, én gang. |

Vurdert og **ikke** tatt inn: opptelling av tallene i statstripen, «avriving» av
kvitteringen, og sakte zoom på hero-fotoet. De tre står fortsatt demonstrert i
[bevegelseslaben](../../art_directions/bevegelse-lab.html) hvis dere vil se dem igjen.

## Mobil

Ett brytepunkt: **900px**. Under det:
- Hero blir foto + hvitt kort som løftes 44px opp over bildekanten.
- Navigasjonen kollapser til hamburger → fullskjermsmeny med «Bestill time» nederst.
- Primærknappen bor i **nederste tredjedel** hele veien. Steg 5 og tjeneste-detalj har sticky bunnbar.
- Chip-rader og dag-velgeren scroller horisontalt med snap.

## Filer

| Fil | Innhold |
|---|---|
| `index.html` | Skall — laster designsystemet, tokens, `dagslys.css` og skjermene |
| `dagslys.css` | Retningens eget stillag oppå `styles.css`. Prefiks `dg-`. Alle verdier fra tokens |
| `chrome.jsx.txt` | Nav, footer, ikonwrapper, knapp, merkelapp, pris, tjenestekort, sosialt bevis, trygghetsband |
| `screen-forside.jsx.txt` | Forsiden |
| `screen-tjenester.jsx.txt` | Katalog + tjeneste-detalj |
| `screen-avdelinger.jsx.txt` | Avdelingsoversikt + avdelingsside |
| `screen-om-oss.jsx.txt` | Om oss |
| `screen-booking-a.jsx.txt` | Steg 1–4 |
| `screen-booking-b.jsx.txt` | Steg 5–7 + prisberegning + bookingskallet |
| `screen-min-side.jsx.txt` | Kundeportalen — **uendret** fra den godkjente versjonen. Ikke rediger innholdet |
| `app.jsx.txt` | Ruteren |

Delt demodata: `../data.js` (14 ekte avdelinger, 18 tjenester, 6 add-ons,
affinitetsmatrise, lokale prisoverstyringer, kjøretøyoppslag).

## Kart

Demoen bruker OpenStreetMap uten API-nøkkel. Sett kundens egen nøkkel i
`index.html` — det er én kommentert linje i `<head>`:

```html
<script>window.HZ_GOOGLE_MAPS_KEY = "…";</script>
```

Da bytter både forsidens oversiktskart og avdelingskartene automatisk til Google
Maps Embed API.

## Prislogikk

```
total = tjenestepris (lokalpris hvis satt) + Σ tillegg − medlemsrabatt (10 % av tjenesten)
mva   = total / 5, vist med to desimaler
```

Alle summer er inkl. mva. Format `1 490,-` i markedsføring, `1 490 kr` i
kvitteringer og tabeller.

## Før levering til kunde

- [ ] Legg inn Google Maps-nøkkelen (én linje, se over).
- [ ] Bytt bildene i `assets/photos/` når Cowork-fotografiet er klart — filnavnene er de samme, resten følger med.
- [ ] Org.numrene per avdeling er plassholdere (`923 456 787`); hent ekte tall fra Brønnøysund per franchisetaker.
- [ ] Telefonnumrene og adressene er hentet fra kilden og bør sjekkes mot dagens drift.
