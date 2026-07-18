# Handoff: Handz On Auto Care — Nettside (mobil + PC)

## Overview
A trust-first, mobile-first website for **Handz On Auto Care**, Norway's largest car-care franchise chain (15 branches). The core action is **booking car care at a shopping-mall branch while you run errands**: *"Lever nøkkelen, gjør ærendene dine, hent en skinnende ren bil."* All copy is Norwegian (Bokmål).

The centerpiece is a **7-step booking funnel** (branch → vehicle → service → time → add-ons → summary → confirmation) that must be frictionless on mobile. There are also a Home page, a Services list, one Service-detail page, a Branches page (map + list), and an About page.

## About the Design Files
The files in `reference/` are a **design reference created in HTML** — a working prototype showing the intended look, layout, copy, and behavior. **They are not production code to copy directly.** `*.dc.html` is a self-contained prototype format (a small runtime, `support.js`, renders a `class Component` + an inline-styled template); `image-slot.js` is a drag-drop image placeholder used only for the prototype.

**Your task:** recreate these designs in the target codebase's own environment using its established patterns. The canonical logic already exists as a **Next.js + TypeScript + Tailwind** app in the GitHub repo **`rasuluzd/handzon`** — this prototype mirrors that repo's data model, pricing math, slot generation, reg-number lookup and geo-ranking exactly (see "Booking logic" below). If you are implementing in that repo, keep its `lib/` logic and match this prototype's **visual design** (light theme, navy accent, Barlow/Source Sans 3). If there's no codebase yet, pick a suitable framework and implement both.

> Note on the prototype runtime: opening `reference/Handz On Nettside.dc.html` may log one harmless warning (`<image-slot> without an id…`) during initial render, and the branch map is drawn as inline SVG via `React.createElement`. Both are prototype-runtime artifacts only — they disappear when you reimplement natively. No functional bugs.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and interactions are all intended as shown. Recreate pixel-accurately with the codebase's component library, but honor the exact tokens and the responsive rules below.

---

## Design Tokens

### Color
| Token | Hex / value | Use |
|---|---|---|
| Canvas / page frame | `#DCDEE3` | Behind the centered app container |
| Surface | `#FFFFFF` | App background, cards |
| Surface alt | `#F4F5F7` | Stat tiles, footer, subtle fills |
| Accent (navy) | `#1e3a70` | Primary buttons, links, active states, prices, logo blue |
| Accent hover | `#294b8c` | Button/link hover |
| Accent tint 06 / 08 / 10 | `rgba(30,58,112,0.06 / 0.08 / 0.10)` | Selected cards, badges, chips |
| Ink (headings) | `#16223A` | Headlines, primary text |
| Body strong / body / body soft | `#333B4A` / `#444C5C` / `#5A6273` | Paragraph text |
| Muted | `#737B8A` | Secondary text |
| Muted light | `#9AA1AD` | Captions, meta |
| Hairline | `rgba(20,32,58,0.10)` – `0.12` | 1px dividers & card borders (never heavy boxes) |
| On-navy text | `#FFFFFF` / `#D6E0F1` / `#EAF0FB` / `#9EB6E0` / `#B7C6E4` | Text on navy panels |
| Disabled button | bg `#E3E5E9`, text `#A5AAB4` | Inactive primary buttons |
| Vipps | `#FF5B24` | Vipps login buttons only |
| Map background / dot / dot-active | `#E4E8EE` / `rgba(30,58,112,0.32)` / `#1e3a70` | Branch map |

Single accent only — **no** turquoise/cyan, no gradients as decoration, no rainbow. Neutrals are cool-grey navy-tinted.

### Typography
- **Headings / numerals / labels / buttons:** `Barlow` (500, 600, 700). Google Fonts.
- **Body:** `Source Sans 3` (400, 500, 600). Google Fonts.
- Scale (px): hero H1 mobile **38**/line-height 1.08; hero H1 desktop **clamp(42, 3.6vw, 58)**/1.04; page H1 **32**/1.1; H2 **25–28**; H3 **19–21**; body **16–18**; small **13–15**; micro **12–13**. Uppercase eyebrow labels: 14, weight 600, letter-spacing 0.1em.

