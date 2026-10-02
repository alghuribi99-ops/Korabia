import { createFileRoute } from "@tanstack/react-router";

import { bindings } from "../lib/bindings.server";

const LANGS = new Set(["ar", "en", "ru", "es", "ko"]);
const SOURCES = new Set(["hero", "offer", "form", "form-done", "footer", "bar"]);

const ENSURE = `CREATE TABLE IF NOT EXISTS wa_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  offer_id INTEGER,
  car TEXT,
  lang TEXT,
  country TEXT,
  city TEXT,
  device TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')))`;

/**
 * Counts a visitor choosing to open WhatsApp. The conversation itself happens
 * on WhatsApp and is invisible here, so this click is the only moment the site
 * can see an inquiry begin — without it the funnel looks empty while the phone
 * is busy. Stores the same minimum as the view counter: no IP, no user agent,
 * no phone number, nothing that identifies a person.
 */
export const Route = createFileRoute("/api/wa")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { DB } = bindings();
        if (!DB) return new Response(null, { status: 204 });

        let body: { source?: string; offerId?: number; car?: string; lang?: string } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          /* an empty body still counts as a click */
        }

        const source = SOURCES.has(String(body.source)) ? String(body.source) : "other";
        const lang = LANGS.has(String(body.lang)) ? String(body.lang) : null;
        const offerId =
          typeof body.offerId === "number" && Number.isInteger(body.offerId) && body.offerId > 0
            ? body.offerId
            : null;
        const car = String(body.car ?? "").trim().slice(0, 80) || null;

        const geo = (request as unknown as { cf?: Record<string, unknown> }).cf ?? {};
        const pick = (key: string) => {
          const v = geo[key];
          return typeof v === "string" && v.trim() ? v.trim().slice(0, 60) : null;
        };
        const headerCountry = (request.headers.get("cf-ipcountry") ?? "").slice(0, 4);
        const country = pick("country") ?? (headerCountry || null);
        const city = pick("city");
        const ua = request.headers.get("user-agent") ?? "";
        const device = /Mobi|Android|iPhone|iPod/i.test(ua)
          ? "mobile"
          : /iPad|Tablet/i.test(ua)
            ? "tablet"
            : "desktop";

        try {
          await DB.prepare(ENSURE).run();
          await DB.prepare(
            "INSERT INTO wa_clicks (source, offer_id, car, lang, country, city, device) VALUES (?, ?, ?, ?, ?, ?, ?)",
          )
            .bind(source, offerId, car, lang, country, city, device)
            .run();
        } catch {
          /* counting must never delay opening WhatsApp */
        }

        return new Response(null, { status: 204 });
      },
    },
  },
});
