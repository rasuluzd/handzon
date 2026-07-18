# Handz On Auto Care — digital plattform

Ny digital plattform for Handz On Auto Care: markedsnettside, 7-stegs bookingflyt,
kundeportal («Min side»), mersalgsmotor og automatisert kommunikasjon — for en
franchisekjede med 15 avdelinger, hver med eget org.nummer.

## Innhold i repoet

| | |
|---|---|
| [`docs/kravspesifikasjon.md`](docs/kravspesifikasjon.md) | Kundens kravspesifikasjon v2.0 (ordrett) |
| [`docs/KRAV.md`](docs/KRAV.md) | Kravregister (FR/NFR + T-krav fra prosjektdialog) med sporbarhet til demo og plan |
| [`docs/IMPLEMENTASJONSPLAN.md`](docs/IMPLEMENTASJONSPLAN.md) | Omfattende implementasjonsplan: arkitektur, teknologivalg, datamodell, integrasjoner, sikkerhet/GDPR, drift, fremdrift, fastpris og risiko |
| `app/`, `components/`, `lib/` | **Kjørbar demo** (mobil først) på mock-adaptere — ingen database nødvendig |

## Demoen

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) — helst i mobil-viewport.

- **Forside** — hero, populære tjenester med «Bestill denne», social proof m/ godkjenningsmerke
- **/avdelinger** — søk (by/postnummer), «📍 Nær meg» (geolokasjon sorterer etter avstand) + forenklet kartvisning; egen side per avdeling med åpningstider, lokale priser og kampanjer
- **/booking** — 7-stegs bookingtrakt: avdeling (m/ posisjonsforslag) → regnr (mock SVV-oppslag, prøv `EB12345`; `FE11111` demonstrerer fallback) → tjeneste (m/ «Logg inn med Vipps» → kundeklubb-medlemspriser) → tidspunkt → tillegg («ofte valgt sammen») → oppsummering m/ mva, ev. medlemsrabatt og org.nr → bekreftelse
- **/min-side** — mock Vipps-innlogging: kommende avtaler, historikk per regnr, kvitteringer, «Slett meg»

All bookinglogikk går gjennom `BookingAdapter`-grensesnittet i
[`lib/booking-adapter.ts`](lib/booking-adapter.ts) — porten som i produksjon får
en Avio-implementasjon (spor A) eller egen bookingmotor (spor B), se plan kap. 1.2.

Alle data er fiktive.

## Teknologi

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4. Produksjonsarkitektur
(Payload CMS, PostgreSQL, Redis/BullMQ, Hetzner/Coolify) beskrives i implementasjonsplanen.
