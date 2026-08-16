import { StructuredData } from "../components/StructuredData";
import { Faq } from "../components/site/faq";
import { MobileActionBar, SiteFooter } from "../components/site/footer";
import { Hero } from "../components/site/hero";
import { Korea } from "../components/site/korea";
import { SiteNav } from "../components/site/nav";
import { Process } from "../components/site/process";
import { RequestForm } from "../components/site/request-form";
import { Services } from "../components/site/services";
import { Vehicles } from "../components/site/vehicles";
import { Why } from "../components/site/why";
import { getDict } from "./content";
import { CONTACT, LANG_META, LEGAL, SITE_ORIGIN, type Lang } from "./types";

function jsonLd(lang: Lang) {
  const t = getDict(lang);
  const meta = LANG_META[lang];
  const url = SITE_ORIGIN + meta.path;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoDealer",
        "@id": SITE_ORIGIN + "/#org",
        name: "Korabia",
        legalName: LEGAL.tradeName,
        url,
        taxID: LEGAL.regNumber,
        identifier: {
          "@type": "PropertyValue",
          name: "KR Business Registration Number",
          value: LEGAL.regNumber,
        },
        foundingDate: LEGAL.since,
        founder: { "@type": "Person", name: LEGAL.representative },
        description: t.meta.description,
        email: CONTACT.email,
        telephone: "+" + CONTACT.whatsappDigits,
        image: SITE_ORIGIN + "/assets/og-cover.webp",
        areaServed: ["SA", "AE", "KW", "QA", "BH", "OM", "JO", "IQ", "RU", "KZ", "ES", "KR"],
        address: {
          "@type": "PostalAddress",
          streetAddress: "17-7 Munhak-gil 109beon-gil, Michuhol-gu",
          addressLocality: "Incheon",
          addressRegion: "Incheon",
          addressCountry: "KR",
        },
        sameAs: CONTACT.social.map((s) => s.href),
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "10:00",
          closes: "20:00",
        },
        makesOffer: t.services.items.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.body },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": url + "#faq",
        inLanguage: meta.htmlLang,
        mainEntity: t.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  });
}

export function SitePage({ lang }: { lang: Lang }) {
  const meta = LANG_META[lang];

  return (
    <div data-lang={lang} lang={meta.htmlLang} dir={meta.dir}>
      <StructuredData json={jsonLd(lang)} />
      <SiteNav lang={lang} />
      <main>
        <Hero lang={lang} />
        <Services lang={lang} />
        <Process lang={lang} />
        <Vehicles lang={lang} />
        <Why lang={lang} />
        <Korea lang={lang} />
        <RequestForm lang={lang} />
        <Faq lang={lang} />
      </main>
      <SiteFooter lang={lang} />
      <MobileActionBar lang={lang} />
      <div aria-hidden="true" className="h-14 lg:hidden" />
    </div>
  );
}
