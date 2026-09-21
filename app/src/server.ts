import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

const CANONICAL_ORIGIN = "https://korabia.co";

function permanentRedirect(location: string): Response {
  return new Response(null, {
    status: 301,
    headers: { location, "cache-control": "public, max-age=3600" },
  });
}

// The site lives on korabia.co. Two hosts are permanently sent there: the
// retired Higgsfield host, and the www subdomain (so search engines see one
// canonical URL). Preview hosts are left alone so a preview deployment can
// still be opened as itself.
function canonicalRedirect(url: URL): Response | null {
  const host = url.hostname;
  if (!host.endsWith(".higgsfield.app") && host !== "www.korabia.co") return null;
  return permanentRedirect(CANONICAL_ORIGIN + url.pathname + url.search);
}

// Pages of the previous site are still in Google's index under their old
// Arabic slugs. A visitor who clicks one should land on the closest part of
// the current site rather than on a dead end, so an unknown page is redirected
// permanently instead of returning 404. Everything that is not a page — assets,
// images, API calls — keeps its real 404.
const LEGACY_SECTIONS: Array<[RegExp, string]> = [
  [/(مزاد|سيار|مركب|car|auction|vehicle|auto)/i, "/#services"],
  [/(تواصل|اتصل|طلب|contact|order|quote|inquir)/i, "/#request"],
];

function legacyTarget(pathname: string): string {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    // A malformed escape sequence is not worth failing the redirect over.
  }
  for (const [pattern, target] of LEGACY_SECTIONS) {
    if (pattern.test(decoded)) return target;
  }
  return "/";
}

/** A request for a page, as opposed to an asset, an image or an API call. */
function isPageRequest(request: Request, url: URL): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (!(request.headers.get("accept") ?? "").includes("text/html")) return false;
  const path = url.pathname;
  if (path.startsWith("/api/") || path.startsWith("/img") || path.startsWith("/assets/")) {
    return false;
  }
  return !/\.[a-z0-9]{2,5}$/i.test(path);
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const canonical = canonicalRedirect(url);
      if (canonical) return canonical;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);

      if (response.status === 404 && isPageRequest(request, url)) {
        return permanentRedirect(CANONICAL_ORIGIN + legacyTarget(url.pathname));
      }

      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
