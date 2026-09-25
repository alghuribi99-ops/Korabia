import { useEffect, useState } from "react";

import type { Offer, OfferFeed } from "../../lib/api/offers.functions";
import { getDict } from "../../site/content";
import {
  OFFER_TEXT,
  type Color,
  type Fuel,
  type Transmission,
} from "../../site/offer-labels";
import { LANG_META, whatsappLink, type Lang } from "../../site/types";
import { PhotoViewer } from "./photo-viewer";

const WINDOW_MS = 48 * 60 * 60 * 1000;

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, "0");
}

/**
 * The clock is the point of the section, so it ticks. The first paint is
 * computed from the same expiry the server used; the second differs by
 * whatever the request took, which is why hydration warnings are suppressed
 * on the readout alone.
 */
function Countdown({ offer, label }: { offer: Offer; label: string }) {
  const target = new Date(offer.expiresAt).getTime();
  const [left, setLeft] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);

  const elapsed = Math.min(1, Math.max(0, 1 - left / WINDOW_MS));
  const h = left / 3600000;
  const m = (left % 3600000) / 60000;
  const s = (left % 60000) / 1000;

  return (
    <div className="mt-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] text-[#6E767C]">{label}</span>
        <span
          suppressHydrationWarning
          dir="ltr"
          className="k-mono text-[15px] font-medium tabular-nums text-[#111619]"
        >
          {pad(h)}:{pad(m)}:{pad(s)}
        </span>
      </div>
      <div className="mt-2 h-[4px] w-full bg-[#E4E4DF]">
        <div
          suppressHydrationWarning
          className="k-bar h-full bg-[#1F3FB8]"
          style={{ width: Math.max(2, (1 - elapsed) * 100) + "%" }}
        />
      </div>
    </div>
  );
}

