import { CONTACT, CTA, FOOTER, NAV, whatsappLink } from "../../site/content";
import { BrandMark } from "./nav";

export function SiteFooter() {
  return (
    <footer className="bg-[#111619] pb-14 pt-16 text-[#F2F2EF] md:pb-16 md:pt-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-12 border-t border-[#F2F2EF]/15 pt-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <BrandMark className="brightness-0 invert" />
              <span className="k-latin text-lg font-semibold tracking-[0.14em]">KORABIA</span>
            </div>
            <p className="k-body mt-5 text-[15px] text-[#F2F2EF]/65">{FOOTER.tagline}</p>
            <a
              href={whatsappLink("السلام عليكم، أبي أستفسر عن خدمات كورابيا")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block border border-[#F2F2EF]/40 px-7 py-3.5 text-[15px] font-medium transition-all hover:border-[#F2F2EF] hover:shadow-[inset_0_0_0_1px_#F2F2EF]"
            >
              {CTA.whatsapp}
            </a>
          </div>

          <div>
            <h3 className="k-latin text-sm text-[#F2F2EF]/45">Contact</h3>
            <ul className="mt-5 space-y-2.5 text-[15px] text-[#F2F2EF]/75">
              <li dir="ltr" className="text-right">{CONTACT.whatsappDisplay}</li>
              <li>
                <a href={"mailto:" + CONTACT.email} className="k-underline relative">
                  {CONTACT.email}
                </a>
              </li>
              <li>{CONTACT.city}</li>
              <li className="pt-2 text-[13px] text-[#F2F2EF]/50">{CONTACT.hoursKr}</li>
              <li className="text-[13px] text-[#F2F2EF]/50">{CONTACT.hoursSa}</li>
            </ul>
          </div>

          <div>
            <h3 className="k-latin text-sm text-[#F2F2EF]/45">Sections</h3>
            <ul className="mt-5 space-y-2.5 text-[15px] text-[#F2F2EF]/75">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="k-underline relative">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#F2F2EF]/55">
              {CONTACT.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="k-underline relative">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="k-mono mt-14 text-xs text-[#F2F2EF]/40">
          {new Date().getFullYear()} {FOOTER.rights}
        </p>
      </div>
    </footer>
  );
}

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-[#111619]/15 bg-[#DCDCD6] lg:hidden">
      <a
        href={whatsappLink("السلام عليكم، أبي أستفسر عن استيراد سيارة من كوريا")}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#F2F2EF] py-4 text-center text-sm font-medium text-[#111619]"
      >
        {CTA.whatsapp}
      </a>
      <a href="#request" className="bg-[#1F3FB8] py-4 text-center text-sm font-medium text-white">
        {CTA.request}
      </a>
    </div>
  );
}
