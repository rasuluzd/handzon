import Link from "next/link";
import { locations } from "@/lib/mock-data";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-bold">
            HANDZ ON <span className="text-accent">AUTO CARE</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Profesjonell bilpleie på 15 steder i Norge. Hver avdeling drives av
            en lokal franchisetaker med eget organisasjonsnummer.
          </p>
        </div>
        <nav aria-label="Avdelinger" className="text-sm">
          <p className="mb-3 font-semibold">Avdelinger</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-muted">
            {locations.map((location) => (
              <li key={location.id}>
                <Link
                  href={`/avdelinger/${location.slug}`}
                  className="hover:text-foreground"
                >
                  {location.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Informasjon" className="text-sm">
          <p className="mb-3 font-semibold">Informasjon</p>
          <ul className="space-y-1.5 text-muted">
            <li>
              <Link href="/booking" className="hover:text-foreground">
                Bestill time
              </Link>
            </li>
            <li>
              <Link href="/min-side" className="hover:text-foreground">
                Min side
              </Link>
            </li>
            <li>
              <Link href="/avdelinger" className="hover:text-foreground">
                Finn din avdeling
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs text-muted">
            Demoversjon — alle data er fiktive.
          </p>
        </nav>
      </div>
    </footer>
  );
}
