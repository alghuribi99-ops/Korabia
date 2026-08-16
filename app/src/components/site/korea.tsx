import { KOREA_INTRO, KOREA_SERVICES, KOREA_TITLE } from "../../site/content";

export function Korea() {
  return (
    <section id="korea" className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 text-center md:px-10">
        <h2 className="k-display mx-auto max-w-[22ch] text-3xl md:text-5xl">{KOREA_TITLE}</h2>
        <p className="k-body mx-auto mt-5 text-center text-[#6E767C]">{KOREA_INTRO}</p>
      </div>

      <div className="mx-auto mt-12 max-w-[1400px] px-5 md:mt-16 md:px-10">
        <div className="grid grid-cols-1 gap-px border border-[#DCDCD6] bg-[#DCDCD6] sm:grid-cols-2 lg:grid-cols-4">
          {KOREA_SERVICES.map((s) => (
            <article key={s.title} className="flex flex-col bg-[#F2F2EF] p-7 md:p-8">
              <img
                src={s.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <h3 className="k-display mt-6 text-lg">{s.title}</h3>
              <span className="k-latin mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6E767C]">
                {s.en}
              </span>
              <p className="mt-3 text-[14px] leading-relaxed text-[#6E767C]">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
