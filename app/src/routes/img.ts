import { createFileRoute } from "@tanstack/react-router";

import { bindings } from "../lib/bindings.server";

const KEY = /^offers\/[a-z0-9]{6,40}\.(jpg|png|webp)$/;

/** Serves a stored offer photo. Keys are opaque, so the cache can be permanent. */
export const Route = createFileRoute("/img")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { STORAGE } = bindings();
        const key = new URL(request.url).searchParams.get("k") ?? "";
        if (!KEY.test(key)) return new Response("Not found", { status: 404 });
        if (!STORAGE) return new Response("Not found", { status: 404 });

        const object = await STORAGE.get(key);
        if (!object) return new Response("Not found", { status: 404 });

        return new Response(object.body as unknown as ReadableStream, {
          headers: {
            "Content-Type": object.httpMetadata?.contentType ?? "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Length": String(object.size),
          },
        });
      },
    },
  },
});