### Radius / borders / shadow / motion
- Radius: **6px** badges/tags, **8px** buttons & inputs, **10–12px** cards, **999px** small status pills.
- Borders: 1px hairlines and `border-top`/`border-bottom` dividers instead of heavy containers. Selected cards use a **2px** accent border.
- Shadow: only the app container (`0 0 60px rgba(20,32,58,0.14)`). Cards are flat with hairline borders.
- Motion: on-scroll reveal = opacity 0→1 + `translateY(14px)`→0, **0.5s ease**, small stagger; hover transitions **0.2s**. Keep it subtle (there is a `reduceMotion` switch).
- Spacing: section padding = mobile `24px` horizontal, desktop `clamp(24px, 4vw, 48px)`; card padding 16–20px; grid gaps 10–14px.

### Responsive
- **Breakpoint: 900px.** `isDesktop = viewportWidth >= 900`.
- App container: `width:100%; max-width:1180px; margin:0 auto` (centered, white, on the `#DCDEE3` canvas).
- **Mobile (<900):** stacked hero (image on top, navy text panel below), **hamburger** menu → full-screen overlay nav, all card lists single-column, buttons full-width.
- **Desktop (≥900):** sticky header with **horizontal nav** (Forside / Tjenester / Avdelinger / Om oss + navy "Bestill time" button); **two-column hero** (navy text left `1.05fr`, image right `0.95fr`, min-height `clamp(440px,40vw,580px)`); card sections use `display:grid; grid-template-columns:repeat(auto-fit, minmax(300–330px, 1fr))`; **booking column capped at 680px** centered; **service-detail capped 760px**; list pages capped **1160px**.

---

## Screens / Views

### Global chrome
- **Header** — sticky, translucent white (`rgba(255,255,255,0.94)` + blur), bottom hairline. Logo left (`assets/logo-original.webp`, height 38–40px, → Home). Right: hamburger (mobile) or horizontal nav + "Bestill time" (desktop).
- **Mobile nav overlay** — full-screen white; large Barlow 26px links with hairline dividers; bottom "Bestill time" primary button + "15 avdelinger over hele Norge".
- **Footer** — `#F4F5F7`, top hairline. Logo, link row (Tjenester / Avdelinger / Om oss / Bestill time), fine-print: `© 2026 Handz On Auto Care · Franchisekjede med 15 lokale avdelinger. Hver avdeling drives av egen juridisk enhet. Alle avdelinger er registrert i Arbeidstilsynets godkjenningsordning for bilpleie.` Footer hidden during the booking flow.

### 1. Forside (Home)
- **Hero** — badge "● Book mens du handler"; H1 "Lever nøkkelen.<br>Hent bilen ren."; sub "Vi tar bilen mens du gjør ærendene dine på senteret. Grundig bilpleie, gjort for hånd — klar når du er ferdig."; primary "Bestill time" (white on navy hero / navy on white elsewhere) + secondary "Finn din avdeling". Navy panel `#1e3a70`.
- **Stat strip** — 3 cells with hairline dividers: **15** avdelinger · **120 000+** biler behandlet · **4,8** av 5 i score.
- **Slik gjør du** — eyebrow + 3 numbered steps (1 Lever nøkkelen / 2 Gjør ærendene dine / 3 Hent en ren bil), each a title + one line, separated by `border-top` hairlines (3-col grid on desktop).
- **Populære tjenester** — heading + "Se alle →"; 4 popular services as rows/cards (60px image slot, name, `category · duration`, "fra {price}"). Card hover: border → navy.
- **Finn din avdeling** — heading + branch **SVG map** (real lat/lng dots) + first 4 branches (name, `city · region`, "Book →") + "Se alle 15 avdelinger".
- **Trygghet** — hairline-bordered note: "Alle avdelinger er registrert i Arbeidstilsynets godkjenningsordning for bilpleie."
- **Kundeklubb CTA** (toggleable) — navy card: "10 % på hovedvasken — hver gang", sub about free membership + Vipps, "Bli medlem — gratis".

### 2. Tjenester (Services list)
Eyebrow + H1 "Alt innen bilpleie" + "Faste priser, ingen overraskelser. Lokale avvik vises per avdeling." Services **grouped by category** (Utvendig, Innvendig, Komplett, Lakk og beskyttelse), each group a small uppercase header + cards (64px image slot, name, duration, "fra {price}", "Se mer →"). Tapping a card → Service-detail.

