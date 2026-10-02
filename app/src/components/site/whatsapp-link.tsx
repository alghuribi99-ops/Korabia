import type { ReactNode } from "react";

import { whatsappLink, type Lang } from "../../site/types";
import { trackContact } from "./meta-pixel";

export type WaSource = "hero" | "offer" | "form" | "form-done" | "footer" | "bar";

/**
 * Every way into WhatsApp on the site. The click is reported before the tab
 * opens, with sendBeacon so the request survives the navigation, and a failure
 * to report never stands between the visitor and the conversation.
 */
export function WhatsAppLink({
  message,
  source,
  lang,
  offerId,
  car,
  className,
  children,
}: {
  message: string;
  source: WaSource;
  lang: Lang;
  offerId?: number;
  car?: string;
  className?: string;
  children: ReactNode;
}) {
  function report() {
    trackContact({ content_name: car ?? source, content_category: source });
    try {
      const payload = JSON.stringify({ source, lang, offerId, car });
      const sent =
        typeof navigator !== "undefined" &&
        typeof navigator.sendBeacon === "function" &&
        navigator.sendBeacon("/api/wa", new Blob([payload], { type: "application/json" }));
      if (sent) return;
      void fetch("/api/wa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* a blocked counter is not the visitor's problem */
    }
  }

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={report}
      className={className}
    >
      {children}
    </a>
  );
}
