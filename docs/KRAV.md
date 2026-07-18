# Kravregister — Handz On Auto Care digital plattform

> **Status:** Avstemt mot original kravspesifikasjon v2.0, som ligger ordrett i
> [`kravspesifikasjon.md`](./kravspesifikasjon.md). ID-ene under følger originalens
> nummerering. Krav som kommer fra prosjektdialogen (og ikke står i kravspesifikasjonen)
> er skilt ut som **T-krav** nederst.

Kolonnen «Demo» angir om kravet er illustrert i den kjørbare demoen (med mock-data)
eller kun beskrevet i [`IMPLEMENTASJONSPLAN.md`](./IMPLEMENTASJONSPLAN.md).

## Funksjonelle krav (FR) — fra kravspesifikasjonen

### FR-1 Markedsnettside og avdelingssider (CMS)

| ID | Krav | Demo |
|---|---|---|
| FR-1.1 | Forside med konverteringsfokus: hero-CTA «Bestill bilpleie» rett inn i steg 1, 3–4 populære tjenester med «Bestill denne» (forhåndsvalg), social proof (anmeldelser/godkjenningsmerker). | ✅ Forside |
| FR-1.2 | Avdelingsoversikt: geolokasjon via nettleser med automatisk sortering etter nærhet, søk på postnummer/by, kartvisning med pins. | ✅ `/avdelinger` («Bruk min posisjon» + søk + forenklet kart) |
| FR-1.3 | Dedikert side per avdeling (unik URL, lokal SEO): åpningstider/kontaktinfo/adresse dynamisk fra Avio ED, tjenester og priser per avdeling, lokal kampanjeseksjon, CTA med forhåndsvalgt avdeling. | ✅ `/avdelinger/[slug]` (mock-adapter i stedet for Avio ED) |

### FR-2 Timebestilling

| ID | Krav | Demo |
|---|---|---|
| FR-2.1 | 7-stegs lukket trakt: (1) avdeling — foreslår automatisk nærmeste basert på lokasjon → (2) regnr — auto-uppercase, fjerner mellomrom, oppslag mot Statens vegvesen, data følger ordren → (3) tjeneste — kategorisert per avdeling → (4) tidspunkt — sanntidskapasitet fra varighet × ressurser × buffere × maks samtidige biler → (5) mersalg → (6) oppsummering m/ spesifisert pris inkl. mva → (7) bekreftelse — ordren skrives til Avio ED/POS, umiddelbar SMS/e-post. | ✅ `/booking` (steg 1 m/ posisjonsforslag; mock-adapter) |
| FR-2.2 | Vipps Logg inn tidlig i flyten (steg 2/3): henter navn/telefon/e-post, automatisk kundeklubb-oppslag; rabattavtaler/klippekort oppdaterer prisene i steg 3 og steg 6 automatisk. | ✅ Mock-Vipps i steg 3; medlemspriser slår gjennom i steg 3 og 6 |
| FR-2.3 | Selvbetjent endring/avbestilling via unik lenke i SMS/e-post eller Min side. Frist definert sentralt (f.eks. 24 t); etter frist henvises kunden til å ringe avdelingen. | ✅ Min side (avbestilling + fristtekst); lenke-flyt i plan kap. 4 |

### FR-3 Mersalgsmodul

| ID | Krav | Demo |
|---|---|---|
| FR-3.1 | Pre-booking: «Pakker» konfigurerbare i CMS, markedsføres på forsiden. | 📄 Plan (Payload); forsiden viser tjenestekort m/ forhåndsvalg |
| FR-3.2 | In-checkout: steg 5 sjekker «ofte valgt sammen»-matrisen og foreslår tilleggstjenester ut fra valgt hovedtjeneste. | ✅ Steg 5 |
| FR-3.3 | Post-checkout: trigger fra Avio POS ved ferdigstilt bil → takk + unikt tilbud («gjenta innen 6 uker, 15 % rabatt»). | 📄 Plan kap. 4 (kommunikasjonsmotor) |

### FR-4 Kundeportal («Min side»)

