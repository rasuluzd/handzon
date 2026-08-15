---
name: handzon-dagsverkstedet
description: Implementer art direction-retningen «Dagsverkstedet» i handzon-repoet — kundeflaten (nettside, 7-stegs booking, Min side) og adminpanelet (salgsrapport, tjenester og priser, blogg). Bruk denne når du skal bygge, endre eller utvide Handz On Auto Care sine flater.
---

Les `README.md` i denne mappen først. Den beskriver seks PR-er i rekkefølge.

Deretter, avhengig av oppgaven:

- **Tokens og farger** → `TOKENS.md`. Ikke rund av verdier, ikke bytt til
  Tailwind-defaults. Står det 13,5px, skriv `text-[13.5px]`.
- **Primitiver** (Button, Card, Tag, Price, StepProgress) → `COMPONENTS.md`,
  ferdig kode i `code/`.
- **Kundeflatens skjermer** → `SCREENS.md`.
- **Adminpanelet** → `ADMIN.md`. Ny flate; les § 0 om de tre avklaringene først.
- **Animasjoner** → `MOTION.md`. Varigheter fra `design/tokens/motion.css`.
- **Tekst og copy** → `CONTENT.md`. Norsk bokmål, du-form, `1 490,-`,
  «inkl. mva» på totalsummer. Ikke oversett, ikke omskriv.

Klikk gjennom prototypene i `design/index.html` mens du jobber — de viser
tiltenkt utseende, tilstander og oppførsel med ekte innhold.

Tre regler som ikke forhandles:

1. **Norsk bokmål i all UI.** Ingen engelske ord i knapper eller etiketter.
2. **«inkl. mva» på hver totalsum**, og prisformatet `1 490,-`.
3. **Primærknappen bor i nederste tredjedel på mobil** når skjermen har en
   flyt-oppgave. Mobil bygges først.

`design/` er designreferanse, ikke produksjonskode. Hent verdier fra
dokumentasjonen, ikke ved å kopiere prototypefilene.
