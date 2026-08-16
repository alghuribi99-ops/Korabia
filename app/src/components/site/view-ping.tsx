import { useEffect } from "react";

import { LANG_META, type Lang } from "../../site/types";

/** Records one view per page load. Fire and forget, never blocks rendering. */
export function ViewPing({ lang }: { lang: Lang }) {
  useEffect(() => {
    const payload = JSON.stringify({
      path: LANG_META[lang].path,
      lang,
      referrer: document.referrer || "",
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    });
    void fetch("/api/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* a blocked counter is not an error the visitor should ever see */
    });
  }, [lang]);

  return null;
}
