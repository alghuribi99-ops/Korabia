import { getDict } from "../../site/content";
import type { Lang } from "../../site/types";

export function Faq({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <section id="faq" className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 md:grid-cols-[minmax(0,28ch)_minmax(0,1fr)] md:gap-20 md:px-10">
        <h2 className="k-display text-3xl md:text-4xl">{t.faq.title}</h2>

        <div className="border-t border-[#111619]/15">
          {t.faq.items.map((item, i) => (
            <details key={item.q} className="border-b border-[#111619]/15" open={i === 0}>
              <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 text-[17px] font-medium md:text-xl">
                <span>{item.q}</span>
                <span aria-hidden="true" className="k-mono k-sign mt-1 shrink-0 text-lg leading-none text-[#6E767C]">
                  <span className="k-plus">+</span>
                  <span className="k-minus">&#8722;</span>
                </span>
              </summary>
              <p className="k-body pb-7 text-[15px] text-[#6E767C]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
