"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { blogPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import {
  getEffectivePrice,
  isServiceAvailable,
  locations,
  services,
} from "@/lib/mock-data";
import { addDays, ordersInRange, today } from "@/lib/sales";
import { getServiceImage } from "@/lib/service-images";
import type { ServiceCategory } from "@/lib/types";

/**
 * Delt tilstand for adminpanelet: valgt avdeling, tjenestekatalogen,
 * blogginnleggene og toaster. Tilstanden lever i nettleseren — endringer
 * består mens du klikker rundt, men forsvinner ved omlasting, akkurat som i
 * prototypen. I produksjon skrives dette mot API-et, org-scopet per
 * franchisetaker (ADMIN.md § 0).
 */

/** Feltene som kan redigeres, og som avgjør om noe er upublisert. */
export interface AdminServiceFields {
  name: string;
  category: ServiceCategory;
  description: string;
  /** Kjedepris i øre, inkl. mva. */
  priceOre: number;
  durationMin: number;
  level: string;
  guarantee: string;
  image: string;
  active: boolean;
  popular: boolean;
  /** Avdelingsslug → øre. 0 skjuler tjenesten der. Mangler = følger kjedeprisen. */
  localPricesOre: Record<string, number>;
}

export interface AdminService extends AdminServiceFields {
  id: string;
  slug: string;
  sold30: number;
  isNew?: boolean;
  /**
   * Sist publiserte tilstand. `null` betyr at tjenesten aldri har vært
   * publisert. Utkast-merket regnes ut mot denne, ikke av et «rørt»-flagg — så
   * en tjeneste du skjuler og slår på igjen før publisering teller ikke som
   * en endring.
   */
  published: AdminServiceFields | null;
}

function fieldsOf(service: AdminServiceFields): AdminServiceFields {
  return {
    name: service.name,
    category: service.category,
    description: service.description,
    priceOre: service.priceOre,
    durationMin: service.durationMin,
    level: service.level,
    guarantee: service.guarantee,
    image: service.image,
    active: service.active,
    popular: service.popular,
    localPricesOre: service.localPricesOre,
  };
}

/** Kanonisk form, så nøkkelrekkefølgen i lokalprisene ikke gir falske avvik. */
function serialize(fields: AdminServiceFields): string {
  return JSON.stringify({
    ...fieldsOf(fields),
    localPricesOre: Object.entries(fields.localPricesOre).sort(([a], [b]) =>
      a.localeCompare(b),
    ),
  });
}

/** Snapshot til «sist publisert». */
export function publishedSnapshot(service: AdminService): AdminServiceFields {
  return fieldsOf(service);
}

/** True bare når tjenesten faktisk avviker fra sist publiserte tilstand. */
export function isDirty(service: AdminService): boolean {
  return service.published === null || serialize(service) !== serialize(service.published);
}

export function countDirty(services: AdminService[]): number {
  return services.filter(isDirty).length;
}

export type AdminPost = BlogPost & { isNew?: boolean };

export interface Toast {
  id: string;
  title: string;
  text?: string;
  variant?: "ok" | "info";
}

interface AdminContextValue {
  /** Avdelingsslug, eller «alle» for hele kjeden. */
  loc: string;
  setLoc: (slug: string) => void;
  services: AdminService[];
  setServices: React.Dispatch<React.SetStateAction<AdminService[]>>;
  posts: AdminPost[];
  setPosts: React.Dispatch<React.SetStateAction<AdminPost[]>>;
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

/** Startkatalogen: designsystemets tjenester + salgstall siste 30 dager. */
function initialServices(): AdminService[] {
  const to = today();
  const orders = ordersInRange("alle", addDays(to, -30), to);
  return services.map((service) => {
    const localPricesOre: Record<string, number> = {};
    for (const location of locations) {
      if (!isServiceAvailable(service.id, location.id)) {
        localPricesOre[location.slug] = 0;
        continue;
      }
      const price = getEffectivePrice(service.id, location.id);
      if (price !== service.priceOre) localPricesOre[location.slug] = price;
    }
    const fields: AdminServiceFields = {
      name: service.name,
      category: service.category,
      description: service.description,
      priceOre: service.priceOre,
      durationMin: service.durationMin,
      level: service.level ?? "",
      guarantee: service.guarantee ?? "",
      image: getServiceImage(service.slug).thumb,
      active: true,
      popular: Boolean(service.popular),
      localPricesOre,
    };
    return {
      ...fields,
      id: service.id,
      slug: service.slug,
      sold30: orders.filter((order) => order.serviceId === service.id).length,
      // Katalogen slik den ligger live i dag.
      published: fields,
    };
  });
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [loc, setLoc] = useState("lambertseter");
  const [serviceList, setServices] = useState<AdminService[]>(initialServices);
  const [posts, setPosts] = useState<AdminPost[]>(() => blogPosts.map((post) => ({ ...post })));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const dismiss = useCallback((id: string) => {
    setToasts((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (item: Omit<Toast, "id">) => {
      const id = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      setToasts((previous) => [...previous, { id, ...item }]);
      // Auto-lukk etter 5 s (MOTION.md § Adminpanelet).
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      loc,
      setLoc,
      services: serviceList,
      setServices,
      posts,
      setPosts,
      toasts,
      toast,
      dismiss,
      menuOpen,
      setMenuOpen,
    }),
    [loc, serviceList, posts, toasts, toast, dismiss, menuOpen],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin må brukes inne i AdminProvider");
  return context;
}

/** Navnet på valgt avdeling, til toppbarens undertekst. */
export function locationLabel(slug: string, allLabel = "Hele kjeden"): string {
  if (slug === "alle") return allLabel;
  const location = locations.find((item) => item.slug === slug);
  return location ? `Handz On ${location.name}` : allLabel;
}

/** Prisen som faktisk gjelder for en tjeneste i valgt avdeling. */
export function priceForLocation(service: AdminService, slug: string): number | null {
  if (slug === "alle") return service.priceOre;
  const local = service.localPricesOre[slug];
  if (local === 0) return null;
  return local ?? service.priceOre;
}
