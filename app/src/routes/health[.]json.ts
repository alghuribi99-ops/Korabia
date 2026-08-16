import { createFileRoute } from "@tanstack/react-router";

import { bindings } from "../lib/bindings.server";

/** Temporary deploy check: confirms the D1 binding the request form writes to. */
export const Route = createFileRoute("/health.json")({
  server: {
    handlers: {
      GET: async () => {
        const { DB } = bindings();
        let rows = -1;
        if (DB) {
          await DB.prepare(
            "CREATE TABLE IF NOT EXISTS car_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL, country TEXT NOT NULL, category TEXT NOT NULL, model TEXT NOT NULL, budget TEXT, notes TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))",
          ).run();
          const row = await DB.prepare("SELECT COUNT(*) AS n FROM car_requests").first<{ n: number }>();
          rows = row?.n ?? -2;
        }
        return new Response(JSON.stringify({ db: Boolean(DB), rows }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
