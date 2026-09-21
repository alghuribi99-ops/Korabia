import { getDict } from "./content";
import { LANGS, LANG_META, SITE_ORIGIN, type Lang } from "./types";

const OG_IMAGE = SITE_ORIGIN + "/assets/og-cover.webp";

/** Per locale document head: title, description, social card, canonical, hreflang. */
export function localeHead(lang: Lang) {
  const t = getDict(lang);
  const meta = LANG_META[lang];
  const url = SITE_ORIGIN + meta.path;

  return {
    meta: [
      { title: t.meta.title },
      { name: "description", content: t.meta.description },
      { name: "keywords", content: t.meta.keywords },
      { property: "og:site_name", content: "Korabia" },
      { property: "og:locale", content: meta.ogLocale },
      { property: "og:title", content: t.meta.title },
      { property: "og:description", content: t.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@korabia_service" },
      { name: "twitter:title", content: t.meta.title },
      { name: "twitter:description", content: t.meta.description },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "theme-color", content: "#f2f2ef" },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png" },
      ...LANGS.map((code) => ({
        rel: "alternate",
        hrefLang: LANG_META[code].htmlLang,
        href: SITE_ORIGIN + LANG_META[code].path,
      })),
      { rel: "alternate", hrefLang: "x-default", href: SITE_ORIGIN + "/en" },
    ],
  };
}
