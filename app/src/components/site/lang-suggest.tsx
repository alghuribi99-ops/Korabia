import { useEffect, useState } from "react";

import { LANGS, LANG_META, SUGGEST, SUGGEST_KEY, type Lang } from "../../site/types";

/**
 * Suggests the visitor's own language instead of redirecting them. Google
 * treats automatic language redirects as a crawling hazard, so every locale
 * keeps a stable URL and the visitor makes the call. Renders nothing on the
 * server: the decision needs navigator, so it only appears after mount.
 */
export function LangSuggest({ lang }: { lang: Lang }) {
  const [suggested, setSuggested] = useState<Lang | null>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SUGGEST_KEY)) return;
    } catch {
      /* storage blocked, carry on and just show the hint */
    }

    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const raw of preferences) {
      const code = String(raw).toLowerCase().split("-")[0] as Lang;
      if (LANGS.includes(code)) {
        if (code !== lang) setSuggested(code);
        return;
      }
    }
  }, [lang]);

  if (!suggested) return null;

  const copy = SUGGEST[suggested];
  const meta = LANG_META[suggested];

  const remember = () => {
    try {
      window.localStorage.setItem(SUGGEST_KEY, "1");
    } catch {
      /* storage blocked */
    }
  };

  return (
    <div
      role="region"
      aria-label={copy.text}
      lang={meta.htmlLang}
      dir={meta.dir}
      className="k-rise fixed bottom-[70px] start-4 end-4 z-40 mx-auto max-w-[26rem] border border-[#111619] bg-[#111619] px-5 py-4 text-[#F2F2EF] shadow-[0_10px_40px_rgba(17,22,25,0.25)] sm:end-auto lg:bottom-6 lg:start-6"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-[14px] leading-relaxed text-[#F2F2EF]/85">{copy.text}</p>
        <button
          type="button"
          onClick={() => {
            remember();
            setSuggested(null);
          }}
          aria-label={copy.dismiss}
          className="-mt-1 shrink-0 px-1 text-xl leading-none text-[#F2F2EF]/50 transition-colors hover:text-[#F2F2EF]"
        >
          &#215;
        </button>
      </div>
      <a
        href={meta.path}
        hrefLang={meta.htmlLang}
        onClick={remember}
        className="mt-3 inline-flex items-center gap-2 bg-[#1F3FB8] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#16309A]"
      >
        {copy.action}
      </a>
    </div>
  );
}