| ID | Krav | Demo |
|---|---|---|
| FR-4.1 | Passordløs innlogging (Vipps eller engangskode SMS/e-post) + «Slett meg» (retten til å bli glemt). | ✅ Mock-innlogging + «Slett meg»-flyt m/ bokføringslov-forbehold |
| FR-4.2 | Dashbord: kommende avtaler med dato/tid/avdeling/status («Mottatt», «Arbeid pågår»); historikk eksplisitt knyttet til regnr brukt på oppdraget. | ✅ |
| FR-4.3 | Digitalt kvitteringsarkiv: offisielle PDF-kvitteringer via API mot Avio POS/ED, nedlastbare i minimum 6 år (bokføringsloven). | ✅ Liste (mock-PDF); lagringskrav i plan kap. 6 |

### FR-5 Administrasjon og backend (backoffice i Avio ED)

| ID | Krav | Demo |
|---|---|---|
| FR-5.1 | Avdelingsadministrasjon: superbrukere oppretter avdelinger; ordinære åpningstider per ukedag + avvikende åpningstider for spesialdager; unik tekst per avdeling i e-post-/SMS-varsler. | 📄 Plan kap. 3–4 |
| FR-5.2 | Sentral tjeneste-/prismatrise: tjeneste m/ estimert tidsbruk og ressurskrav (hall/fagarbeider) og pris; prisoverstyring per avdeling. | ✅ Lokale priser synlige på avdelingssider og i booking |
| FR-5.3 | Trigger-basert kommunikasjonsmotor: booking bekreftet → e-post+SMS m/ avbestillingslenke; 24 t før → SMS-påminnelse; ordre fullført i POS → kvitteringsvarsel + evaluering/mersalg. Kritiske feil ruter kopi til hovedkontoret på e-post. | 📄 Plan kap. 4; demo viser bekreftelsestekst |

## Ikke-funksjonelle krav (NFR) — fra kravspesifikasjonen

| ID | Krav | Demo |
|---|---|---|
| NFR-1 | Kompromissløst mobil først: hele bookingløpet med én hånd/tommel; regnr-feltet trigger riktig tastatur på iOS/Android og tvinger blokkbokstaver uten Shift. | ✅ |
| NFR-2 | Lighthouse ≥ 90/100 på **Performance** og **SEO**: semantisk HTML, automatiske sitemaps, unike meta-titler/-beskrivelser per avdelingsside, WebP/AVIF, SSR/ISR. | ✅ Grunnlag lagt; måles i fase 5 |
| NFR-3 | Feiltolerant API-arkitektur: TLS 1.3 + API-token mot Avio MYO0/ED/POS; ved nede eksternt API (f.eks. kundeklubb) skal siden ikke krasje — fallback til standard prislister. | ✅ SVV-fallback i steg 2; kundeklubb-fallback i plan kap. 4 |
| NFR-4 | Fase 2+-klargjøring i datamodellen: (1) integrert betaling via Vipps API + PSP for kredittkort, (2) automatisk nøkkelutlevering (smarte nøkkelskap), (3) dekkskift-booking, dekkhotell og lagersaldo på dekk. | 📄 Plan kap. 10.2 |

## Tilleggskrav fra prosjektdialogen (T)

Disse står ikke i kravspesifikasjonen, men er avklart med oppdragsgiver og styrer
arkitekturen:

| ID | Krav | Kilde/plan |
|---|---|---|
| T-1 | Franchise = multi-tenant med **juridisk skille per org.nummer** (15 juridiske enheter): kvitteringer, bokføring (6 år per org), prisoverstyring og fremtidige betalingsavtaler skilles per org. Kjede-superadmin + franchise-admin. | Plan kap. 3; demo viser org.nr på oppsummering/kvittering |
| T-2 | Billigst og mest effektivt over tid: selveid drift på fastpris-cloud i EU, ikke usage-fakturert SaaS. | Plan kap. 2 og 7 |
| T-3 | Avio-tilgang er uavklart → port/adapter-mønster med spor A (Avio, som kravspesifikasjonen forutsetter) og spor B (egen bookingmotor) bak samme grensesnitt. | Plan kap. 1.2 og 5; `lib/booking-adapter.ts` |
| T-4 | Ingen leverandørinnlåsing: åpen kildekode, standard Docker/Postgres/S3, exit-plan. | Plan kap. 7.2 |
| T-5 | Utvidet sikkerhet/personvern for drift: OWASP ASVS L2, EU-dataresidens, DPA-er, audit-logg, pentest før lansering. | Plan kap. 6 |
| T-6 | App er priset opsjon (fastpris, timepris eksponeres ikke); PWA-grunnlag inngår i web. | Plan kap. 9 |
