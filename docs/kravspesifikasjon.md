# DETALJERT KRAVSPESIFIKASJON

**Prosjekt:** Ny digital plattform (Markedsnettside, Bookingflyt og Kundeportal) til Handz On Auto Care
**Versjon:** 2.0 (Oppdatert med registreringsnummer og Vipps-innlogging)

> Committet fra kundens dokument — innholdet er gjengitt ordrett, kun formatert til markdown.

## 1. Innledning og overordnet mål

Målet med prosjektet er å erstatte dagens løsning med en moderne, samlet digital
plattform (frontend markedsnettside, stegvis bookingflyt og kundeportal).
Plattformen skal fjerne friksjon i bestillingen, maksimere snittordre via
automatiserte mersalgsmoduler, samt sikre sømløs dataflyt mellom frontend og
eksisterende backoffice-systemer.

## 2. Arkitektur og systemlandskap (System Architecture)

Systemet skal bygges som en hodeløs (headless) eller tett integrert webapplikasjon
basert på en tredelt struktur:

```
[ Frontend: Webapp / Mobil først ]
        │
        ▼ (REST API / GraphQL)
[ Integrasjonslag: Avio MYO0 / CMS / Vipps Logg inn ]
        │
        ▼
[ Core Backend: Avio ED (Backoffice) / Avio POS (Datakasse) ]
```

### 2.1 Komponentoversikt

- **Frontend (Kundefront):** Markedsnettside, responsive avdelingssider, stegvis
  booking og «Min side»-portal.
- **Integrasjonslag:** Kobling mot ekstern kundedatabase/kundeklubb, Vipps API
  (for autentisering), samt Meta- og Google-piksler for konverteringssporing.
- **Backend / Core:** Avio ED (Backoffice sentralt/avdeling) og Avio POS
  (Datakasse) som fungerer som "Single Source of Truth" for ledig kapasitet,
  kalender, ressurser, priser og kvitteringsdata.

## 3. Funksjonelle krav (FR)

### 3.1 Markedsnettside og avdelingssider (CMS)

Dette kapittelet omfatter innhold og struktur som styres via CMS-løsningen.

**FR-1.1: Forside og globale elementer**

- Beskrivelse: Forsiden skal fungere som primær landingsside med ekstremt
  tydelig konverteringsfokus.
- Detaljerte krav:
  - Hero-seksjon: Skal inneholde en "Hero-knapp" (Call to Action – CTA)
    merket "Bestill bilpleie" som sender brukeren rett inn i Steg 1 i bookingflyten.
  - Populære tjenester: Dynamisk eller manuelt oppsatte kort som viser de 3–4
    mest populære tjenestene med direkte "Bestill denne"-lenker som
    forhåndsvelger tjenesten i bookingflyten.
  - Sosialt bevis (Social Proof): Seksjon for kundeanmeldelser, rating eller
    godkjenningsmerker (f.eks. Arbeidstilsynets godkjenningsordning for bilpleie).

**FR-1.2: Avdelingsoversikt (Lokasjonstjeneste)**

- Beskrivelse: Finne nærmeste HandzOn-avdeling raskt og effektivt.
- Detaljerte krav:
  - Systemet skal be om tillatelse til geolokasjon via nettleser. Dersom godkjent,
    sorteres avdelingslisten automatisk etter geografisk nærhet.
  - Søkefelt der brukeren kan taste inn postnummer eller by for å filtrere
    avdelingslisten.
  - Kartvisning (f.eks. Google Maps/Mapbox) med "pins" for alle avdelinger.

**FR-1.3: Dedikerte avdelingssider**

- Beskrivelse: Unike URL-er for hver avdeling (f.eks.
  handzon.no/avdelinger/sandvika) optimalisert for lokal SEO.
- Detaljerte krav:
  - Skal dynamisk hente og vise data fra Avio ED: Åpningstider, kontaktinfo
    (telefon/e-post) og adresse med kart.
  - Visning av tjenesteutvalg og priser spesifikt for denne avdelingen.
  - Kampanjeseksjon som viser lokale tilbud styrt fra backend.
  - CTA-knapp som sender brukeren til booking med denne avdelingen ferdig valgt.

### 3.2 Timebestilling (Kjernefunksjonalitet)

Kjernen i plattformen er en sanntids, live webapplikasjon integrert mot
ressursmatrisen i Avio ED/POS eller online kalender.

**FR-2.1: Den stegvise bookingflyten**

Bookingflyten skal tvinge brukeren gjennom følgende sekvensielle, lukkede trakt
(funnel) for å minimere frafall:

