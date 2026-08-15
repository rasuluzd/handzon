# design/ — prototypene

Åpne **`index.html`**. Den lenker til begge flatene.

| Prototype | Fil |
|---|---|
| Kundeflaten | `ui_kits/dagsverkstedet/index.html` |
| Adminpanelet | `ui_kits/admin/index.html` |

## Slik kjører du dem

Filene hentes med `fetch()`, så de må serveres over HTTP — dobbeltklikk på
filen virker ikke i alle nettlesere. Enkleste vei:

```bash
cd design && python3 -m http.server 8000
# åpne http://localhost:8000/
```

## Hva som ligger her

```
index.html                 Launcher
styles.css                 Global inngang — kun @import-linjer
tokens/                    farger, typografi, spacing, radius, dybde, bevegelse
components/components.css  Tilstander for primitivene (hz-*)
ds-boot.js                 Laster komponentbiblioteket
_ds_bundle.js              Ferdigkompilert komponentbibliotek
assets/                    Logo og foto — identisk med repoets public/
ui_kits/data.js            Delt demodata: avdelinger, tjenester, add-ons, priser
ui_kits/dagsverkstedet/    Kundeflaten + dagslys.css (prefiks dg-)
ui_kits/admin/             Adminpanelet + admin.css (prefiks ad-) + sales-data.js
```

## Merk

- Skjermfilene har endelsen `.jsx.txt`. Det er bevisst: de hentes på filnavn og
  skal ikke plukkes opp av noe byggesteg.
- Kartene bruker OpenStreetMap fordi pakken ikke inneholder Google-nøkkelen.
  Sett `window.HZ_GOOGLE_MAPS_KEY` i `index.html` i kittet, så bytter både
  oversiktskartet og avdelingskartene automatisk.
- Salgstallene i adminpanelet er deterministisk generert demodata — samme
  avdeling og dato gir alltid samme tall. Se `../ADMIN.md` § 7.
- Dette er **ikke produksjonskode.** Hent verdiene fra `../TOKENS.md` og
  `../COMPONENTS.md`.
