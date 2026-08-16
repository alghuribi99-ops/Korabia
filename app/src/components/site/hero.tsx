import { CTA, HERO, whatsappLink } from "../../site/content";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[94dvh] w-full overflow-hidden bg-[#111619]">
      <img
        src="/assets/hero.webp"
        alt="صفوف من السيارات الجديدة على رصيف ميناء التصدير في كوريا مع سفينة نقل سيارات"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-l from-[#111619] via-[#111619]/70 to-[#111619]/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#111619] to-transparent"
      />

      <div aria-hidden="true" className="absolute bottom-0 left-10 top-32 hidden w-px bg-[#F2F2EF]/25 lg:block">
        <span className="k-grow absolute inset-x-0 top-0 h-1/2 bg-[#1F3FB8]" />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute -left-2 h-px w-4 bg-[#F2F2EF]/50"
            style={{ top: 18 + i * 22 + "%" }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[94dvh] max-w-[1400px] flex-col justify-end px-5 pb-20 pt-28 md:px-10 md:pb-28">
        <h1 className="k-display k-rise max-w-[16ch] text-[2.6rem] text-[#F2F2EF] sm:text-6xl md:text-7xl">
          {HERO.headline[0]}
          <br />
          {HERO.headline[1]}
        </h1>

        <p className="k-rise k-d2 mt-6 max-w-[54ch] text-[15px] leading-relaxed text-[#F2F2EF]/80 md:text-lg">
          {HERO.sub}
        </p>

        <div className="k-rise k-d3 mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#request"
            className="k-cta-solid flex items-center gap-3 bg-[#1F3FB8] px-8 py-4 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-[#16309A]"
          >
            <span>{CTA.request}</span>
            <span aria-hidden="true" className="k-arrow text-lg leading-none">
              &#8592;
            </span>
          </a>
          <a
            href={whatsappLink("السلام عليكم، أبي أستفسر عن استيراد سيارة من كوريا")}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#F2F2EF]/60 bg-[#111619]/40 px-8 py-4 text-[15px] font-medium text-[#F2F2EF] backdrop-blur-sm transition-colors duration-300 hover:bg-[#111619]/70"
          >
            {CTA.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
