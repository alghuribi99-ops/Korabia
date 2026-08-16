/** Shared shape for every locale, plus the language-independent data. */

export type Lang = "ar" | "en" | "ru" | "es" | "ko";

export const LANGS: Lang[] = ["ar", "en", "ru", "es", "ko"];

export const LANG_META: Record<
  Lang,
  { path: string; label: string; htmlLang: string; ogLocale: string; dir: "rtl" | "ltr" }
> = {
  ar: { path: "/", label: "العربية", htmlLang: "ar", ogLocale: "ar_SA", dir: "rtl" },
  en: { path: "/en", label: "English", htmlLang: "en", ogLocale: "en_US", dir: "ltr" },
  ru: { path: "/ru", label: "Русский", htmlLang: "ru", ogLocale: "ru_RU", dir: "ltr" },
  es: { path: "/es", label: "Español", htmlLang: "es", ogLocale: "es_ES", dir: "ltr" },
  ko: { path: "/ko", label: "한국어", htmlLang: "ko", ogLocale: "ko_KR", dir: "ltr" },
};

export const SITE_ORIGIN = "https://korabia-motors.higgsfield.app";

export const CONTACT = {
  whatsappDigits: "821066679149",
  whatsappDisplay: "+82 10 6667 9149",
  email: "info@korabia.co",
  social: [
    { label: "Instagram", href: "https://instagram.com/korabia.services" },
    { label: "X", href: "https://x.com/korabia_service" },
    { label: "Facebook", href: "https://facebook.com/102333592638814" },
    { label: "YouTube", href: "https://youtube.com/channel/UC6uUVXG_RIwRbUrQLhYqYUg" },
  ],
} as const;

export function whatsappLink(message: string) {
  return "https://wa.me/" + CONTACT.whatsappDigits + "?text=" + encodeURIComponent(message);
}

/**
 * Verbatim facts from the Korean business registration certificate
 * (사업자등록증). Language independent, so they live outside the dictionaries.
 * The representative's date of birth appears on the certificate and is
 * deliberately NOT published here.
 */
export const LEGAL = {
  regNumber: "576-60-00821",
  tradeName: "코라비아 (korabia)",
  representative: "ALGHURIBI MOHAMMED MAHDI AHMED",
  addressKo: "인천광역시 미추홀구 문학길109번길 17-7, 향기주택 B02호 (문학동)",
  since: "2024-05-20",
} as const;

/** Media is language independent; dictionaries stay pure text. */
export const SERVICE_IMAGES = [
  "/assets/service-auction.webp",
  "/assets/service-inspection.webp",
  "/assets/service-shipping.webp",
  "/assets/service-commercial.webp",
];

export const VEHICLE_IMAGES = [
  "/assets/car-sedan.webp",
  "/assets/car-suv.webp",
  "/assets/car-luxury.webp",
  "/assets/car-ev.webp",
  "/assets/car-van.webp",
  "/assets/car-pickup.webp",
];

export const VEHICLE_IDS = ["sedan", "suv", "luxury", "ev", "van", "pickup"];

export const KOREA_ICONS = [
  "/assets/icon-translate.webp",
  "/assets/icon-wheel.webp",
  "/assets/icon-house.webp",
  "/assets/icon-key.webp",
  "/assets/icon-clipboard.webp",
  "/assets/icon-doc.webp",
  "/assets/icon-gavel.webp",
  "/assets/icon-ship.webp",
];

export const NAV_HREFS = ["#services", "#process", "#vehicles", "#korea", "#faq"];

export type Pair = { title: string; body: string };

export type Dict = {
  meta: { title: string; description: string; keywords: string };
  hours: { kr: string; sa: string; city: string };
  cta: { request: string; whatsapp: string };
  nav: string[];
  hero: { headline: [string, string]; sub: string; alt: string };
  services: { eyebrow: string; title: string; items: (Pair & { en: string; alt: string })[] };
  process: { title: string; intro: string; steps: (Pair & { n: string })[]; closing: string };
  vehicles: { title: string; intro: string; items: { title: string; en: string; note: string; alt: string }[] };
  why: { eyebrow: string; title: string; body: string; macroAlt: string; pillars: Pair[] };
  korea: { title: string; intro: string; items: (Pair & { en: string })[] };
  request: {
    eyebrow: string;
    title: string;
    sub: string;
    fields: Record<"name" | "phone" | "country" | "category" | "model" | "budget" | "notes", string>;
    placeholders: Record<"phone" | "country" | "model" | "budget" | "notes", string>;
    other: string;
    optional: string;
    submit: string;
    sending: string;
    successTitle: string;
    successBody: string;
    errorBody: string;
    another: string;
    waSummary: Record<"heading" | "name" | "category" | "wanted" | "destination" | "budget", string>;
    waGeneral: string;
  };
  faq: { title: string; items: { q: string; a: string }[] };
  footer: {
    tagline: string;
    rights: string;
    contactHeading: string;
    sectionsHeading: string;
    languagesHeading: string;
  };
  legal: {
    heading: string;
    note: string;
    badge: string;
    labels: Record<
      "regNumber" | "tradeName" | "representative" | "address" | "scope" | "since" | "authority",
      string
    >;
    address: string;
    scope: string;
    authority: string;
  };
  notFound: { code: string; title: string; body: string; home: string };
  errorPage: { title: string; body: string; retry: string; home: string };
};
