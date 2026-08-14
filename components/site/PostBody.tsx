import type { ReactNode } from "react";

/**
 * Rendrer den markdown-lette teksten fra bloggverktøyet: `## ` gir
 * mellomtittel, `- ` gir punktliste, blank linje skiller avsnitt.
 * Inline støttes `**fet**`, `*kursiv*` og `[tekst](url)`.
 */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  return text.split(pattern).filter(Boolean).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <a
          key={key}
          href={link[2]}
          className="font-semibold text-navy underline underline-offset-2"
        >
          {link[1]}
        </a>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

export function PostBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).filter((block) => block.trim().length > 0);

  return (
    <div className="mt-6 flex max-w-[68ch] flex-col gap-5 text-[17px] leading-[1.65] text-body hz:mt-7">
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        if (block.startsWith("## ")) {
          return (
            /* Mellomtitlene hadde 8px marg oppå containerens 20px gap — 28px
               over og 20px under, altså nesten symmetrisk. På mobil, der et
               avsnitt fyller fem-seks linjer, forsvant all fornemmelse av hvor
               et nytt tema starter. 20px marg gir 40px over og 20px under, og
               21px på mobil holder mellomtittelen under h1 i vekt. */
            <h2
              key={key}
              className="mt-5 text-balance font-heading text-[21px] font-bold leading-[1.18] tracking-[-.02em] text-ink hz:text-[24px] hz:leading-[1.15]"
            >
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("- ")) {
          return (
            <ul key={key} className="flex flex-col gap-2">
              {block.split("\n").map((line, lineIndex) => (
                <li key={`${key}-${lineIndex}`} className="flex gap-2.5">
                  <span aria-hidden className="text-navy">
                    ·
                  </span>
                  <span>{inline(line.replace(/^-\s*/, ""), `${key}-${lineIndex}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={key}>{inline(block, key)}</p>;
      })}
    </div>
  );
}