### 3. Tjeneste-detalj (Service detail)
Full-width image (220px) with a floating "← Tjenester" back button. Category chip (+ "Populær" chip if popular). H1 = service name, description paragraph. Facts row (hairline top/bottom): "Pris fra {price}" (Barlow 28) and "Varighet {duration}". **"Ofte valgt sammen"** = up to 3 affinity add-ons (name, description, "+ {price}"). Fine print: "Prisen er kjedens standardpris inkl. mva. Enkelte avdelinger har egne lokalpriser." Sticky bottom bar: "Legg til i booking · {price}" → booking with this service preselected (starts at step 1). Capped 760px on desktop.

### 4. Avdelinger (Branches)
Eyebrow + H1 "15 avdelinger i Norge" + branch **SVG map**. Search input ("By eller postnummer, f.eks. Bergen") + "📍 Nær meg". A ranking note line appears when searching/locating. Branch cards (grid on desktop): "Handz On {name}" (+ distance in accent when geolocated), "{address}, {postal} {city}", "● Åpen nå" chip, optional campaign chip (accent tint), hours block (Man–fre 08–17 (tors. 18) / Lør 10–15 / søn stengt), "Book her" → booking with branch preselected (starts at step 2).

### 5. Booking (7-step funnel) — most important
Chrome: "← Tilbake" (hidden on step 1 & 7), "Steg N av 7", a 7-segment thin progress bar (filled segments = accent), and the current step label. Column capped **680px** on desktop.

1. **Avdeling** — search + "Nær meg" + ranked branch list; radio-style select cards (2px accent border + filled ✓ when selected). Selecting **auto-advances to step 2** and resets any chosen date/time.
2. **Bilen din** — large centered monospace-feel reg-number input (uppercase, letter-spacing), "Hent bilinfo" (disabled until valid). On success: a found-vehicle card ("Vi fant bilen din" + make/model/year + fuel · color) and "Dette stemmer — gå videre" → step 3. On failure: manual make/model fields + "Fortsett uten oppslag" → step 3.
3. **Tjeneste** — Vipps login card (or member banner once logged in); services grouped by category, filtered by **local availability**; prices reflect **local overrides**; when member, show struck-through standard price + accent member price. Selecting **auto-advances to step 4**.
4. **Tidspunkt** — horizontal scroll of day chips (14 upcoming days; weekday / day-number / month; selected = navy). Below: "Ledige tider {date}" grid (3 cols) of time slots with capacity subtext ("1 plass igjen" / "N plasser"). Empty state: "Ingen ledige tider denne dagen — prøv en annen dag." Selecting a slot **auto-advances to step 5**.
5. **Tillegg** — add-ons sorted with recommended first ("Ofte valgt sammen" pill), toggle select (✓). Sticky bar: "Gå videre med N tillegg" / "Gå videre uten tillegg" → step 6.
6. **Oppsummering** — summary card (Avdeling / Bil / Tidspunkt, each with "Endre" → jumps back). Price spec: service line, add-on lines, "Kundeklubb-rabatt (10 %)" (accent, when member), "Herav mva. (25 %)" (exact 2-decimal), "Å betale ved henting" total, seller org line. Contact card (Navn + Mobilnummer, optional "Fyll ut med Vipps"). Primary "Bekreft bestilling – {total}" (disabled until name > 1 char and phone ≥ 8 chars). Fine print: "Gratis avbestilling frem til 24 timer før avtalt tid."
7. **Bekreftelse** — check badge + "Takk for bestillingen!" + "Referanse {HOAC-XXXX}. Bekreftelse er sendt på SMS." Digital **receipt** card: navy header "Handz On Auto Care / Kvittering"; rows Referanse, Tjeneste (+ Tillegg), Avdeling, Tidspunkt, Bil; dashed divider; "Å betale ved henting {total}"; a barcode strip; "Utstedes av org.nr {org}. Kvitteringen legges på Min side etter utført behandling." Buttons "Last ned kvittering (PDF)" + "Til forsiden".

### 6. Om oss (About)
Full-width image (240px) → navy intro band (eyebrow "Om oss", H1 "Kvalitet du kan stole på", lead about 15 local franchise branches). Stat tiles (15 avdelinger / 120k+ biler). Three principles (Vasket for hånd / Godkjent og seriøs / Tid tilbake til deg) as hairline-separated blocks (3-col grid on desktop). Closing "Bestill time".

---

## Booking logic (mirror of `rasuluzd/handzon` `lib/`)

**Prices are stored in øre** (1 kr = 100 øre). Format with `nb-NO`: whole kr → `"399 kr"`, `"1 499 kr"`; VAT (may have decimals) → `"495,60 kr"`.

