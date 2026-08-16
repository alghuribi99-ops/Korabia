import { createFileRoute } from "@tanstack/react-router";

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
import { CONTACT, FAQ, SERVICES } from "../site/content";

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AutoDealer",
      "@id": "https://korabia.co/#org",
      name: "كورابيا",
      alternateName: "Korabia",
      description:
        "تصدير واستيراد السيارات من كوريا الجنوبية والصين إلى الشرق الأوسط، مع الفحص والتقييم والشحن والتخليص.",
      email: CONTACT.email,
      telephone: "+" + CONTACT.whatsappDigits,
      areaServed: ["SA", "AE", "KW", "QA", "BH", "OM", "JO", "IQ"],
      address: { "@type": "PostalAddress", addressLocality: "Incheon", addressCountry: "KR" },
      sameAs: CONTACT.social.map((s) => s.href),
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "20:00",
      },
      makesOffer: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.body },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": "https://korabia.co/#faq",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
});

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <>
      <StructuredData json={JSON_LD} />
      <SiteNav />
      <main>
        <Hero />
        <Services />
        <Process />
        <Vehicles />
        <Why />
        <Korea />
        <RequestForm />
        <Faq />
      </main>
      <SiteFooter />
      <MobileActionBar />
      <div aria-hidden="true" className="h-14 lg:hidden" />
    </>
  );
}
