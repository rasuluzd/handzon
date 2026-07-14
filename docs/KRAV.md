# Kravregister — Handz On Auto Care digital plattform

> **Status:** Rekonstruert kravregister basert på kravspesifikasjon v2.0 slik kravene er kjent
> fra prosjektdialogen. **Avstemmes mot `kravspesifikasjon.md` (v2.0) når filen committes til
> repoet.** Avvik mellom dette registeret og original kravspesifikasjon skal løses i favør av
> originalen.

Hvert krav har en ID som brukes til sporbarhet i [`IMPLEMENTASJONSPLAN.md`](./IMPLEMENTASJONSPLAN.md)
og i demoen. Kolonnen «Demo» angir om kravet er illustrert i den kjørbare demoen (med mock-data)
eller kun beskrevet i planen.

## Funksjonelle krav (FR)

### FR-1 Markedsnettside

| ID | Krav | Demo |
|---|---|---|
| FR-1.1 | Offentlig markedsnettside med tjenestepresentasjon, priser og tydelige bestillings-CTA-er. Mobil først. | ✅ Forside + tjenesteseksjoner |
| FR-1.2 | Avdelingsoversikt med søk (by/postnummer) og kartvisning; egen side per avdeling med åpningstider, kontaktinfo og lokale priser. | ✅ `/avdelinger` + `/avdelinger/[slug]` (forenklet kart) |
| FR-1.3 | Kampanjer og innhold redigerbart av kjedeadministrasjon uten utvikler (CMS). | 📄 Plan (Payload CMS); demo viser kampanjeflater med mock-innhold |

### FR-2 Bookingflyt

| ID | Krav | Demo |
|---|---|---|
| FR-2.1 | 7-stegs lukket bookingtrakt: (1) avdeling → (2) registreringsnummer → (3) tjeneste → (4) tidspunkt → (5) tilleggstjenester → (6) oppsummering → (7) bekreftelse. Tilbake-navigasjon uten datatap. | ✅ `/booking` |
| FR-2.1.2 | Regnr-oppslag: auto-uppercase, trim, numerisk/alfanumerisk tastatur på mobil (`inputmode`), kjøretøydata hentes fra Statens vegvesens motorvognregister. | ✅ Mock SVV-adapter |
| FR-2.1.4 | Tidspunktvalg basert på reell kapasitet: tjenestevarighet × ressurser (haller/fagarbeidere) × åpningstider × buffere × maks samtidige biler. | ✅ Mock-kapasitet; full logikk i plan kap. 5 |
| FR-2.2 | Innlogging/identifisering med Vipps (OIDC) eller passordløs OTP før/etter booking; gjestebooking mulig med kontaktinfo. | ✅ Mock Vipps-knapp |
| FR-2.3 | Mersalg i trakten: «ofte valgt sammen»-anbefalinger av tilleggstjenester basert på valgt hovedtjeneste. | ✅ Steg 5 |
| FR-2.4 | Oppsummering med full prisspesifikasjon inkl. mva (25 %), per juridisk enhet (org.nummer på kvittering/bekreftelse). | ✅ Steg 6–7 |

### FR-3 Booking-backend / Avio

| ID | Krav | Demo |
|---|---|---|
| FR-3.1 | Integrasjon mot Avio (MYO0/ED/POS-API) for kalender, kapasitet og ordre — **eller** egen bookingmotor dersom API-tilgang ikke innvilges. Adapter-mønster så begge spor støttes bak samme grensesnitt. | ✅ `BookingAdapter`-interface + `MockBookingAdapter` |
| FR-3.2 | Beslutningspunkt for spor A/B med frist; se risikoregister. | 📄 Plan kap. 1 og 10 |

### FR-4 Kundeportal («Min side»)

