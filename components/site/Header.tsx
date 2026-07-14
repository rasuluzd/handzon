import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          href="/"
          className="flex shrink-0 flex-col font-bold leading-tight tracking-tight"
        >
          <span className="whitespace-nowrap text-base text-foreground">
            HANDZ ON
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
            Auto Care
          </span>
        </Link>
        <nav aria-label="Hovedmeny" className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <Link href="/#tjenester" className="hover:text-foreground">
            Tjenester
          </Link>
          <Link href="/avdelinger" className="hover:text-foreground">
            Avdelinger
          </Link>
          <Link href="/min-side" className="hover:text-foreground">
            Min side
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/min-side"
            className="text-sm text-muted hover:text-foreground sm:hidden"
          >
            Min side
          </Link>
          <ButtonLink href="/booking" className="!min-h-10 !px-4 text-sm">
            Bestill time
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
