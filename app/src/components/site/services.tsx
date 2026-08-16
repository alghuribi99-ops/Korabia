import { SERVICES } from "../../site/content";

export function Services() {
  return (
    <section id="services" className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="k-mono mb-4 text-xs uppercase tracking-[0.22em] text-[#1F3FB8]">Services</p>
        <h2 className="k-display max-w-[18ch] text-3xl md:text-5xl">أربع خدمات، وكل واحدة لها مسؤول</h2>
      </div>

      <div className="mt-12 flex flex-col gap-px bg-[#DCDCD6] md:mt-16 md:h-[560px] md:flex-row">
        {SERVICES.map((service, i) => (
          <article
            key={service.id}
            className={
              "k-slice relative flex min-h-[280px] flex-1 overflow-hidden bg-[#111619] md:min-h-0 md:hover:grow-[2.4] " +
              (i === 0 ? "md:grow-[1.9]" : "md:grow")
            }
          >
            <img
              src={service.image}
              alt={service.alt}
              loading="lazy"
              className="k-slice-img absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#111619] via-[#111619]/55 to-transparent"
            />
            <div className="relative flex w-full flex-col justify-end p-7 md:p-8">
              <span className="k-latin text-[11px] uppercase tracking-[0.2em] text-[#F2F2EF]/55">
                {service.en}
              </span>
              <h3 className="k-display mt-2 text-2xl text-[#F2F2EF] md:text-[1.7rem]">{service.title}</h3>
              <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-[#F2F2EF]/75">{service.body}</p>
              <a
                href="#request"
                className="k-underline relative mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#F2F2EF]"
              >
                <span>اطلب سيارتك</span>
                <span aria-hidden="true">&#8249;</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
