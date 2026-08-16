import { getDict } from "../../site/content";
import { LEGAL, type Lang } from "../../site/types";

export function Why({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <section className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-12 px-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-16 md:px-10">
        <div>
          <p className="k-mono mb-4 text-xs uppercase tracking-[0.22em] text-[#1F3FB8]">{t.why.eyebrow}</p>
          <h2 className="k-display max-w-[20ch] text-3xl md:text-5xl">{t.why.title}</h2>
          <p className="k-body mt-6 text-[#6E767C]">{t.why.body}</p>

          <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#DCDCD6] pt-5 text-[14px] text-[#111619]">
            <span className="font-medium">{t.legal.badge}</span>
            <span aria-hidden="true" className="text-[#DCDCD6]">/</span>
            <span className="text-[#6E767C]">{t.legal.labels.regNumber}</span>
            <span className="k-mono" dir="ltr">
              {LEGAL.regNumber}
            </span>
          </p>
        </div>

        <div className="relative -me-5 md:-me-10 md:mt-10">
          <img
            src="/assets/macro.webp"
            alt={t.why.macroAlt}
            loading="lazy"
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] px-5 md:mt-20 md:px-10">
        <div className="grid grid-cols-1 border-t border-[#DCDCD6] md:grid-cols-3">
          {t.why.pillars.map((p, i) => (
            <div
              key={p.title}
              className={
                "border-b border-[#DCDCD6] py-8 md:border-b-0 md:py-10 " +
                (i === 0 ? "md:pe-8" : "md:border-s md:border-[#DCDCD6] md:px-8")
              }
            >
              <h3 className="k-display text-xl md:text-2xl">{p.title}</h3>
              <p className="k-body mt-3 text-[15px] text-[#6E767C]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
