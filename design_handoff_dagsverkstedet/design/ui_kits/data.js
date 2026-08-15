/* Delt demodata for UI-kittene. Ekte avdelinger, ekte tjenestenavn og ekte
   «fra»-priser fra kjedens katalog (kilde: handzon-1/docs/HANDZON-AUDIT-OG-
   DESIGNBRIEF.md kap. 3 og handzon-1/lib/mock-data.ts). Priser i hele kroner
   inkl. mva. */
window.HZ_DATA = (function () {
  const P = window.HZ_ASSET_BASE || "../../assets/photos/";

  const categories = [
    { value: "bilvask", label: "Bilvask" },
    { value: "polering", label: "Polering" },
    { value: "lakkforsegling", label: "Lakkforsegling" },
    { value: "full-shine", label: "Full Shine" },
    { value: "interior", label: "Interiør" },
    { value: "hjul", label: "Dekk & Felg" },
  ];

  const services = [
    { id: "vask-utvendig-basic", name: "Vask utvendig – Basic", cat: "bilvask", catLabel: "Bilvask", price: 540, min: 30, level: "Basic", img: P + "utvendig-handvask-thumb.webp", hero: P + "utvendig-handvask.webp", desc: "Rask, skånsom utvendig håndvask med felgvask, skum og tørk. Perfekt til jevnt vedlikehold." },
    { id: "vask-utvendig-premium", name: "Vask utvendig – Premium", cat: "bilvask", catLabel: "Bilvask", price: 790, min: 50, level: "Premium", img: P + "utvendig-handvask-thumb.webp", hero: P + "utvendig-handvask.webp", desc: "Grundig håndvask med to-bøtte-metode, felgvask og skånsom tørk – uten svirvelmerker." },
    { id: "vask-innvendig-premium", name: "Vask innvendig – Premium", cat: "bilvask", catLabel: "Bilvask", price: 790, min: 50, level: "Premium", img: P + "innvendig-rens-thumb.webp", hero: P + "innvendig-rens.webp", desc: "Støvsuging, rens av alle flater, vinduer innvendig og avtørking av dashbord og konsoll." },
    { id: "vask-ut-innvendig-premium", name: "Vask ut-/innvendig – Premium", cat: "bilvask", catLabel: "Bilvask", price: 1490, min: 75, level: "Premium", popular: true, img: P + "utvendig-vask-og-voks-thumb.webp", hero: P + "utvendig-vask-og-voks.webp", desc: "Komplett vask ute og inne: håndvask utvendig, støvsuging og avtørking av alle flater innvendig." },
    { id: "polering-basic", name: "Polering – Basic", cat: "polering", catLabel: "Polering", price: 1990, min: 180, level: "Basic", popular: true, img: P + "polering-thumb.webp", hero: P + "polering.webp", desc: "Maskinpolering som fjerner lette riper og matthet, og gir lakken dybde og glans." },
    { id: "polering-pro", name: "Polering – Pro", cat: "polering", catLabel: "Polering", price: 2990, min: 240, level: "Pro", popular: true, img: P + "polering-thumb.webp", hero: P + "polering.webp", desc: "Flertrinns polering som fjerner dypere riper, svirvelmerker og oksidering." },
    { id: "lakkrens-polering-pro", name: "Lakkrens + Polering – Pro", cat: "polering", catLabel: "Polering", price: 4490, min: 390, level: "Pro", guarantee: "NANO ~12 mnd", img: P + "detaljering.webp", hero: P + "detaljering.webp", desc: "Full lakkrens med leire og avfetting, deretter flertrinns polering – lakken føles som ny." },
    { id: "keramisk-lakkforsegling", name: "Keramisk lakkforsegling", cat: "lakkforsegling", catLabel: "Lakkforsegling", price: 9990, min: 480, guarantee: "6 års garanti", popular: true, img: P + "keramisk-coating-thumb.webp", hero: P + "keramisk-coating.webp", desc: "Graphene-basert forsegling som beskytter lakken i årevis – selvrensende, med dyp glans." },
    { id: "kontrollvask-rebehandling", name: "Kontrollvask & rebehandling", cat: "lakkforsegling", catLabel: "Lakkforsegling", price: 1690, min: 150, img: P + "keramisk-coating-thumb.webp", hero: P + "keramisk-coating.webp", desc: "Vedlikeholdsvask og oppfrisking av eksisterende forsegling for varig beskyttelse." },
    { id: "full-shine-basic", name: "Full Shine – Basic", cat: "full-shine", catLabel: "Full Shine", price: 6490, min: 480, level: "Basic", img: P + "komplett-bilpleie-thumb.webp", hero: P + "komplett-bilpleie.webp", desc: "Total renovering ute og inne: vask, lakkrens, polering og innvendig dyprens i én behandling." },
    { id: "full-shine-pro", name: "Full Shine – Pro", cat: "full-shine", catLabel: "Full Shine", price: 7490, min: 570, level: "Pro", guarantee: "NANO ~12 mnd", popular: true, img: P + "komplett-bilpleie-thumb.webp", hero: P + "komplett-bilpleie.webp", desc: "Vår mest komplette pakke: renovering ute og inne, klimadesinfisering og NANO-beskyttelse." },
    { id: "rens-innvendig", name: "Rens innvendig (dyprens)", cat: "interior", catLabel: "Interiør", price: 3990, min: 330, popular: true, img: P + "innvendig-rens-thumb.webp", hero: P + "innvendig-rens.webp", desc: "Grundig dyprens: støvsuging, rens av alle flater, tekstil- og skinnrens av seter." },
    { id: "skinn-rens", name: "Skinn rens og behandling", cat: "interior", catLabel: "Interiør", price: 1990, min: 120, img: P + "innvendig-rens-thumb.webp", hero: P + "innvendig-rens.webp", desc: "Rens og næring av skinnseter som hindrer sprekker og holder skinnet mykt." },
    { id: "rens-enkelt-sete", name: "Rens av enkelt sete", cat: "interior", catLabel: "Interiør", price: 590, min: 45, popular: true, img: P + "innvendig-rens-thumb.webp", hero: P + "innvendig-rens.webp", desc: "Flekkfjerning og dyprens av ett enkelt sete – for uhellet som skjedde." },
    { id: "ozon-desinfisering", name: "Ozon / desinfisering", cat: "interior", catLabel: "Interiør", price: 1690, min: 60, img: P + "innvendig-rens-thumb.webp", hero: P + "innvendig-rens.webp", desc: "Ozonbehandling som fjerner lukt og desinfiserer kupeen – røyk, dyr og mat." },
    { id: "omlegg-balansering", name: "Omlegg og balansering", cat: "hjul", catLabel: "Dekk & Felg", price: 1300, min: 75, img: P + "hero-hjulskift.webp", hero: P + "hero-hjulskift.webp", desc: "Omlegging og balansering av hjulene for jevn slitasje og rolig kjøring." },
    { id: "skift-av-hjul", name: "Skift av hjul", cat: "hjul", catLabel: "Dekk & Felg", price: 500, min: 30, img: P + "hero-hjulskift.webp", hero: P + "hero-hjulskift.webp", desc: "Rask og trygg omskodding mellom sommer- og vinterhjul mens du er på senteret." },
    { id: "vask-av-hjul", name: "Vask av hjul (løse)", cat: "hjul", catLabel: "Dekk & Felg", price: 250, min: 20, img: P + "hero-hjulskift.webp", hero: P + "hero-hjulskift.webp", desc: "Vask av løse hjul – rene felger og dekk, klare til lagring eller ny montering." },
  ];

  const addOns = [
    { id: "asfalt", name: "Asfaltfjerning", price: 450, min: 30, desc: "Løser opp asfaltsprut og tjæreflekker på lakk og terskler." },
    { id: "seterens", name: "Seterens (ett sete)", price: 500, min: 45, desc: "Dyprens og flekkfjerning av ett sete i tekstil eller skinn." },
    { id: "rute", name: "Ruteforsegling", price: 349, min: 20, desc: "Regnavvisende behandling av frontrute og sideruter." },
    { id: "dekkrens", name: "Dekkrensing og felgforsegling", price: 299, min: 20, desc: "Syrefri felgrens med beskyttende forsegling og dekkglans." },
    { id: "ozon", name: "Luktfjerning (ozon)", price: 599, min: 45, desc: "Fjerner røyk-, dyre- og matlukt permanent." },
    { id: "dyrehaar", name: "Fjerning av dyrehår", price: 399, min: 30, desc: "Spesialrens for hundeeiere — fjerner hår fra seter og tepper." },
  ];

  const affinity = {
    "vask-ut-innvendig-premium": ["dekkrens", "seterens", "rute"],
    "polering-basic": ["asfalt", "dekkrens", "rute"],
    "polering-pro": ["asfalt", "dekkrens", "rute"],
    "keramisk-lakkforsegling": ["rute", "dekkrens", "asfalt"],
    "rens-innvendig": ["ozon", "seterens", "dyrehaar"],
    "full-shine-pro": ["dekkrens", "ozon", "seterens"],
  };

  const locations = [
    { slug: "lambertseter", name: "Lambertseter", center: "Lambertseter senter", address: "Cecilie Thoresens vei 17–21", zip: "1153", city: "Oslo", region: "Østlandet", phone: "479 20 609", lat: 59.876, lng: 10.806, dist: "3,4 km", open: true },
    { slug: "sandvika", name: "Sandvika", center: "Sandvika Storsenter", address: "Brodtkorbs gate 7", zip: "1338", city: "Sandvika", region: "Østlandet", phone: "479 27 724", lat: 59.8883, lng: 10.521, dist: "11,2 km", open: true },
    { slug: "metro", name: "Metro", center: "Metro Senter", address: "Bibliotekgata 30", zip: "1473", city: "Lørenskog", region: "Østlandet", phone: "980 53 599", lat: 59.9281, lng: 10.962, dist: "12,8 km", open: true },
    { slug: "ski", name: "Ski", center: "Ski Storsenter", address: "Jernbanesvingen 6", zip: "1401", city: "Ski", region: "Østlandet", phone: "479 27 723", lat: 59.7195, lng: 10.836, dist: "18,0 km", open: false },
    { slug: "triaden", name: "Triaden", center: "Triaden Lørenskog", address: "Gamleveien 88", zip: "1461", city: "Lørenskog", region: "Østlandet", phone: "467 09 966", lat: 59.95, lng: 11.001, dist: "19,4 km", open: true },
    { slug: "strommen", name: "Strømmen", center: "Strømmen Storsenter", address: "Stasjonsveien 6", zip: "2010", city: "Strømmen", region: "Østlandet", phone: "941 77 814", lat: 59.9457, lng: 11.006, dist: "20,1 km", open: true },
    { slug: "asker", name: "Asker", center: "Trekanten", address: "Knud Askers vei 26", zip: "1383", city: "Asker", region: "Østlandet", phone: "488 43 795", lat: 59.8337, lng: 10.4352, dist: "22,6 km", open: true, campaign: "Ny avdeling: 15 % på første bestilling" },
    { slug: "skedsmo", name: "Skedsmo", center: "Skedsmokorset", address: "Furuholtet 1", zip: "2020", city: "Skedsmokorset", region: "Østlandet", phone: "484 34 321", lat: 59.9772, lng: 11.033, dist: "26,3 km", open: true },
    { slug: "jessheim", name: "Jessheim", center: "Jessheim Storsenter", address: "Ringenveien 4", zip: "2050", city: "Jessheim", region: "Østlandet", phone: "456 52 461", lat: 60.1533, lng: 11.173, dist: "44,9 km", open: true },
    { slug: "lagunen", name: "Lagunen", center: "Lagunen Storsenter", address: "Laguneveien 1", zip: "5239", city: "Rådal", region: "Vestlandet", phone: "479 27 731", lat: 60.2966, lng: 5.3299, dist: "304 km", open: true, campaign: "Sommerkampanje: 20 % på keramisk coating" },
    { slug: "asane", name: "Åsane", center: "Åsane Storsenter", address: "Åsane Storsenter 42, bygg A", zip: "5116", city: "Ulset", region: "Vestlandet", phone: "916 74 554", lat: 60.469, lng: 5.3235, dist: "312 km", open: true },
    { slug: "forus", name: "Forus", center: "Forus Handelspark", address: "Fabrikkveien 2", zip: "4033", city: "Stavanger", region: "Vestlandet", phone: "457 39 525", lat: 58.8918, lng: 5.7195, dist: "298 km", open: true },
    { slug: "sorlandssenteret", name: "Sørlandssenteret", center: "Sørlandssenteret", address: "Barstølveien 35", zip: "4636", city: "Kristiansand", region: "Sørlandet", phone: "469 86 698", lat: 58.1868, lng: 8.0793, dist: "246 km", open: true, campaign: "Gratis felgrens ved Full Shine i august" },
    { slug: "moa", name: "Moa", center: "Moa Syd", address: "Moaveien 1", zip: "6018", city: "Ålesund", region: "Vestlandet", phone: "920 72 829", lat: 62.4665, lng: 6.243, dist: "441 km", open: true },
  ];

  const overrides = {
    "lambertseter:full-shine-pro": 7990,
    "lambertseter:vask-utvendig-premium": 849,
    "forus:full-shine-pro": 6990,
    "sandvika:keramisk-lakkforsegling": 9490,
    "moa:keramisk-lakkforsegling": null,
    "ski:polering-pro": null,
  };

  const nok = (n) => new Intl.NumberFormat("nb-NO").format(n).replace(/\u00A0/g, " ");
  const kr = (n) => nok(n) + ",-";
  const dur = (m) => (m < 60 ? m + " min" : m % 60 === 0 ? Math.floor(m / 60) + " t" : Math.floor(m / 60) + " t " + (m % 60) + " min");
  const priceAt = (slug, id) => {
    const key = slug + ":" + id;
    return key in overrides ? overrides[key] : services.find((s) => s.id === id).price;
  };
  const availableAt = (slug, id) => priceAt(slug, id) !== null;

  const vehicles = {
    EB12345: { make: "Tesla", model: "Model Y", year: 2023, fuel: "Elektrisk", color: "Hvit" },
    DR34567: { make: "Volkswagen", model: "Golf", year: 2019, fuel: "Bensin", color: "Grå" },
    SU98765: { make: "Volvo", model: "XC60", year: 2021, fuel: "Diesel", color: "Svart" },
    EK55443: { make: "Hyundai", model: "Kona Electric", year: 2024, fuel: "Elektrisk", color: "Blå" },
  };

  /* Kart. Sett window.HZ_GOOGLE_MAPS_KEY = "din-nøkkel" før data.js lastes, så
     brukes Google Maps Embed API — ellers faller vi tilbake til OpenStreetMap. */
  const mapUrl = (loc, zoom = 14) => {
    const key = window.HZ_GOOGLE_MAPS_KEY;
    if (key) {
      const q = encodeURIComponent(`Handz On ${loc.name}, ${loc.address}, ${loc.zip} ${loc.city}`);
      return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&zoom=${zoom}&language=no&region=NO`;
    }
    const dx = 0.06, dy = 0.03;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${loc.lng - dx}%2C${loc.lat - dy}%2C${loc.lng + dx}%2C${loc.lat + dy}&layer=mapnik&marker=${loc.lat}%2C${loc.lng}`;
  };
  const mapUrlAll = () => {
    const key = window.HZ_GOOGLE_MAPS_KEY;
    if (key) return `https://www.google.com/maps/embed/v1/search?key=${key}&q=${encodeURIComponent("Handz On Auto Care Norge")}&zoom=5&language=no&region=NO`;
    return "https://www.openstreetmap.org/export/embed.html?bbox=4.2%2C57.8%2C13.2%2C63.4&layer=mapnik&marker=59.876%2C10.806";
  };

  return { categories, services, addOns, affinity, locations, overrides, nok, kr, dur, priceAt, availableAt, vehicles, mapUrl, mapUrlAll, PHOTOS: P };
})();
