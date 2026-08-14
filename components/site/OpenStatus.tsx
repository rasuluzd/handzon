"use client";

import { useSyncExternalStore } from "react";
import { Tag } from "@/components/ui/Tag";
import { isOpenNow } from "@/lib/opening-hours";
import type { OpeningHours } from "@/lib/types";

/**
 * «Åpen nå» / «Stengt nå» beregnes fra åpningstidene, aldri hardkodet
 * (COMPONENTS.md § BranchCard).
 *
 * Klokka er en ekstern kilde, så den leses med useSyncExternalStore: på serveren
 * og i hydreringen finnes ingen status (statisk genererte sider ville ellers
 * frosset den på byggetidspunktet), og etterpå oppdateres den hvert minutt.
 *
 * Timeren er DELT mellom alle instanser. Med én `setInterval` per komponent
 * hadde /avdelinger fjorten timere som alle vekket hovedtråden på samme
 * minutt; nå er det ett intervall som varsler alle abonnentene.
 */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (!timer) {
    timer = setInterval(() => {
      listeners.forEach((listener) => listener());
    }, 60_000);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function OpenStatus({ hours }: { hours: OpeningHours[] }) {
  const open = useSyncExternalStore<boolean | null>(
    subscribe,
    () => isOpenNow(hours),
    () => null,
  );

  if (open === null) return null;
  return <Tag variant={open ? "open" : "closed"}>{open ? "Åpen nå" : "Stengt nå"}</Tag>;
}
