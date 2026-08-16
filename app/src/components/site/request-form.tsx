import { useState, type FormEvent, type ReactNode } from "react";

import { submitCarRequest } from "../../lib/api/requests.functions";
import { CTA, REQUEST, VEHICLES, whatsappLink } from "../../site/content";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY = {
  name: "",
  phone: "",
  country: "",
  category: VEHICLES[0].title,
  model: "",
  budget: "",
  notes: "",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] text-[#F2F2EF]/70">
        {label}
        {hint ? <span className="k-latin mr-2 text-[#F2F2EF]/40">({hint})</span> : null}
      </span>
      {children}
    </label>
  );
}

export function RequestForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");

  const set =
    (key: keyof typeof EMPTY) =>
    (event: { target: { value: string } }) =>
      setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const summary = [
    "طلب سيارة من الموقع",
    "الاسم: " + values.name,
    "الفئة: " + values.category,
    "المطلوب: " + values.model,
    values.country ? "الوجهة: " + values.country : "",
    values.budget ? "الميزانية: " + values.budget : "",
  ]
    .filter(Boolean)
    .join("\n");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const result = await submitCarRequest({ data: values });
      setStatus(result.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="request" className="bg-[#111619] py-20 text-[#F2F2EF] md:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 md:grid-cols-[minmax(0,26ch)_minmax(0,1fr)] md:gap-20 md:px-10">
        <div>
          <p className="k-mono mb-4 text-xs uppercase tracking-[0.22em] text-[#7D95E8]">
            {REQUEST.eyebrow}
          </p>
          <h2 className="k-display text-3xl md:text-4xl">{REQUEST.title}</h2>
          <p className="k-body mt-5 text-[15px] text-[#F2F2EF]/65">{REQUEST.sub}</p>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-start justify-center border border-[#F2F2EF]/20 p-8 md:p-12">
            <h3 className="k-display text-2xl md:text-3xl">{REQUEST.successTitle}</h3>
            <p className="k-body mt-4 text-[15px] text-[#F2F2EF]/70">{REQUEST.successBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink(summary)}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#1F3FB8] bg-[#1F3FB8] px-9 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-transparent hover:text-[#7D95E8]"
              >
                {CTA.whatsapp}
              </a>
              <button
                type="button"
                onClick={() => {
                  setValues(EMPTY);
                  setStatus("idle");
                }}
                className="border border-[#F2F2EF]/40 px-8 py-4 text-[15px] font-medium transition-colors hover:border-[#F2F2EF]"
              >
                {REQUEST.another}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
            <Field label={REQUEST.fields.name}>
              <input required className="k-field" value={values.name} onChange={set("name")} autoComplete="name" />
            </Field>

            <Field label={REQUEST.fields.phone}>
              <input
                required
                inputMode="tel"
                dir="ltr"
                placeholder={REQUEST.placeholders.phone}
                className="k-field text-right"
                value={values.phone}
                onChange={set("phone")}
                autoComplete="tel"
              />
            </Field>

            <Field label={REQUEST.fields.country}>
              <input
                required
                placeholder={REQUEST.placeholders.country}
                className="k-field"
                value={values.country}
                onChange={set("country")}
              />
            </Field>

            <Field label={REQUEST.fields.category}>
              <select className="k-field" value={values.category} onChange={set("category")}>
                {VEHICLES.map((v) => (
                  <option key={v.id} value={v.title}>
                    {v.title}
                  </option>
                ))}
                <option value="غير ذلك">غير ذلك</option>
              </select>
            </Field>

            <Field label={REQUEST.fields.model}>
              <input
                required
                placeholder={REQUEST.placeholders.model}
                className="k-field"
                value={values.model}
                onChange={set("model")}
              />
            </Field>

            <Field label={REQUEST.fields.budget} hint={REQUEST.optional}>
              <input
                placeholder={REQUEST.placeholders.budget}
                className="k-field"
                value={values.budget}
                onChange={set("budget")}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label={REQUEST.fields.notes} hint={REQUEST.optional}>
                <textarea
                  rows={3}
                  placeholder={REQUEST.placeholders.notes}
                  className="k-field resize-none"
                  value={values.notes}
                  onChange={set("notes")}
                />
              </Field>
            </div>

            {status === "error" ? (
              <p className="text-[14px] text-[#FFB4A8] sm:col-span-2">{REQUEST.errorBody}</p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-[#1F3FB8] px-10 py-4 text-[15px] font-medium text-white transition-all hover:bg-[#16309A] active:translate-y-px disabled:opacity-60"
              >
                {status === "sending" ? REQUEST.sending : REQUEST.submit}
              </button>
              <a
                href={whatsappLink("السلام عليكم، أبي أستفسر عن استيراد سيارة من كوريا")}
                target="_blank"
                rel="noopener noreferrer"
                className="k-underline relative text-[15px] text-[#F2F2EF]/80"
              >
                {CTA.whatsapp}
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
