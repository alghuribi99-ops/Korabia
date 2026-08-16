import { PROCESS } from "../../site/content";

export function Process() {
  return (
    <section id="process" className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="max-w-[46ch]">
          <h2 className="k-display text-3xl md:text-5xl">{PROCESS.title}</h2>
          <p className="k-body mt-5 text-[#6E767C]">{PROCESS.intro}</p>
        </div>

        <div className="relative mt-14 md:mt-20">
          <span
            aria-hidden="true"
            className="k-grow absolute bottom-6 right-[7px] top-2 hidden w-px bg-[#111619]/25 md:block"
          />

          <ol className="flex flex-col gap-14 md:gap-16">
            {PROCESS.steps.map((step, i) => (
              <li
                key={step.n}
                className="relative grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-[auto_minmax(0,20ch)_minmax(0,52ch)] md:items-start md:pr-14"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-2 hidden h-[15px] w-[15px] border border-[#111619] md:block"
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
        <span className="k-display text-xl md:text-3xl">{PROCESS.closing}</span>
        <span aria-hidden="true" className="k-arrow text-2xl leading-none">
          &#8592;
        </span>
      </a>
    </section>
  );
}