| Steg | Navn | Funksjonell beskrivelse og forretningsregler |
|---|---|---|
| Steg 1 | Velg avdeling | Obligatorisk steg. Foreslår automatisk nærmeste avdeling basert på lokasjonsdata. |
| Steg 2 | Tast registreringsnummer | Inputfelt for bilens kjennemerke (f.eks. AB12345). Feltet må automatisk konvertere alt til blokkbokstaver (uppercase) og fjerne unødige mellomrom. Dataen følger ordren og lagres på portalen. Her må systemet hente data om bilen fra Statens vegvesens database. |
| Steg 3 | Velg tjeneste | Viser tilgjengelige tjenester og pakker på valgt avdeling. Tjenestene skal være kategorisert (f.eks. "Innvendig vask", "Polering", "Keramisk coating"). |
| Steg 4 | Velg tidspunkt | En interaktiv kalender henter ledige tidsluker i sanntid fra Avio ED. Logikken må kalkulere ledig kapasitet basert på input til bemanning: tjenestenes varighet · tilgjengelige ansatte/ressurser · angitte buffere og maks antall samtidige biler per avdeling. |
| Steg 5 | Mersalg (Add-ons) | Viser anbefalte tilleggstjenester (f.eks. "Asfaltfjerning +450,-" eller "Seterens +500,-") basert på valgt hovedtjeneste. |
| Steg 6 | Oppsummering | Viser valgt avdeling, registreringsnummer, valgte tjenester, dato/tidspunkt, samt en spesifisert prisoppsummering inkl. mva. eks. «handlekurv». |
| Steg 7 | Bekreftelse | Brukeren trykker "Bekreft booking". Ordren skrives umiddelbart inn i Avio ED/POS. Det utløses en umiddelbar bekreftelse på SMS/e-post til kunden. |

**FR-2.2: Vipps Logg inn & Kundeklubb-sjekk**

- Beskrivelse: Forenklet identifisering under bookingløpet via Vipps.
- Detaljerte krav:
  - Tidlig i bookingflyten (eller integrert i Steg 2/3) skal brukeren få valget om å
    trykke "Logg inn med Vipps".
  - Ved suksessfull autentisering hentes navn, telefonnummer og e-post.
  - Systemet skal gjøre et automatisk API-oppslag mot ekstern kundedatabase
    (kundeklubb) for å sjekke lojalitetsstatus. Dersom kunden har rabattavtaler
    eller klippekort, skal prisene i Steg 3 og Steg 6 automatisk oppdateres i
    henhold til dette.

**FR-2.3: Endring og avbestilling**

- Beskrivelse: Selvbetjent håndtering av avtaler for å avlaste kundeservice.
- Detaljerte krav:
  - Kunder skal kunne avbestille eller flytte timen sin via en unik lenke i
    SMS/e-post-bekreftelsen, eller ved å logge inn på «Min side».
  - Forretningsregel: Avbestilling/endring skal kun være tillatt dersom det skjer
    før en tidsfrist definert sentralt i backend (f.eks. senest 24 timer før timen
    starter). Hvis fristen har utløpt, skal kunden informeres om å kontakte
    avdelingen direkte via telefon.

### 3.3 Mersalgsmodul (Upsell & Cross-sell Engine)

Systemet skal ha en regelstyrt motor for mersalg som kan administreres sentralt,
men differensieres per avdeling.

- **FR-3.1: Pre-booking (Før bestilling):** Mulighet til å konfigurere "Pakker" i
  CMS-en (f.eks. "Gullvask + Innvendig shine = Spar 200,-") som markedsføres på
  forsiden.
- **FR-3.2: In-checkout (Under bestilling):** I Steg 5 skal systemet sjekke matrisen
  for "ofte valgt sammen med" (cross-sell). Hvis kunden har valgt utvendig vask,
  skal det foreslås "Dekksideretursjering" eller "Ruteforsegling".
- **FR-3.3: Post-checkout (Etter bestilling):** Etter utført oppdrag (trigger fra Avio
  POS ved ferdigstilt bil) skal det sendes en automatisk oppfølging på SMS/e-post
  med takk for besøket, samt et unikt tilbud om "Gjenta samme behandling innen
  6 uker og få 15 % rabatt".

### 3.4 Kundeportal («Min side»)

Sikker og personverngodkjent portal for sluttkunder.

- **FR-4.1: Autentisering og GDPR**
  - Innlogging skal skje enten via Vipps Logg inn eller engangskode på SMS/e-post
    (passordløst).
  - Siden skal inneholde en "Slett meg"-knapp eller henvisning som tilfredsstiller
    GDPR-kravet om sletting ("retten til å bli glemt").
- **FR-4.2: Dashbord og Historikk**
  - Visning av "Kommende avtaler" med dato, klokkeslett, avdeling og status
    (f.eks. "Mottatt", "Arbeid pågår").
  - Visning av historiske bookinger og kjøpte produkter, eksplisitt knyttet til
    registreringsnummeret som ble benyttet ved det spesifikke oppdraget.
- **FR-4.3: Digitalt Kvitteringsarkiv**
  - Systemet skal via API mot Avio POS/ED hente ut offisielle PDF-kvitteringer for
    alle fullførte og betalte ordrer.
  - Kvitteringene må lagres og være tilgjengelige for nedlastning i minimum 6 år i
    tråd med bokføringsloven.

### 3.5 Administrasjon og Backend (Backoffice i Avio ED)

