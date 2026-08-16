import { VEHICLES } from "../../site/content";

export function Vehicles() {
  return (
    <section id="vehicles" className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 text-center md:px-10">
        <h2 className="k-display mx-auto max-w-[20ch] text-3xl md:text-5xl">
          نستورد الفئة التي تناسب استخدامك
        </h2>
        <p className="k-body mx-auto mt-5 text-center text-[#6E767C]">
          التوفر يتغير أسبوعياً حسب المزادات والمعارض. اكتب لنا الفئة والموديل ونرجع لك بخيارات
          حقيقية متاحة الآن.
        </p>
      </div>

      <div className="k-rail-scroll mt-12 overflow-x-auto md:mt-16">
        <ul className="flex w-max gap-px bg-[#DCDCD6] pr-5 md:pr-10">
          {VEHICLES.map((v) => (
            <li key={v.id} className="k-card w-[74vw] bg-[#F2F2EF] sm:w-[52vw] md:w-[340px]">
              <a href="#request" className="block h-full">
                <div className="overflow-hidden bg-white">
                  <img
                    src={v.image}
                    alt={v.alt}
                    loading="lazy"
                    className="k-card-img aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="px-5 pb-6 pt-5">
                  <span className="k-latin text-[11px] uppercase tracking-[0.2em] text-[#6E767C]">
                    {v.en}
                  </span>
                  <h3 className="k-display mt-1.5 text-xl">{v.title}</h3>
                  <p className="k-mono mt-2 text-xs leading-relaxed text-[#6E767C]">{v.note}</p>
                  <span aria-hidden="true" className="k-rule mt-5" />
                  <span className="mt-3 block text-sm font-medium text-[#1F3FB8]">اطلب سيارتك</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
