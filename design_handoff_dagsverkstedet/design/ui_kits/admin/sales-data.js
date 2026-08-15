/* Salgsdata for admin-panelet.
   Deterministisk generert: samme avdeling og dato gir alltid samme tall, så
   demoen er stabil mellom omlastinger. Bygger på ui_kits/data.js (ekte
   avdelinger, tjenester, add-ons og priser).

   Modellen speiler virkeligheten i kjeden: kjøpesenter-avdelinger har mest
   trafikk lørdag, søndag er stengt, og sesongtoppene ligger i april–mai
   (pollen, dekkskift) og september–oktober (vinterforberedelse). */
window.HZ_SALES = (function () {
  const D = window.HZ_DATA;

  /* Relativ trafikkvekt per avdeling — Lambertseter og Lagunen er de største. */
  const WEIGHT = {
    lambertseter: 1.35, lagunen: 1.3, sandvika: 1.15, metro: 1.0, strommen: 0.95,
    triaden: 0.9, asane: 0.9, forus: 1.05, sorlandssenteret: 0.95, skedsmo: 0.8,
    ski: 0.75, jessheim: 0.8, asker: 0.7, moa: 0.75,
  };

  const CHANNELS = [
    ["nett", "Nettbooking", 0.58],
    ["skranke", "Drop-in i skranken", 0.27],
    ["telefon", "Telefon", 0.15],
  ];

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parse = (s) => new Date(s + "T12:00:00");
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  /* Mandag som første dag i uka (norsk standard). */
  const startOfWeek = (d) => { const x = new Date(d); const w = (x.getDay() + 6) % 7; x.setDate(x.getDate() - w); x.setHours(12, 0, 0, 0); return x; };
  const isoWeek = (d) => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = (t.getUTCDay() + 6) % 7;
    t.setUTCDate(t.getUTCDate() - day + 3);
    const first = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
    const fd = (first.getUTCDay() + 6) % 7;
    first.setUTCDate(first.getUTCDate() - fd + 3);
    return 1 + Math.round((t - first) / 604800000);
  };

  /* Sesongfaktor — 1,0 er snitt. */
  function season(month) {
    return [0.82, 0.85, 1.0, 1.28, 1.24, 1.05, 0.88, 0.95, 1.22, 1.3, 1.02, 0.9][month];
  }
  function weekday(day) {
    return [0, 0.92, 0.88, 0.95, 1.05, 1.18, 1.35, 0][day === 0 ? 7 : day];
  }

  const cache = new Map();

  /* Alle ordrer for én avdeling på én dag. */
  function ordersForDay(slug, dateStr) {
    const key = slug + "|" + dateStr;
    if (cache.has(key)) return cache.get(key);
    const d = parse(dateStr);
    const out = [];
    if (d.getDay() === 0) { cache.set(key, out); return out; } // søndag stengt

    const r = rng(hash(key));
    const base = 7.2 * (WEIGHT[slug] || 0.85) * season(d.getMonth()) * weekday(d.getDay());
    const count = Math.max(1, Math.round(base + (r() - 0.5) * 3.2));
    const open = 8;
    const close = d.getDay() === 6 ? 14 : 16;
    const avail = D.services.filter((s) => D.availableAt(slug, s.id));

    for (let i = 0; i < count; i += 1) {
      /* Tjenestevalg vektet mot vask og de populære pakkene. */
      const roll = r();
      let pool;
      if (roll < 0.46) pool = avail.filter((s) => s.cat === "bilvask");
      else if (roll < 0.62) pool = avail.filter((s) => s.cat === "interior");
      else if (roll < 0.76) pool = avail.filter((s) => s.cat === "polering");
      else if (roll < 0.86) pool = avail.filter((s) => s.cat === "hjul");
      else if (roll < 0.94) pool = avail.filter((s) => s.cat === "full-shine");
      else pool = avail.filter((s) => s.cat === "lakkforsegling");
      if (!pool.length) pool = avail;
      const svc = pool[Math.floor(r() * pool.length)];
      const price = D.priceAt(slug, svc.id);

      /* Add-ons: affinitet først, ~38 % festerate. */
      const addOns = [];
      const aff = D.affinity[svc.id] || [];
      if (r() < 0.38) {
        const src = aff.length ? aff : D.addOns.map((a) => a.id);
        addOns.push(src[Math.floor(r() * src.length)]);
        if (r() < 0.22 && src.length > 1) {
          const second = src[Math.floor(r() * src.length)];
          if (second !== addOns[0]) addOns.push(second);
        }
      }
      const addSum = addOns.reduce((n, id) => n + D.addOns.find((a) => a.id === id).price, 0);
      const member = r() < 0.41;
      const discount = member ? Math.round(price * 0.1) : 0;

      let cr = r(); let channel = CHANNELS[2][0];
      for (const [id, , w] of CHANNELS) { if (cr < w) { channel = id; break; } cr -= w; }

      out.push({
        id: `${slug}-${dateStr}-${i}`,
        date: dateStr,
        loc: slug,
        hour: open + Math.floor(r() * (close - open)),
        serviceId: svc.id,
        addOns,
        member,
        channel,
        base: price,
        addSum,
        discount,
        total: price + addSum - discount,
      });
    }
    out.sort((a, b) => a.hour - b.hour);
    cache.set(key, out);
    return out;
  }

  function ordersInRange(slug, from, to) {
    const slugs = slug === "alle" ? D.locations.map((l) => l.slug) : [slug];
    const out = [];
    for (let d = new Date(from); d <= to; d = addDays(d, 1)) {
      const ds = iso(d);
      for (const s of slugs) out.push(...ordersForDay(s, ds));
    }
    return out;
  }

  /* Periodevindu + bøtter for diagrammet. */
  function range(period, anchor) {
    const a = new Date(anchor);
    if (period === "dag") {
      return { from: a, to: a, label: a.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) };
    }
    if (period === "uke") {
      const from = startOfWeek(a);
      const to = addDays(from, 6);
      return { from, to, label: `Uke ${isoWeek(from)} · ${from.getDate()}.–${to.getDate()}. ${to.toLocaleDateString("nb-NO", { month: "long", year: "numeric" })}` };
    }
    if (period === "maaned") {
      const from = new Date(a.getFullYear(), a.getMonth(), 1, 12);
      const to = new Date(a.getFullYear(), a.getMonth() + 1, 0, 12);
      return { from, to, label: from.toLocaleDateString("nb-NO", { month: "long", year: "numeric" }) };
    }
    const from = new Date(a.getFullYear(), 0, 1, 12);
    const to = new Date(a.getFullYear(), 11, 31, 12);
    return { from, to, label: String(a.getFullYear()) };
  }

  function shift(period, anchor, dir) {
    const a = new Date(anchor);
    if (period === "dag") return addDays(a, dir);
    if (period === "uke") return addDays(a, dir * 7);
    if (period === "maaned") return new Date(a.getFullYear(), a.getMonth() + dir, 1, 12);
    return new Date(a.getFullYear() + dir, a.getMonth(), 1, 12);
  }

  function previousAnchor(period, anchor) { return shift(period, anchor, -1); }

  const WD = ["man", "tir", "ons", "tor", "fre", "lør", "søn"];
  const MO = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];

  function buckets(period, anchor, orders) {
    const r = range(period, anchor);
    if (period === "dag") {
      const out = [];
      for (let h = 8; h <= 16; h += 1) {
        const list = orders.filter((o) => o.hour === h);
        out.push({ x: `${String(h).padStart(2, "0")}`, full: `Kl. ${String(h).padStart(2, "0")}–${String(h + 1).padStart(2, "0")}`, sum: list.reduce((n, o) => n + o.total, 0), count: list.length });
      }
      return out;
    }
    if (period === "uke") {
      const out = [];
      for (let i = 0; i < 7; i += 1) {
        const d = addDays(r.from, i); const ds = iso(d);
        const list = orders.filter((o) => o.date === ds);
        out.push({ x: WD[i], full: d.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "short" }), sum: list.reduce((n, o) => n + o.total, 0), count: list.length, closed: d.getDay() === 0 });
      }
      return out;
    }
    if (period === "maaned") {
      const out = [];
      const days = r.to.getDate();
      for (let i = 1; i <= days; i += 1) {
        const d = new Date(r.from.getFullYear(), r.from.getMonth(), i, 12); const ds = iso(d);
        const list = orders.filter((o) => o.date === ds);
        out.push({ x: i % 2 === 1 || days <= 20 ? String(i) : "", full: d.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" }), sum: list.reduce((n, o) => n + o.total, 0), count: list.length, closed: d.getDay() === 0 });
      }
      return out;
    }
    const out = [];
    for (let m = 0; m < 12; m += 1) {
      const list = orders.filter((o) => parse(o.date).getMonth() === m);
      out.push({ x: MO[m], full: new Date(r.from.getFullYear(), m, 1).toLocaleDateString("nb-NO", { month: "long", year: "numeric" }), sum: list.reduce((n, o) => n + o.total, 0), count: list.length });
    }
    return out;
  }

  function summarize(orders) {
    const sum = orders.reduce((n, o) => n + o.total, 0);
    const count = orders.length;
    const addRevenue = orders.reduce((n, o) => n + o.addSum, 0);
    const discount = orders.reduce((n, o) => n + o.discount, 0);
    const members = orders.filter((o) => o.member).length;
    const withAdd = orders.filter((o) => o.addOns.length).length;
    return {
      sum, count,
      avg: count ? Math.round(sum / count) : 0,
      vat: Math.round((sum / 5) * 100) / 100,
      addRevenue, discount,
      memberShare: count ? members / count : 0,
      attachRate: count ? withAdd / count : 0,
    };
  }

  function byService(orders) {
    const map = new Map();
    for (const o of orders) {
      const cur = map.get(o.serviceId) || { count: 0, sum: 0 };
      cur.count += 1; cur.sum += o.base - o.discount;
      map.set(o.serviceId, cur);
    }
    return [...map.entries()]
      .map(([id, v]) => ({ service: D.services.find((s) => s.id === id), ...v }))
      .sort((a, b) => b.sum - a.sum);
  }

  function byCategory(orders) {
    const map = new Map();
    for (const o of orders) {
      const svc = D.services.find((s) => s.id === o.serviceId);
      const cur = map.get(svc.cat) || { count: 0, sum: 0 };
      cur.count += 1; cur.sum += o.total;
      map.set(svc.cat, cur);
    }
    return D.categories
      .map((c) => ({ cat: c, ...(map.get(c.value) || { count: 0, sum: 0 }) }))
      .filter((r) => r.count)
      .sort((a, b) => b.sum - a.sum);
  }

  function byAddOn(orders) {
    const map = new Map();
    for (const o of orders) for (const id of o.addOns) {
      const cur = map.get(id) || { count: 0, sum: 0 };
      const a = D.addOns.find((x) => x.id === id);
      cur.count += 1; cur.sum += a.price;
      map.set(id, cur);
    }
    return [...map.entries()]
      .map(([id, v]) => ({ addOn: D.addOns.find((a) => a.id === id), ...v }))
      .sort((a, b) => b.sum - a.sum);
  }

  function byChannel(orders) {
    return CHANNELS.map(([id, label]) => {
      const list = orders.filter((o) => o.channel === id);
      return { id, label, count: list.length, sum: list.reduce((n, o) => n + o.total, 0) };
    }).filter((r) => r.count).sort((a, b) => b.sum - a.sum);
  }

  function byLocation(orders) {
    const map = new Map();
    for (const o of orders) {
      const cur = map.get(o.loc) || { count: 0, sum: 0 };
      cur.count += 1; cur.sum += o.total;
      map.set(o.loc, cur);
    }
    return [...map.entries()]
      .map(([slug, v]) => ({ loc: D.locations.find((l) => l.slug === slug), ...v }))
      .sort((a, b) => b.sum - a.sum);
  }

  /* Rapport for én periode, med sammenligning mot forrige tilsvarende periode. */
  function report(slug, period, anchor) {
    const r = range(period, anchor);
    const orders = ordersInRange(slug, r.from, r.to);
    const pa = previousAnchor(period, anchor);
    const pr = range(period, pa);
    const prev = ordersInRange(slug, pr.from, pr.to);
    return {
      range: r, prevRange: pr,
      orders, now: summarize(orders), before: summarize(prev),
      buckets: buckets(period, anchor, orders),
      services: byService(orders),
      categories: byCategory(orders),
      addOns: byAddOn(orders),
      channels: byChannel(orders),
      locations: byLocation(orders),
    };
  }

  const pct = (now, before) => (before ? (now - before) / before : null);

  function csv(rep, slugLabel, periodLabel) {
    const rows = [
      ["Handz On Auto Care — salgsrapport"],
      ["Avdeling", slugLabel],
      ["Periode", periodLabel],
      ["Omsetning inkl. mva", rep.now.sum],
      ["Herav mva (25 %)", rep.now.vat],
      ["Antall ordrer", rep.now.count],
      ["Snittordre", rep.now.avg],
      [],
      ["Dato", "Tid", "Avdeling", "Tjeneste", "Tillegg", "Kanal", "Medlem", "Rabatt", "Sum inkl. mva"],
    ];
    for (const o of rep.orders) {
      const svc = D.services.find((s) => s.id === o.serviceId);
      rows.push([
        o.date, `${String(o.hour).padStart(2, "0")}:00`,
        D.locations.find((l) => l.slug === o.loc).name,
        svc.name,
        o.addOns.map((id) => D.addOns.find((a) => a.id === id).name).join(" + "),
        o.channel, o.member ? "ja" : "nei", o.discount, o.total,
      ]);
    }
    return rows.map((r) => r.map((c) => (typeof c === "string" && /[;"\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(";")).join("\n");
  }

  return { ordersForDay, ordersInRange, range, shift, buckets, summarize, report, pct, csv, byService, byCategory, byAddOn, byChannel, byLocation, iso, parse, addDays, isoWeek, WEIGHT, CHANNELS };
})();