| ID | Krav | Demo |
|---|---|---|
| FR-4.1 | Innlogging med Vipps eller e-post/SMS-engangskode (passordløst). | ✅ Mock |
| FR-4.2 | Kommende avtaler med mulighet for endring/avbestilling (frist-regler). | ✅ Visning + mock-avbestilling |
| FR-4.3 | Servicehistorikk per kjøretøy (regnr). | ✅ |
| FR-4.4 | Kvitteringsarkiv (PDF) — kvitteringer stemplet med korrekt org.nummer per avdeling, oppbevart 6 år (bokføringsloven). | ✅ Liste (mock-PDF); lagringskrav i plan kap. 6 |
| FR-4.5 | GDPR-selvbetjening: «Slett meg», samtykkeoversikt, dataeksport. | ✅ «Slett meg»-flyt m/ bokføringslov-forbehold |

### FR-5 Administrasjon og drift av kjeden

| ID | Krav | Demo |
|---|---|---|
| FR-5.1 | Multi-tenant adminmodell: kjede-superadmin (alle org), franchise-admin (kun egen org/avdeling), ansatt. | 📄 Plan kap. 3 (ERD + roller) |
| FR-5.2 | Sentral tjenestekatalog med lokal prisoverstyring og tilgjengelighet per avdeling. | ✅ Mock-overstyringer synlige på avdelingssider |
| FR-5.3 | Automatisert kommunikasjon: bookingbekreftelse, påminnelse (24 t/2 t), «bilen er klar», etterkjøps-oppfølging og reaktivering — SMS + e-post, trigget av hendelser. | 📄 Plan kap. 4 (BullMQ-triggere); demo viser bekreftelsestekst |
| FR-5.4 | Kundeklubb/medlemspriser med **fallback til standard prisliste** når medlemsdata er utilgjengelig (se NFR-3). | 📄 Plan kap. 4 |

## Ikke-funksjonelle krav (NFR)

| ID | Krav | Demo |
|---|---|---|
| NFR-1 | Mobil først: hele bestillingsflyten skal være komfortabel med én tommel på små skjermer (≥360 px bredde). | ✅ |
| NFR-2 | Ytelse: Lighthouse ≥ 90 (Performance/SEO/Accessibility/Best practices) på marked- og avdelingssider. SSR/ISR, semantisk HTML, metadata, sitemap. | ✅ Grunnlag lagt (semantikk, metadata, sitemap); måles i utviklingsfasen |
| NFR-3 | Robusthet: feil i eksterne avhengigheter (kundeklubb, SVV, Avio) skal degradere pent — f.eks. standard prisliste ved medlems-feil, manuell bilinfo ved SVV-feil. | ✅ Manuell fallback i regnr-steget; øvrig i plan |
| NFR-4 | Personvern/GDPR: EU-dataresidens, DPA med alle databehandlere, samtykkehåndtering (Consent Mode v2), sletting med bokføringslov-unntak. | 📄 Plan kap. 6 |
| NFR-5 | Sikkerhet: OWASP ASVS L2, TLS 1.3, rate limiting, audit-logg på persondata, pentest før lansering. | 📄 Plan kap. 6 |
| NFR-6 | Juridisk skille per franchise: all økonomisk aktivitet (ordre, kvittering, bokføringsdata, fremtidige betalingsavtaler) knyttet til riktig org.nummer. | ✅ Org.nr vises på oppsummering/kvittering; modell i plan kap. 3 |
| NFR-7 | Drift: fastpris-infrastruktur i EU, backup med PITR og dokumentert gjenoppretting, overvåking med varsling, definert SLA. | 📄 Plan kap. 7 |
| NFR-8 | Ingen leverandørinnlåsing: åpen kildekode-komponenter, standard Docker/Postgres/S3-grensesnitt, exit-plan. | 📄 Plan kap. 2 og 7 |

## Avgrensninger (fase 2+)

- Online betaling (Vipps ePayment per org.nummer), nøkkelskap-integrasjon, dekkhotell-modul — beskrevet som klargjøring i plan kap. 10.
- Native app (iOS/Android) er en priset opsjon; PWA-grunnlag inngår.
