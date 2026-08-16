import { LANGS, LANG_META, type Lang } from "../../site/types";

/** Compact locale row. Plain anchors so every locale is a real crawlable URL. */
export function LangSwitch({
  lang,
  tone,
}: {
  lang: Lang;
  tone: "light" | "dark" | "onInk";
}) {
  const base =
    tone === "onInk"
      ? "text-[#F2F2EF]/55 hover:text-[#F2F2EF]"
      : tone === "light"
        ? "text-[#F2F2EF]/70 hover:text-[#F2F2EF]"
        : "text-[#6E767C] hover:text-[#111619]";

  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {LANGS.map((code) => {
        const meta = LANG_META[code];
        const active = code === lang;
        return (
          <li key={code}>
            <a
              href={meta.path}
              lang={meta.htmlLang}
              hrefLang={meta.htmlLang}
              aria-current={active ? "page" : undefined}
              className={
                "k-underline relative text-[13px] transition-colors " +
                (active ? "k-lang-current font-medium" : base)
              }
            >
              {meta.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