function Specs({ offer, lang }: { offer: Offer; lang: Lang }) {
  const o = OFFER_TEXT[lang];
  const nf = new Intl.NumberFormat("en-US");

  const items = [
    offer.year ? { k: o.specYear, v: String(offer.year) } : null,
    offer.mileage !== null ? { k: o.specMileage, v: nf.format(offer.mileage) + " " + o.km } : null,
    offer.transmission ? { k: o.specTransmission, v: o.transmission[offer.transmission as Transmission] } : null,
    offer.fuel ? { k: o.specFuel, v: o.fuel[offer.fuel as Fuel] } : null,
    offer.color ? { k: o.specColor, v: o.color[offer.color as Color] } : null,
  ].filter(Boolean) as { k: string; v: string }[];

  if (items.length === 0) return null;

  return (
    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
      {items.map((it) => (
        <div key={it.k}>
          <dt className="text-[11px] text-[#6E767C]">{it.k}</dt>
          <dd className="mt-0.5 text-[14px] text-[#111619]">{it.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function OfferCard({ offer, lang }: { offer: Offer; lang: Lang }) {
  const o = OFFER_TEXT[lang];
  const [viewing, setViewing] = useState(false);
  const title = offer.make + " " + offer.model;
  const message = [
    o.waIntro,
    title + (offer.year ? " " + offer.year : ""),
    "#" + offer.id,
  ].join("\n");

  return (
    <article className="flex flex-col bg-white">
      {offer.images[0] ? (
        <button
          type="button"
          onClick={() => setViewing(true)}
          aria-label={offer.images.length + " " + o.photos}
          className="relative block w-full overflow-hidden bg-[#F2F2EF] text-start"
        >
          <img
            src={"/img?k=" + encodeURIComponent(offer.images[0])}
            alt={title}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
          <span className="k-mono absolute bottom-3 end-3 bg-[#111619]/85 px-2.5 py-1 text-[11px] text-[#F2F2EF]">
            {offer.images.length} {o.photos}
          </span>
        </button>
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#F2F2EF]">
          <span className="k-mono text-[12px] text-[#6E767C]">KORABIA</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="k-display text-xl">{title}</h3>
        <p className="mt-2 text-[15px] font-medium text-[#1F3FB8]">
          {offer.price ? offer.price : o.askPrice}
        </p>

        <Specs offer={offer} lang={lang} />

        {offer.note ? (
          <p className="mt-4 text-[13px] leading-relaxed text-[#6E767C]">{offer.note}</p>
        ) : null}

        <div className="mt-auto">
          <Countdown offer={offer} label={o.endsIn} />
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block w-full bg-[#111619] py-3.5 text-center text-[14px] font-medium text-[#F2F2EF] transition-colors hover:bg-[#1F3FB8]"
          >
            {o.inquire}
          </a>
        </div>
      </div>

      {viewing ? (
        <PhotoViewer
          images={offer.images}
          title={title}
          lang={lang}
          start={0}
          onClose={() => setViewing(false)}
        />
      ) : null}
    </article>
  );
}

function PastCard({ offer, lang }: { offer: Offer; lang: Lang }) {
  const o = OFFER_TEXT[lang];
  const [viewing, setViewing] = useState(false);
  const title = offer.make + " " + offer.model;
  return (
    <li className="w-[210px] shrink-0 bg-white">
      <div className="relative bg-[#F2F2EF]">
        {offer.images[0] ? (
          <button
            type="button"
            onClick={() => setViewing(true)}
            aria-label={offer.images.length + " " + o.photos}
            className="block w-full"
          >
            <img
              src={"/img?k=" + encodeURIComponent(offer.images[0])}
              alt={title}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover grayscale"
            />
          </button>
        ) : (
          <div className="aspect-[4/3] w-full" />
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#111619]/85 py-1.5 text-center text-[11px] text-[#F2F2EF]">
          {o.expired}
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-[14px] text-[#111619]">{title}</p>
        {offer.year ? <p className="k-mono mt-1 text-[12px] text-[#6E767C]">{offer.year}</p> : null}
      </div>

      {viewing ? (
        <PhotoViewer
          images={offer.images}
          title={title}
          lang={lang}
          start={0}
          onClose={() => setViewing(false)}
        />
      ) : null}
    </li>
  );
}

export function Offers({ lang, feed }: { lang: Lang; feed: OfferFeed }) {
  const o = OFFER_TEXT[lang];
  const t = getDict(lang);
  const rtl = LANG_META[lang].dir === "rtl";

  return (
    <section id="offers" className="bg-[#F2F2EF] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[46ch]">
            <h2 className="k-display text-3xl md:text-5xl">{o.title}</h2>
            <p className="k-body mt-5 text-[#6E767C]">{o.intro}</p>
          </div>
          {feed.live.length > 0 ? (
            <span className="k-mono text-[13px] text-[#6E767C]">
              {feed.live.length}
            </span>
          ) : null}
        </div>

        {feed.live.length === 0 ? (
          <div className="mt-12 border-t border-[#DCDCD6] pt-10">
            <p className="k-body text-[#6E767C]">{o.empty}</p>
            <a
              href="#request"
              className="k-cta-solid mt-6 inline-flex items-center gap-3 bg-[#1F3FB8] px-8 py-4 text-[15px] font-medium text-white transition-colors hover:bg-[#16309A]"
            >
              <span>{t.cta.request}</span>
              <span aria-hidden="true" className="k-arrow text-lg leading-none">
                {rtl ? "←" : "→"}
              </span>
            </a>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-px border border-[#DCDCD6] bg-[#DCDCD6] sm:grid-cols-2 xl:grid-cols-3">
            {feed.live.map((offer) => (
              <OfferCard key={offer.id} offer={offer} lang={lang} />
            ))}
          </div>
        )}

        {feed.past.length > 0 ? (
          <div className="mt-16">
            <h3 className="text-[15px] text-[#6E767C]">{o.archiveTitle}</h3>
            <div className="k-rail-scroll mt-5 overflow-x-auto">
              <ul className="flex gap-px bg-[#DCDCD6]">
                {feed.past.map((offer) => (
                  <PastCard key={offer.id} offer={offer} lang={lang} />
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
