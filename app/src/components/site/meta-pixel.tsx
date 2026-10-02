import { useEffect } from "react";

/** The account's existing pixel, dormant since January 2023. */
const PIXEL_ID = "5990906154295029";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/**
 * Meta's pixel, on the public pages only. The admin panel is deliberately left
 * out: what the owner does inside their own dashboard is not an audience
 * signal, and sending it would leak the business's working pattern to Meta.
 *
 * Nothing identifying is passed. The pixel reports that a page was seen and,
 * from the WhatsApp buttons, that an inquiry started — the one event worth
 * optimising an ad against.
 */
export function MetaPixel() {
  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
      return;
    }

    const fbq: Fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue?.push(args);
    } as Fbq;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);

    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }, []);

  return null;
}

/** Reports an inquiry to Meta. Safe to call when the pixel never loaded. */
export function trackContact(detail: Record<string, string | number | undefined>) {
  try {
    window.fbq?.("track", "Contact", detail);
  } catch {
    /* an ad counter is never worth an error in front of a visitor */
  }
}