Dette er kravene til administrasjonsgrensesnittet som kasseleverandør skal
klargjøre i backend for ledere og ansatte i HandzOn.

- **FR-5.1: Avdelingsadministrasjon** (mulig dette kun krever integrasjon med ED)
  - Løsningen må ha et overordnet admin-grensesnitt der superbrukere kan
    opprette nye avdelinger.
  - Mulighet for å sette ordinære åpningstider per ukedag, samt legge inn
    "avvikende åpningstider" for spesialdager (f.eks. julaften, påske og andre
    helligdager).
  - Mulighet for å skrive unik tekst til avdelingsspesifikke e-post-/SMS-varsler.
- **FR-5.2: Tjeneste- og Prisstyring**
  - Sentral matrise hvor man definerer en tjeneste (f.eks. "Polering"), setter
    standard estimert tidsbruk (f.eks. 120 minutter), tildeler nødvendige ressurser
    (f.eks. krever 1 ledig poleringshall og 1 fagarbeider), samt pris.
  - Mulighet til å overstyre priser per avdeling (f.eks. høyere priser i Oslo enn i
    mindre byer).
- **FR-5.3: Automatisert Kommunikasjonsmotor**
  - Trigger-basert system som sender ut meldinger basert på hendelser i databasen:
    - Event: Booking bekreftet ➔ Send e-post og SMS med detaljer, adresse og
      lenke til avbestilling.
    - Event: 24 timer før timen ➔ Send påminnelse på SMS.
    - Event: Ordre fullført i POS ➔ Send kvitteringsvarsel og lenke til evaluering /
      mersalgstilbud.
  - Alle kritiske feilmeldinger eller spesifikke systemhendelser skal kunne rute en
    kopi direkte til hovedkontoret via e-post.

## 4. Ikke-funksjonelle krav (NFR)

**NFR-1: Brukervennlighet og Design (UX/UI)**

- Krav: Grensesnittet skal designes kompromissløst etter "Mobil først"-prinsippet.
- Akseptansekriterium: Hele bookingløpet skal kunne gjennomføres på en standard
  smarttelefon med kun én hånd (tommel-vennlig plassering av knapper).
  Inputfeltet for bilens registreringsnummer skal automatisk trigge et tastatur
  optimert for bokstaver og tall på iOS og Android, og tvinge frem blokkbokstaver
  automatisk uten at brukeren må trykke "Shift" på telefonen.

**NFR-2: Søkemotoroptimalisering (SEO)**

- Krav: Nettsiden skal teknisk sett oppnå en score på minimum 90/100 på Google
  Lighthouse på områdene "Performance" og "SEO".
- Akseptansekriterium: Semantisk HTML-struktur (h1, h2, h3), automatiske
  sitemaps, unike meta-titler/beskrivelser for hver enkelt avdelingsside, samt
  lynhurtig lastetid (bruk av moderne bildeformater som WebP/AVIF og
  SSR/ISR-teknologi).

**NFR-3: Integrasjoner og Sikkerhet**

- Krav: Sømløs og feiltolerant API-arkitektur.
- Akseptansekriterium: All kommunikasjon mellom nettsiden og Avio MYO0 /
  Avio ED / Avio POS må skje over kryptert HTTPS (TLS 1.3) med sikker
  API-token-autentisering. Dersom et eksternt API (f.eks. kundeklubb-databasen)
  er nede, skal ikke nettsiden krasje; systemet skal da midlertidig falle tilbake på
  standard prislister.

**NFR-4: Fremtidig skalerbarhet (Fase 2+)**

Arkitekturen som utvikles i 2026 må klargjøres i datamodellen for følgende
planlagte utvidelser:

1. **Integrert betaling:** Klargjøring for nettbetaling og forhåndsbetaling direkte i
   kassen via Vipps API og godkjent betalingsforhandler (PSP) for kredittkort.
2. **Automatisk Nøkkelutlevering:** API-arkitektur klargjort for integrasjon mot
   smarte nøkkelskap/bokser (slik at kunder kan levere/hente bilnøkler utenom
   bemannede åpningstider).
3. **Tilleggsmoduler:** Grensesnitt og datastruktur som tillater fremtidig utvidelse
   til dekkskift-booking, dekkhotell-administrasjon og lagersaldo på fysiske dekk.

## 5. Prosjektfaser og Godkjenning

Prosjektet skal følge den iterative modellen beskrevet i prosjektplanen:

1. **Fase 1: Foranalyse** (Endelig låsing av denne kravspesifikasjonen).
2. **Fase 2: Design & UX** (Produksjon av wireframes for mobil og desktop).
3. **Fase 3: Utvikling** (Koding av frontend, backend-logikk og API-koblinger).
4. **Fase 4: Innhold** (Legge inn avdelingsdata, bilder og kalenderoppsett).
5. **Fase 5: Testing** (Ende-til-ende-testing av bookingflyt, Vipps-pålogging og
   SMS-varsler).
6. **Fase 6: Lansering** (Produksjonssetting og overlevering).

**Målsetning for ferdigstillelse: Innen utgangen av september 2026.**
