import { createFileRoute } from "@tanstack/react-router";

import { bindings } from "../lib/bindings.server";

const LANGS = new Set(["ar", "en", "ru", "es", "ko"]);

/**
 * First party view counter. Deliberately stores no IP and no raw user agent:
 * just the page, the locale, the country Cloudflare already resolved, the
 * referring host and a device class.
 */
export const Route = createFileRoute("/api/hit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { DB } = bindings();
        if (!DB) return new Response(null, { status: 204 });

        let body: { path?: string; lang?: string; referrer?: string } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          /* empty body is fine */
        }

        const path = String(body.path ?? "/").slice(0, 64);
        const lang = LANGS.has(String(body.lang)) ? String(body.lang) : null;

        let referrer: string | null = null;
        const raw = String(body.referrer ?? "").trim();
        if (raw) {
          try {
            const host = new URL(raw).hostname.replace(/^www\./, "");
            const self = new URL(request.url).hostname.replace(/^www\./, "");
            referrer = host === self ? null : host.slice(0, 80);
          } catch {
            /* unparseable referrer is dropped */
          }
        }

        // Cloudflare resolves geography at the edge, so no IP is ever read or
        // stored here. City level only, never a street or a coordinate.
        const geo = (request as unknown as { cf?: Record<string, unknown> }).cf ?? {};
        const pick = (key: string) => {
          const v = geo[key];
          return typeof v === "string" && v.trim() ? v.trim().slice(0, 60) : null;
        };
        const headerCountry = (request.headers.get("cf-ipcountry") ?? "").slice(0, 4);
        const country = pick("country") ?? (headerCountry || null);
        const city = pick("city");
        const region = pick("region");
        const ua = request.headers.get("user-agent") ?? "";
        const device = /Mobi|Android|iPhone|iPod/i.test(ua)
          ? "mobile"
          : /iPad|Tablet/i.test(ua)
            ? "tablet"
            : "desktop";

        try {
          await DB.prepare(
            "CREATE TABLE IF NOT EXISTS page_views (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, lang TEXT, country TEXT, city TEXT, region TEXT, referrer TEXT, device TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))",
          ).run();
          for (const column of ["city", "region"]) {
            try {
              await DB.prepare("ALTER TABLE page_views ADD COLUMN " + column + " TEXT").run();
            } catch {
              /* already present */
            }
          }
          await DB.prepare(
            "INSERT INTO page_views (path, lang, country, city, region, referrer, device) VALUES (?, ?, ?, ?, ?, ?, ?)",
          )
            .bind(path, lang, country, city, region, referrer, device)
            .run();
        } catch {
          /* analytics must never break a page view */
        }

        return new Response(null, { status: 204 });
      },
    },
  },
});
