import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";

export const carRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(32),
  country: z.string().trim().min(2).max(120),
  category: z.string().trim().min(1).max(40),
  model: z.string().trim().min(1).max(160),
  budget: z.string().trim().max(80).default(""),
  notes: z.string().trim().max(1200).default(""),
  lang: z.string().trim().max(8).default("ar"),
});

export type CarRequestInput = z.infer<typeof carRequestSchema>;

/** Persists one incoming car request into D1. */
export const submitCarRequest = createServerFn({ method: "POST" })
  .inputValidator(carRequestSchema)
  .handler(async ({ data }) => {
    const { DB } = bindings();
    if (!DB) {
      return { ok: false as const, reason: "storage_unavailable" as const };
    }

    await DB.prepare(
      "CREATE TABLE IF NOT EXISTS car_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL, country TEXT NOT NULL, category TEXT NOT NULL, model TEXT NOT NULL, budget TEXT, notes TEXT, lang TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))",
    ).run();

    // The table predates the lang column, so widen it defensively. SQLite has
    // no ADD COLUMN IF NOT EXISTS, and a repeat call is a caught no-op.
    try {
      await DB.prepare("ALTER TABLE car_requests ADD COLUMN lang TEXT").run();
    } catch {
      /* column already present */
    }

    await DB.prepare(
      "INSERT INTO car_requests (name, phone, country, category, model, budget, notes, lang) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(data.name, data.phone, data.country, data.category, data.model, data.budget, data.notes, data.lang)
      .run();

    return { ok: true as const };
  });
