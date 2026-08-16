import { getDict } from "../../site/content";
import { LANG_META, type Lang } from "../../site/types";

export function Process({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const rtl = LANG_META[lang].dir === "rtl";

  return (
    <section id="process" className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="max-w-[52ch]">
          <h2 className="k-display text-3xl md:text-5xl">{t.process.title}</h2>
          <p className="k-body mt-5 text-[#6E767C]">{t.process.intro}</p>
        </div>

        <div className="relative mt-14 md:mt-20">
          <span
            aria-hidden="true"
            className="k-grow absolute bottom-6 start-[7px] top-2 hidden w-px bg-[#111619]/25 md:block"
          />

          <ol className="flex flex-col gap-14 md:gap-16">
            {t.process.steps.map((step, i) => (
              <li
                key={step.n}
                className="relative grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-[auto_minmax(0,22ch)_minmax(0,54ch)] md:items-start md:ps-14"
              >
                <span
                  aria-hidden="true"
                  className="absolute start-0 top-2 hidden h-[15px] w-[15px] border border-[#111619] md:block"
                  style={{ backgroundColor: i === 0 ? "#1F3FB8" : "#F2F2EF" }}
                />
                <span className="k-mono text-sm text-[#1F3FB8] md:pt-1">{step.n}</span>
                <h3 className="k-display text-xl md:text-2xl">{step.title}</h3>
                <p className="k-body text-[15px] text-[#6E767C]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <a
        href="#request"
        className="k-cta-solid mt-16 flex items-center justify-between gap-6 bg-[#111619] px-5 py-8 text-[#F2F2EF] transition-colors duration-300 hover:bg-[#1F3FB8] md:mt-24 md:px-10 md:py-10"
      >
        <span className="k-display text-xl md:text-3xl">{t.process.closing}</span>
        <span aria-hidden="true" className="k-arrow text-2xl leading-none">
          {rtl ? "←" : "→"}
        </span>
      </a>
    </section>
  );
}
