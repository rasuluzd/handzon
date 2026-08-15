# code/ — klar til å limes inn

TypeScript/Tailwind skrevet mot `handzon`-repoets egne konvensjoner.

| Fil | Går til |
|---|---|
| `globals.css` | `app/globals.css` — erstatter hele filen |
| `button.tsx.txt` | `components/ui/Button.tsx` |
| `card.tsx.txt` | `components/ui/Card.tsx` |
| `hero.tsx.txt` | `components/site/Hero.tsx` (ny fil) |
| `step-progress.tsx.txt` | `components/booking/StepProgress.tsx` (ny fil) |

Filene har endelsen `.tsx.txt` her. Det er bevisst: dette prosjektet er selv et
designsystem, og kompilatoren plukker opp alle `.tsx`-filer som sine egne
komponenter — da kolliderer handoff-koden med systemets `Button` og `Card`.
**Fjern `.txt` og døp filen om til PascalCase** når du legger den i repoet:
`button.tsx.txt` → `components/ui/Button.tsx`. Innholdet er uendret og riktig
(`export function Button`).

Importene (`next/image`, `next/link`, `lucide-react`,
`@/components/ui/Button`) forutsetter repoets oppsett. `lucide-react` må
installeres: `npm i lucide-react`.
