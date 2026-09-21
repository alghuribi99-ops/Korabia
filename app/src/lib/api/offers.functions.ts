import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { COLORS, FUELS, TRANSMISSIONS } from "../../site/offer-labels";
import { bindings } from "../bindings.server";

export type Offer = {
  id: number;
  make: string;
  model: string;
  year: number | null;
  mileage: number | null;
  price: string | null;
  transmission: string | null;
  fuel: string | null;
  color: string | null;
  note: string | null;
  images: string[];
  publishedAt: string;
  expiresAt: string;
  hidden?: boolean;
};

type Row = {
  id: number;
  make: string;
  model: string;
  year: number | null;
  mileage: number | null;
  price: string | null;
  transmission: string | null;
  fuel: string | null;
  color: string | null;
  note: string | null;
  images: string;
  published_at: string;
  expires_at: string;
  hidden: number;
};

const ENSURE = `CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  make TEXT NOT NULL, model TEXT NOT NULL, year INTEGER, mileage INTEGER,
  price TEXT, transmission TEXT, fuel TEXT, color TEXT, note TEXT,
  images TEXT NOT NULL DEFAULT '[]',
  published_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')))`;

/** SQLite stores UTC without a marker; make it unambiguous for the browser. */
function iso(v: string) {
  return v.includes("T") ? v : v.replace(" ", "T") + "Z";
}

function toOffer(r: Row): Offer {
  let images: string[] = [];
  try {
    const parsed = JSON.parse(r.images);
    if (Array.isArray(parsed)) images = parsed.filter((x) => typeof x === "string");
  } catch {
    /* a malformed list simply renders without photos */
  }
  return {
    id: r.id,
    make: r.make,
    model: r.model,
    year: r.year,
    mileage: r.mileage,
    price: r.price,
    transmission: r.transmission,
    fuel: r.fuel,
    color: r.color,
    note: r.note,
    images,
    publishedAt: iso(r.published_at),
    expiresAt: iso(r.expires_at),
    hidden: r.hidden === 1,
  };
}

export type OfferFeed = { live: Offer[]; past: Offer[] };

/**
 * Expiry is evaluated at read time, so an offer stops showing exactly 48 hours
 * after it went up with no scheduled job to drift or fail.
 */
export const getOffers = createServerFn({ method: "GET" }).handler(async (): Promise<OfferFeed> => {
  const { DB } = bindings();
  if (!DB) return { live: [], past: [] };
  await DB.prepare(ENSURE).run();

  const live = await DB.prepare(
    "SELECT * FROM offers WHERE hidden = 0 AND expires_at > datetime('now') ORDER BY published_at DESC LIMIT 24",
  ).all<Row>();
  const past = await DB.prepare(
    "SELECT * FROM offers WHERE hidden = 0 AND expires_at <= datetime('now') ORDER BY expires_at DESC LIMIT 8",
  ).all<Row>();

  return {
    live: (live.results ?? []).map(toOffer),
    past: (past.results ?? []).map(toOffer),
  };
});

function sameSecret(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const auth = z.object({ password: z.string().min(1).max(200) });

export const adminListOffers = createServerFn({ method: "POST" })
  .inputValidator(auth)
  .handler(async ({ data }): Promise<{ ok: boolean; offers: Offer[] }> => {
    const { DB, ADMIN_PASSWORD } = bindings();
    if (!ADMIN_PASSWORD || !sameSecret(data.password, ADMIN_PASSWORD)) return { ok: false, offers: [] };
    if (!DB) return { ok: false, offers: [] };
    await DB.prepare(ENSURE).run();
    const rows = await DB.prepare("SELECT * FROM offers ORDER BY id DESC LIMIT 200").all<Row>();
    return { ok: true, offers: (rows.results ?? []).map(toOffer) };
  });

export const createOffer = createServerFn({ method: "POST" })
  .inputValidator(
    auth.extend({
      make: z.string().trim().min(1).max(40),
      model: z.string().trim().min(1).max(60),
      year: z.number().int().min(1980).max(2100).nullable().default(null),
      mileage: z.number().int().min(0).max(2000000).nullable().default(null),
      price: z.string().trim().max(40).default(""),
      transmission: z.enum(TRANSMISSIONS).nullable().default(null),
      fuel: z.enum(FUELS).nullable().default(null),
      color: z.enum(COLORS).nullable().default(null),
      note: z.string().trim().max(400).default(""),
      images: z.array(z.string().max(120)).max(6).default([]),
    }),
  )
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { DB, ADMIN_PASSWORD } = bindings();
    if (!ADMIN_PASSWORD || !sameSecret(data.password, ADMIN_PASSWORD)) return { ok: false };
    if (!DB) return { ok: false };
    await DB.prepare(ENSURE).run();
    await DB.prepare(
      `INSERT INTO offers (make, model, year, mileage, price, transmission, fuel, color, note, images, published_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now', '+48 hours'))`,
    )
      .bind(
        data.make,
        data.model,
        data.year,
        data.mileage,
        data.price || null,
        data.transmission,
        data.fuel,
        data.color,
        data.note || null,
        JSON.stringify(data.images),
      )
      .run();
    return { ok: true };
  });

export const offerAction = createServerFn({ method: "POST" })
  .inputValidator(
    auth.extend({
      id: z.number().int().positive(),
      action: z.enum(["extend", "expire", "hide", "show", "delete"]),
    }),
  )
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { DB, STORAGE, ADMIN_PASSWORD } = bindings();
    if (!ADMIN_PASSWORD || !sameSecret(data.password, ADMIN_PASSWORD)) return { ok: false };
    if (!DB) return { ok: false };

    if (data.action === "delete") {
      const row = await DB.prepare("SELECT images FROM offers WHERE id = ?")
        .bind(data.id)
        .first<{ images: string }>();
      if (row && STORAGE) {
        try {
          for (const key of JSON.parse(row.images) as string[]) await STORAGE.delete(key);
        } catch {
          /* leave orphaned objects rather than fail the delete */
        }
      }
      await DB.prepare("DELETE FROM offers WHERE id = ?").bind(data.id).run();
      return { ok: true };
    }

    const sql: Record<string, string> = {
      extend: "UPDATE offers SET expires_at = datetime('now', '+48 hours'), published_at = datetime('now'), hidden = 0 WHERE id = ?",
      expire: "UPDATE offers SET expires_at = datetime('now', '-1 minutes') WHERE id = ?",
      hide: "UPDATE offers SET hidden = 1 WHERE id = ?",
      show: "UPDATE offers SET hidden = 0 WHERE id = ?",
    };
    await DB.prepare(sql[data.action]).bind(data.id).run();
    return { ok: true };
  });
