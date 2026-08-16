import { WHY } from "../../site/content";

export function Why() {
  return (
    <section className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-12 px-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-16 md:px-10">
        <div>
          <p className="k-mono mb-4 text-xs uppercase tracking-[0.22em] text-[#1F3FB8]">{WHY.eyebrow}</p>
          <h2 className="k-display max-w-[16ch] text-3xl md:text-5xl">{WHY.title}</h2>
          <p className="k-body mt-6 text-[#6E767C]">{WHY.body}</p>
        </div>

        <div className="relative -mr-5 md:-mr-10 md:mt-10">
          <img
            src="/assets/macro.webp"
            alt="لقطة قريبة لحافة مصباح أمامي وطلاء سيارة أثناء الفحص"
            loading="lazy"
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] px-5 md:mt-20 md:px-10">
        <div className="grid grid-cols-1 border-t border-[#DCDCD6] md:grid-cols-3">
          {WHY.pillars.map((p, i) => (
            <div
              key={p.title}
              className={
                "border-b border-[#DCDCD6] py-8 md:border-b-0 md:py-10 " +
                (i === 0 ? "md:pl-8" : "md:border-r md:border-[#DCDCD6] md:px-8")
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
