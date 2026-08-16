import { getDict } from "../../site/content";
import { LEGAL, type Lang } from "../../site/types";

/**
 * The registration certificate rendered as a document: label above value,
 * hairline rows, mono for the identifiers. Sits in the footer, which is where
 * a registered trader is expected to publish it.
 */
export function Registration({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const showKoAddress = lang !== "ko";

  const rows: { label: string; value: string; sub?: string; mono?: boolean }[] = [
    { label: t.legal.labels.regNumber, value: LEGAL.regNumber, mono: true },
    { label: t.legal.labels.tradeName, value: LEGAL.tradeName },
    { label: t.legal.labels.representative, value: LEGAL.representative },
    { label: t.legal.labels.since, value: LEGAL.since, mono: true },
    {
      label: t.legal.labels.address,
      value: t.legal.address,
      sub: showKoAddress ? LEGAL.addressKo : undefined,
    },
    { label: t.legal.labels.scope, value: t.legal.scope },
    { label: t.legal.labels.authority, value: t.legal.authority },
  ];

  return (
    <section
      aria-label={t.legal.heading}
      className="mt-16 border-t border-[#F2F2EF]/15 pt-12 md:mt-20"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,30ch)_minmax(0,1fr)] md:gap-16">
        <div>
          <h2 className="k-display text-xl text-[#F2F2EF] md:text-2xl">{t.legal.heading}</h2>
          <p className="k-body mt-4 text-[14px] text-[#F2F2EF]/60">{t.legal.note}</p>
        </div>

        <dl className="grid grid-cols-1 border-t border-[#F2F2EF]/15 sm:grid-cols-2">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={
                "border-b border-[#F2F2EF]/15 py-5 " +
                (i % 2 === 0 ? "sm:pe-8" : "sm:border-s sm:border-[#F2F2EF]/15 sm:ps-8")
              }
            >
              <dt className="text-[12px] uppercase tracking-[0.14em] text-[#F2F2EF]/40">
                {row.label}
              </dt>
              <dd
                className={
                  "mt-2 text-[15px] leading-relaxed text-[#F2F2EF]/85 " + (row.mono ? "k-mono" : "")
                }
                dir={row.mono ? "ltr" : undefined}
                style={row.mono ? { textAlign: "start" } : undefined}
              >
                {row.value}
              </dd>
              {row.sub ? (
                <dd lang="ko" className="mt-1 text-[13px] text-[#F2F2EF]/45">
                  {row.sub}
                </dd>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
