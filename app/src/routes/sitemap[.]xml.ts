import { createFileRoute } from "@tanstack/react-router";

import { LANGS, LANG_META } from "../site/types";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = new Date().toISOString().split("T")[0];
        const alternates = LANGS.map(
          (code) =>
            `    <xhtml:link rel="alternate" hreflang="${LANG_META[code].htmlLang}" href="${origin}${LANG_META[code].path}" />`,
        ).join("\n");

        const urls = LANGS.map((code) =>
          [
            "  <url>",
            `    <loc>${origin}${LANG_META[code].path}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            "    <changefreq>weekly</changefreq>",
            `    <priority>${code === "ar" ? "1.0" : "0.9"}</priority>`,
            alternates,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/en" />`,
            "  </url>",
          ].join("\n"),
        ).join("\n");

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
          urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
