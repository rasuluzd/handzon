"use client";

import type { ReactNode } from "react";
import { Rail } from "@/components/admin/Rail";
import { Toasts } from "@/components/admin/Toasts";
import { AdminProvider, countDirty, useAdmin } from "./admin-context";

/**
 * Skallet: navy sidestolpe + innholdskolonne (ADMIN.md § 1).
 * Sidestolpen er 250px over 1100px, ikonrail 760–1100px og skuff under 760px.
 */
function Shell({ children }: { children: ReactNode }) {
  const { posts, services, menuOpen, setMenuOpen, toasts, dismiss } = useAdmin();

  const counts = {
    "/admin/blogg": posts.filter((post) => !post.published).length || null,
    "/admin/tjenester": countDirty(services) || null,
  } as Record<string, number | null>;

  return (
    <div className="grid min-h-screen bg-surface-alt admin-sm:grid-cols-[74px_1fr] admin-lg:grid-cols-[250px_1fr]">
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-[70] bg-[rgba(14,22,38,.55)] backdrop-blur-[4px] admin-sm:hidden"
        />
      )}
      <Rail open={menuOpen} onClose={() => setMenuOpen(false)} counts={counts} />
      <div className="flex min-w-0 flex-col">{children}</div>
      <Toasts items={toasts} dismiss={dismiss} />
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <Shell>{children}</Shell>
    </AdminProvider>
  );
}

/** Innholdsområdet under toppbaren. */
export function AdminBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-[clamp(18px,2.4vw,32px)]">{children}</div>
  );
}