- **Effective price** = local override for `(locationId, serviceId)` if present, else the service's `priceOre`.
- **Availability** = false if an override marks `(locationId, serviceId)` unavailable.
- **Member discount** = `round(servicePrice * 0.10 / 100) * 100` øre (rounded to whole kroner), applied to the service only; member rate `MEMBER_DISCOUNT_RATE = 0.10`.
- **Total** = servicePrice + Σ add-on prices − memberDiscount.
- **VAT (25 %, prices incl. VAT)** = `round(total / 5)`.
- **Booking reference** = `"HOAC-" + (hash(locationId:regNr:date:time) % 9000 + 1000)` (FNV-1a hash).
- **Reg number**: normalize (uppercase, strip spaces/hyphens); valid = `/^[A-Z]{2}\d{5}$/`. Lookup is deterministic; known demo plates: `EB12345` Tesla Model Y (2023, Elektrisk, Hvit), `DR34567` VW Golf (2019, Bensin, Grå), `SU98765` Volvo XC60 (2021, Diesel, Svart), `EK55443` Hyundai Kona Electric (2024, Elektrisk, Blå). `FE11111` intentionally returns null → shows the manual fallback. Any other valid plate → deterministic pseudo make/model/year/fuel/color from the hash (simulate ~450ms latency).
- **Slot generation** (per branch/day): opening hours by weekday (Mon=0…Sun=6); Sunday closed. Usable window = `open … close − (serviceDuration + Σ addOnDurations + 15min buffer)`, rastered every **30 min**. Occupancy is deterministic (mulberry32 seeded by `locationId:date`): demand 0.55 before 12:00 else 0.35, `taken = floor(rnd * (maxCars+1) * demand)`, `capacityLeft = max(0, maxCars − taken)`; only slots with capacity > 0 are offered. Days list = the next **14 days** starting tomorrow.
- **Geo ranking (search + "Nær meg")**: with a browser position → sort by Haversine distance (show km). Else with a postal-code query → sort by nearest branch postal code. Else with a city/name/region match → use the match as anchor and sort by distance. Else → show all branches (never an empty list), with an explanatory note.
- **Opening hours (all branches):** Mon–Wed 08–17, **Thu 08–18**, Fri 08–17, Sat 10–15, Sun closed.

## State (booking)
`page`, `step (1–7)`, `locationId`, `regNr`, `vehicle`, `vehicleStatus (idle|loading|found|error)`, `manualMake`, `manualModel`, `serviceId`, `selectedDay`, `date`, `time`, `addOnIds[]`, `contactName`, `contactPhone`, `member`, `orderRef`, `orderData`, plus search state `locQuery`, `locPosition` and layout `vw` (→ `isDesktop`). Changing branch or service clears the chosen date/time. Selecting on steps 1/3/4 auto-advances. "Endre" on the summary jumps back to the relevant step. Vipps login sets `member = true` and prefills contact (`Kari Nordmann` / `91234567`).

## Data model
15 branches, 8 services (4 categories, `popular` flag), 6 add-ons, an add-on **affinity** map (recommended add-ons per service), and **local price/availability overrides**. The full seed data (exact names, org numbers, addresses, postal codes, cities, regions, lat/lng, `maxConcurrentCars`, campaigns, prices in øre, durations, descriptions) is in the prototype logic class and is identical to the repo's `lib/mock-data.ts`. Key overrides: Oslo Skøyen Komplett 2 399 kr & Utvendig håndvask 449 kr; Stavanger Forus Komplett 1 999 kr; Sandvika Keramisk coating 7 499 kr; Tromsø coating unavailable; Ski polering unavailable.

## Assets
- `reference/assets/logo-original.webp` — official Handz On Auto Care wordmark (full color; use on light backgrounds).
- `reference/assets/logo-white.png` — white version (for navy/dark backgrounds).
- Photography is intentionally **placeholder** (dark image slots): hero, service thumbnails, service-detail hero, about hero, and the two branch maps (the map itself is real SVG from lat/lng, not a placeholder). Swap in cinematic, calm car-care photos. Fonts: Barlow + Source Sans 3 (Google Fonts).

## Files
- `reference/Handz On Nettside.dc.html` — the full prototype (design template + complete logic/data). Primary reference.
- `reference/support.js`, `reference/image-slot.js` — prototype runtime + image-placeholder component (needed only to open the prototype; do not port).
- `reference/assets/*` — logos.
- Canonical production logic: GitHub `rasuluzd/handzon` (`lib/`, `app/booking/wizard.tsx`).
