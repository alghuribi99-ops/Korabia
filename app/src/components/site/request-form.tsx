import { useState, type FormEvent, type ReactNode } from "react";

import { submitCarRequest } from "../../lib/api/requests.functions";
import { getDict } from "../../site/content";
import { whatsappLink, type Lang } from "../../site/types";

type Status = "idle" | "sending" | "success" | "error";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] text-[#F2F2EF]/70">
        {label}
        {hint ? <span className="k-latin ms-2 text-[#F2F2EF]/40">({hint})</span> : null}
      </span>
      {children}
    </label>
  );
}

export function RequestForm({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const empty = {
    name: "",
    phone: "",
    country: "",
    category: t.vehicles.items[0].title,
    model: "",
    budget: "",
    notes: "",
  };
  const [values, setValues] = useState(empty);
  const [status, setStatus] = useState<Status>("idle");

  const set =
    (key: keyof typeof empty) =>
    (event: { target: { value: string } }) =>
      setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const s = t.request.waSummary;
  const summary = [
    s.heading,
    s.name + ": " + values.name,
    s.category + ": " + values.category,
    s.wanted + ": " + values.model,
    values.country ? s.destination + ": " + values.country : "",
    values.budget ? s.budget + ": " + values.budget : "",
  ]
    .filter(Boolean)
    .join("\n");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const result = await submitCarRequest({ data: { ...values, lang } });
      setStatus(result.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="request" className="bg-[#111619] py-20 text-[#F2F2EF] md:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 md:grid-cols-[minmax(0,30ch)_minmax(0,1fr)] md:gap-20 md:px-10">
        <div>
          <p className="k-mono mb-4 text-xs uppercase tracking-[0.22em] text-[#7D95E8]">{t.request.eyebrow}</p>
          <h2 className="k-display text-3xl md:text-4xl">{t.request.title}</h2>
          <p className="k-body mt-5 text-[15px] text-[#F2F2EF]/65">{t.request.sub}</p>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-start justify-center border border-[#F2F2EF]/20 p-8 md:p-12">
            <h3 className="k-display text-2xl md:text-3xl">{t.request.successTitle}</h3>
            <p className="k-body mt-4 text-[15px] text-[#F2F2EF]/70">{t.request.successBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink(summary)}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#1F3FB8] bg-[#1F3FB8] px-9 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-transparent hover:text-[#7D95E8]"
              >
                {t.cta.whatsapp}
              </a>
              <button
                type="button"
                onClick={() => {
                  setValues(empty);
                  setStatus("idle");
                }}
                className="border border-[#F2F2EF]/40 px-8 py-4 text-[15px] font-medium transition-colors hover:border-[#F2F2EF]"
              >
                {t.request.another}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
            <Field label={t.request.fields.name}>
              <input required className="k-field" value={values.name} onChange={set("name")} autoComplete="name" />
            </Field>

            <Field label={t.request.fields.phone}>
              <input
                required
                inputMode="tel"
                dir="ltr"
                placeholder={t.request.placeholders.phone}
                className="k-field text-start"
                value={values.phone}
                onChange={set("phone")}
                autoComplete="tel"
              />
            </Field>

            <Field label={t.request.fields.country}>
              <input
                required
                placeholder={t.request.placeholders.country}
                className="k-field"
                value={values.country}
                onChange={set("country")}
              />
            </Field>

            <Field label={t.request.fields.category}>
              <select className="k-field" value={values.category} onChange={set("category")}>
                {t.vehicles.items.map((v) => (
                  <option key={v.title} value={v.title}>
                    {v.title}
                  </option>
                ))}
                <option value={t.request.other}>{t.request.other}</option>
              </select>
            </Field>

            <Field label={t.request.fields.model}>
              <input
                required
                placeholder={t.request.placeholders.model}
                className="k-field"
                value={values.model}
                onChange={set("model")}
              />
            </Field>

            <Field label={t.request.fields.budget} hint={t.request.optional}>
              <input
                placeholder={t.request.placeholders.budget}
                className="k-field"
                value={values.budget}
                onChange={set("budget")}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label={t.request.fields.notes} hint={t.request.optional}>
                <textarea
                  rows={3}
                  placeholder={t.request.placeholders.notes}
                  className="k-field resize-none"
                  value={values.notes}
                  onChange={set("notes")}
                />
              </Field>
            </div>

            {status === "error" ? (
              <p className="text-[14px] text-[#FFB4A8] sm:col-span-2">{t.request.errorBody}</p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-[#1F3FB8] px-10 py-4 text-[15px] font-medium text-white transition-all hover:bg-[#16309A] active:translate-y-px disabled:opacity-60"
              >
                {status === "sending" ? t.request.sending : t.request.submit}
              </button>
              <a
                href={whatsappLink(t.request.waGeneral)}
                target="_blank"
                rel="noopener noreferrer"
                className="k-underline relative text-[15px] text-[#F2F2EF]/80"
              >
                {t.cta.whatsapp}
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
