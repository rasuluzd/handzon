# UI-kit — Adminpanel

Det interne verktøyet avdelingene og kjedekontoret jobber i. Samme merkevare som
kundeflatene, men desktop først: navy sidestolpe, hvite kort på `--surface-alt`,
hårlinjer og tabulære tall.

Åpne **`index.html`**.

## Skjermer

| Skjerm | Hva den gjør |
|---|---|
| **Oversikt** | Dagens omsetning, ordrer, snittordre og månedstall — alle med endring mot forrige periode. Stolper for siste 14 dager, kapasitetsmåler, dagens innkommende biler, «å gjøre»-liste og månedens beste tjenester. |
| **Bestillinger** | Dag for dag, fram og tilbake. Statusflyt per ordre: Ny → Ta inn → Meld klar (sender SMS) → Registrer levert. Søk på tjeneste, referanse eller avdeling. |
| **Salgsrapport** | Kjernen. **Dag, uke, måned og år** for én avdeling eller hele kjeden, med sammenligning mot forrige tilsvarende periode. |
| **Tjenester og priser** | Rediger navn, beskrivelse, kjedepris, varighet, nivå, garanti, bilde og synlighet. Lokalpris per avdeling. Utkast-flyt med «Publiser». |
| **Blogg og nyheter** | Innleggsliste med publisert/utkast, full editor med markdown-verktøy, hovedbilde, automatisk nettadresse og levende forhåndsvisning. |

## Salgsrapporten

Periodevelgeren er fire faste nivåer, og hvert nivå bytter både vinduet og
bøttene i diagrammet:

| Periode | Diagrammet viser | Sammenlignes med |
|---|---|---|
| **Dag** | Omsetning per time, 08–16 | Dagen før |
| **Uke** | Omsetning per dag, man–søn (søndag dempet som stengt) | Forrige uke |
| **Måned** | Omsetning per dag i måneden | Forrige måned |
| **År** | Omsetning per måned, jan–des | Samme periode i fjor |

Piltastene flytter perioden bakover og forover; «Neste» er sperret når du er på
dagens periode. Under diagrammet:

- **Tjenester i perioden** — antall, omsetning, andel av total, med sumlinje.
- **Kategorier** — omsetning per kategori med andelsstolper.
- **Tilleggssalg** — festerate og kroner per add-on.
- **Bestillingskanal** — nett, skranke, telefon.
- **Avdelinger i perioden** — bare når «Hele kjeden» er valgt. Klikk «Vis» for å
  filtrere hele rapporten til én avdeling.
- **Regnskapslinjer** — omsetning, mva-grunnlag og nøkkeltall.

**Eksporter CSV** laster ned én linje per ordre (dato, tid, avdeling, tjeneste,
tillegg, kanal, medlem, rabatt, sum) med semikolon og BOM, slik at Excel på norsk
åpner den riktig.

## Tjenesteredigering

Kjedeprisen er standard for alle 14 avdelinger. Velg en avdeling i toppen for å
se hva som faktisk gjelder der. I redigeringspanelet:

- **Lokalpriser** — ett felt per avdeling. Tomt = følger kjedeprisen. `0` skjuler
  tjenesten i den avdelingen. De ekte overstyringene fra katalogen er lagt inn
  som utgangspunkt (Lambertseter Full Shine – Pro 7 990,-, Forus 6 990,-,
  Moa uten keramisk coating, Ski uten Polering – Pro).
- **Synlighet** — «Kan bookes på nett» og «Vis under Populære tjenester».
- **Bilde** — velges fra mediebiblioteket i `assets/photos/`.

Endringer lagres som **utkast** og merkes med gul «Utkast»-lapp. En banner øverst
teller uublisert arbeid, og «Publiser» skyver alt live. Det er samme mentale
modell som resten av kjeden bruker: ingenting treffer kunden ved uhell.

## Blogg

Fem ekte innlegg ligger inne som utgangspunkt — tre publiserte, to utkast. De er
skrevet i kjedens stemme: konkret fagkunnskap, ingen selgerstemme, og ærlige
«når vi sier nei»-avsnitt.

Editoren har markdown-verktøylinje (mellomtittel, fet, kursiv, punktliste,
lenke), ordtelling med lesetid, automatisk nettadresse fra tittelen (æ/ø/å
translittereres), datovelger og forhåndsvisning som viser innlegget slik det ser
ut i listen på nettsiden.

## Salgsdata

`sales-data.js` genererer ordrer **deterministisk** — samme avdeling og dato gir
alltid samme tall, så demoen er stabil mellom omlastinger og tallene stemmer
mellom skjermene. Modellen speiler driften:

- Avdelingsvekt: Lambertseter og Lagunen er størst, Asker og Moa minst.
- Ukerytme: lørdag er travlest, søndag er stengt.
- Sesong: topper i april–mai (pollen, dekkskift) og september–oktober
  (vinterforberedelse), bunn i januar–februar.
- Tjenestemiks vektet mot vask (46 %), deretter interiør, polering, hjul,
  Full Shine og coating.
- 41 % medlemsandel, 38 % festerate på tillegg, kanalsplitt 58/27/15.

Priser og tilgjengelighet leses fra `../data.js`, så lokale overstyringer slår
gjennom i rapportene automatisk.

## Filer

| Fil | Innhold |
|---|---|
| `index.html` | Skall |
| `admin.css` | Stillag oppå `styles.css`. Prefiks `ad-`. Alle verdier fra tokens |
| `sales-data.js` | Ordregenerering, periodevindu, bøtter, aggregering, CSV |
| `chrome.jsx.txt` | Sidestolpe, toppbar, avdelingsvelger, knapp, tag, bryter, KPI, stolpediagram, panel, toast |
| `screen-oversikt.jsx.txt` | Oversikt |
| `screen-bestillinger.jsx.txt` | Bestillinger med statusflyt |
| `screen-rapport.jsx.txt` | Salgsrapport |
| `screen-tjenester.jsx.txt` | Tjeneste- og prisredigering |
| `screen-blogg.jsx.txt` | Blogg og nyheter |
| `app.jsx.txt` | Ruter + delt tilstand (tjenester, innlegg, valgt avdeling, toaster) |

## Responsivt

- **Over 1100px** — full sidestolpe med etiketter og teller.
- **760–1100px** — sidestolpen kollapser til ikonrail, KPI-ene til to kolonner.
- **Under 760px** — sidestolpen blir en skuff bak hamburgermenyen, alt stables.
  Tabeller scroller horisontalt i stedet for å knuses.

## Dette er en prototype

Tilstanden lever i nettleseren: endringer i tjenester og innlegg består mens du
klikker rundt, men forsvinner ved omlasting. Det finnes ingen backend, ingen
innlogging og ingen rollestyring. Når panelet skal bygges for produksjon er det
tre ting som må avklares først:

1. **Roller** — franchisetaker ser bare sin avdeling, kjedekontoret ser alt.
   Hvem får endre kjedepris?
2. **Kilden til salgstall** — kassesystemet eller bookingbasen?
3. **Publisering** — skal prisendringer kreve godkjenning fra kjedekontoret?
