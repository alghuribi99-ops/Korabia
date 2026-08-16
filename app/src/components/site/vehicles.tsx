import { getDict } from "../../site/content";
import { VEHICLE_IDS, VEHICLE_IMAGES, type Lang } from "../../site/types";

export function Vehicles({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <section id="vehicles" className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 text-center md:px-10">
        <h2 className="k-display mx-auto max-w-[26ch] text-3xl md:text-5xl">{t.vehicles.title}</h2>
        <p className="k-body mx-auto mt-5 text-center text-[#6E767C]">{t.vehicles.intro}</p>
      </div>

      <div className="k-rail-scroll mt-12 overflow-x-auto md:mt-16">
        <ul className="flex w-max gap-px bg-[#DCDCD6] pe-5 md:pe-10">
          {t.vehicles.items.map((v, i) => (
            <li key={VEHICLE_IDS[i]} className="k-card w-[74vw] bg-[#F2F2EF] sm:w-[52vw] md:w-[340px]">
              <a href="#request" className="block h-full">
                <div className="overflow-hidden bg-white">
                  <img
                    src={VEHICLE_IMAGES[i]}
                    alt={v.alt}
                    loading="lazy"
                    className="k-card-img aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="px-5 pb-6 pt-5">
                  <span className="k-latin text-[11px] uppercase tracking-[0.2em] text-[#6E767C]">{v.en}</span>
                  <h3 className="k-display mt-1.5 text-xl">{v.title}</h3>
                  <p className="k-mono mt-2 text-xs leading-relaxed text-[#6E767C]">{v.note}</p>
                  <span aria-hidden="true" className="k-rule mt-5" />
                  <span className="mt-3 block text-sm font-medium text-[#1F3FB8]">{t.cta.request}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
