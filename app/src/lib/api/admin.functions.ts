import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  country: string;
  category: string;
  model: string;
  budget: string | null;
  notes: string | null;
  lang: string | null;
  created_at: string;
};

export type Bucket = { key: string; n: number };

export type Range = 7 | 30 | 90;

export type AdminData = {
  ok: true;
  range: Range;
  kpi: {
    leadsTotal: number;
    leadsRange: number;
    viewsTotal: number;
    viewsRange: number;
    conversion: number;
  };
  viewsByDay: { day: string; n: number }[];
  byLang: Bucket[];
  byCountry: Bucket[];
  byDevice: Bucket[];
  byReferrer: Bucket[];
  leads: Lead[];
};

export type AdminResult = AdminData | { ok: false; reason: "auth" | "storage" | "locked" };

/** Length independent comparison, so a wrong guess leaks nothing by timing. */
function sameSecret(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const ENSURE_ATTEMPTS =
  "CREATE TABLE IF NOT EXISTS admin_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL DEFAULT (datetime('now')))";

/** A short password deserves a real brake, so guessing is rate limited. */
const MAX_FAILURES = 8;
const WINDOW = "-10 minutes";

const ENSURE_VIEWS =
  "CREATE TABLE IF NOT EXISTS page_views (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, lang TEXT, country TEXT, referrer TEXT, device TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))";

export const loadAdminData = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      password: z.string().min(1).max(200),
      range: z.union([z.literal(7), z.literal(30), z.literal(90)]).default(30),
    }),
  )
  .handler(async ({ data }): Promise<AdminResult> => {
    const { DB, ADMIN_PASSWORD } = bindings();

    if (DB) await DB.prepare(ENSURE_ATTEMPTS).run();

    if (DB) {
      const recent =
        (
          await DB.prepare(
            "SELECT COUNT(*) AS n FROM admin_attempts WHERE created_at >= datetime('now', ?)",
          )
            .bind(WINDOW)
            .first<{ n: number }>()
        )?.n ?? 0;
      if (recent >= MAX_FAILURES) {
        await new Promise((r) => setTimeout(r, 600));
        return { ok: false, reason: "locked" };
      }
    }

    if (!ADMIN_PASSWORD || !sameSecret(data.password, ADMIN_PASSWORD)) {
      if (DB) await DB.prepare("INSERT INTO admin_attempts DEFAULT VALUES").run();
      await new Promise((r) => setTimeout(r, 600));
      return { ok: false, reason: "auth" };
    }
    if (!DB) return { ok: false, reason: "storage" };

    // A good password clears the brake for the next visit.
    await DB.prepare("DELETE FROM admin_attempts").run();

    await DB.prepare(ENSURE_VIEWS).run();

    const since = `-${data.range} days`;
    const one = async <T>(sql: string, ...binds: unknown[]) =>
      (await DB.prepare(sql)
        .bind(...binds)
        .first<T>()) ?? null;
    const many = async <T>(sql: string, ...binds: unknown[]) =>
      (
        await DB.prepare(sql)
          .bind(...binds)
          .all<T>()
      ).results ?? [];

    const leadsTotal = (await one<{ n: number }>("SELECT COUNT(*) AS n FROM car_requests"))?.n ?? 0;
    const leadsRange =
      (
        await one<{ n: number }>(
          "SELECT COUNT(*) AS n FROM car_requests WHERE created_at >= datetime('now', ?)",
          since,
        )
      )?.n ?? 0;
    const viewsTotal = (await one<{ n: number }>("SELECT COUNT(*) AS n FROM page_views"))?.n ?? 0;
    const viewsRange =
      (
        await one<{ n: number }>(
          "SELECT COUNT(*) AS n FROM page_views WHERE created_at >= datetime('now', ?)",
          since,
        )
      )?.n ?? 0;

    const rawDays = await many<{ day: string; n: number }>(
      "SELECT date(created_at) AS day, COUNT(*) AS n FROM page_views WHERE created_at >= datetime('now', ?) GROUP BY day ORDER BY day",
      since,
    );
    const counted = new Map(rawDays.map((r) => [r.day, r.n]));
    const span = Math.min(data.range, 30);
    const today = new Date();
    const viewsByDay: { day: string; n: number }[] = [];
    for (let i = span - 1; i >= 0; i -= 1) {
      const d = new Date(today.getTime() - i * 86400000).toISOString().slice(0, 10);
      viewsByDay.push({ day: d, n: counted.get(d) ?? 0 });
    }

    const bucket = (rows: { key: string | null; n: number }[]): Bucket[] =>
      rows.map((r) => ({ key: r.key ?? "unknown", n: r.n }));

    const byLang = bucket(
      await many<{ key: string | null; n: number }>(
        "SELECT lang AS key, COUNT(*) AS n FROM page_views WHERE created_at >= datetime('now', ?) GROUP BY lang ORDER BY n DESC",
        since,
      ),
    );
    const byCountry = bucket(
      await many<{ key: string | null; n: number }>(
        "SELECT country AS key, COUNT(*) AS n FROM page_views WHERE created_at >= datetime('now', ?) GROUP BY country ORDER BY n DESC LIMIT 12",
        since,
      ),
    );
    const byDevice = bucket(
      await many<{ key: string | null; n: number }>(
        "SELECT device AS key, COUNT(*) AS n FROM page_views WHERE created_at >= datetime('now', ?) GROUP BY device ORDER BY n DESC",
        since,
      ),
    );
    const byReferrer = bucket(
      await many<{ key: string | null; n: number }>(
        "SELECT referrer AS key, COUNT(*) AS n FROM page_views WHERE created_at >= datetime('now', ?) AND referrer IS NOT NULL GROUP BY referrer ORDER BY n DESC LIMIT 8",
        since,
      ),
    );

    const leads = await many<Lead>(
      "SELECT id, name, phone, country, category, model, budget, notes, lang, created_at FROM car_requests ORDER BY id DESC LIMIT 500",
    );

    return {
      ok: true,
      range: data.range,
      kpi: {
        leadsTotal,
        leadsRange,
        viewsTotal,
        viewsRange,
        conversion: viewsRange > 0 ? (leadsRange / viewsRange) * 100 : 0,
      },
      viewsByDay,
      byLang,
      byCountry,
      byDevice,
      byReferrer,
      leads,
    };
  });
