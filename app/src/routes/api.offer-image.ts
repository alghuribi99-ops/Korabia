import { createFileRoute } from "@tanstack/react-router";

import { bindings } from "../lib/bindings.server";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_BYTES = 4 * 1024 * 1024;

function sameSecret(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Receives one already-downscaled photo from the admin form and stores it. */
export const Route = createFileRoute("/api/offer-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { STORAGE, ADMIN_PASSWORD } = bindings();
        const form = await request.formData();
        const password = String(form.get("password") ?? "");

        if (!ADMIN_PASSWORD || !sameSecret(password, ADMIN_PASSWORD)) {
          return Response.json({ ok: false, reason: "auth" }, { status: 401 });
        }
        if (!STORAGE) return Response.json({ ok: false, reason: "storage" }, { status: 503 });

        const file = form.get("file");
        if (!(file instanceof File)) {
          return Response.json({ ok: false, reason: "file" }, { status: 400 });
        }
        const ext = TYPES[file.type];
        if (!ext) return Response.json({ ok: false, reason: "type" }, { status: 415 });
        if (file.size > MAX_BYTES) {
          return Response.json({ ok: false, reason: "size" }, { status: 413 });
        }

        const key =
          "offers/" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10) + "." + ext;
        await STORAGE.put(key, await file.arrayBuffer(), {
          httpMetadata: { contentType: file.type },
        });

        return Response.json({ ok: true, key });
      },
    },
  },
});
