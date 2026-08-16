import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { BarList, DayColumns, StatTile } from "../components/admin/charts";
import { loadAdminData, type AdminData } from "../lib/api/admin.functions";
import { LANG_META, type Lang } from "../site/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم كورابيا" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

const KEY = "korabia:admin";
const RANGES = [7, 30, 90] as const;

const LANG_LABEL: Record<string, string> = {
  ar: "العربية",
  en: "English",
  ru: "Русский",
  es: "Español",
  ko: "한국어",
  unknown: "غير معروف",
};

const DEVICE_LABEL: Record<string, string> = {
  mobile: "جوال",
  desktop: "كمبيوتر",
  tablet: "تابلت",
  unknown: "غير معروف",
};

const REGION = new Intl.DisplayNames(["ar"], { type: "region" });

function countryLabel(code: string) {
  if (code === "unknown" || code.length !== 2) return "غير معروف";
  try {
    return (REGION.of(code) ?? code) + " (" + code + ")";
  } catch {
    return code;
  }
}

function csvCell(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function Admin() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  const [status, setStatus] = useState<"idle" | "loading" | "bad" | "storage">("idle");

  const fetchData = useCallback(async (secret: string, days: (typeof RANGES)[number]) => {
    setStatus("loading");
    try {
      const res = await loadAdminData({ data: { password: secret, range: days } });
      if (res.ok) {
        setData(res);
        setStatus("idle");
        try {
          window.sessionStorage.setItem(KEY, secret);
        } catch {
          /* storage blocked */
        }
      } else {
        setData(null);
        setStatus(res.reason === "auth" ? "bad" : "storage");
      }
    } catch {
      setStatus("bad");
    }
  }, []);

  useEffect(() => {
    let saved = "";
    try {
      saved = window.sessionStorage.getItem(KEY) ?? "";
    } catch {
      /* storage blocked */
    }
    if (saved) {
      setPassword(saved);
      void fetchData(saved, 30);
    }
  }, [fetchData]);

  function exportCsv() {
    if (!data) return;
    const head = ["id", "التاريخ", "الاسم", "الواتساب", "الوجهة", "الفئة", "المطلوب", "الميزانية", "ملاحظات", "اللغة"];
    const body = data.leads.map((l) =>
      [l.id, l.created_at, l.name, l.phone, l.country, l.category, l.model, l.budget, l.notes, l.lang]
        .map(csvCell)
        .join(","),
    );
    const blob = new Blob(["﻿" + [head.join(","), ...body].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "korabia-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!data) {
    return (
      <div data-lang="ar" dir="rtl" className="flex min-h-dvh items-center justify-center px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void fetchData(password, range);
          }}
          className="w-full max-w-sm border border-[#DCDCD6] bg-white p-8"
        >
          <h1 className="k-display text-2xl">لوحة تحكم كورابيا</h1>
          <p className="mt-2 text-[14px] text-[#6E767C]">أدخل كلمة المرور للاطلاع على الطلبات والزوار.</p>
          <label className="mt-7 block">
            <span className="text-[13px] text-[#6E767C]">كلمة المرور</span>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-0 border-b border-[#DCDCD6] bg-transparent py-2.5 text-[15px] outline-none focus:border-[#1F3FB8]"
            />
          </label>
          {status === "bad" ? (
            <p className="mt-4 text-[13px] text-[#B3261E]">كلمة المرور غير صحيحة.</p>
          ) : null}
          {status === "storage" ? (
            <p className="mt-4 text-[13px] text-[#B3261E]">قاعدة البيانات غير متاحة الآن.</p>
          ) : null}
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-7 w-full bg-[#1F3FB8] py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#16309A] disabled:opacity-60"
          >
            {status === "loading" ? "جاري الدخول" : "دخول"}
          </button>
        </form>
      </div>
    );
  }

  const nf = new Intl.NumberFormat("ar-EG");

  return (
    <div data-lang="ar" dir="rtl" className="min-h-dvh pb-20">
      <header className="border-b border-[#DCDCD6] bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <h1 className="k-display text-xl">لوحة تحكم كورابيا</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex border border-[#DCDCD6]">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRange(r);
                    void fetchData(password, r);
                  }}
                  className={
                    "px-3.5 py-2 text-[13px] transition-colors " +
                    (r === data.range ? "bg-[#111619] text-[#F2F2EF]" : "text-[#6E767C] hover:text-[#111619]")
                  }
                >
                  {r} يوم
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => void fetchData(password, data.range)}
              className="border border-[#DCDCD6] px-3.5 py-2 text-[13px] text-[#111619] transition-colors hover:border-[#111619]"
            >
              تحديث
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="bg-[#1F3FB8] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#16309A]"
            >
              تصدير Excel
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  window.sessionStorage.removeItem(KEY);
                } catch {
                  /* storage blocked */
                }
                setData(null);
                setPassword("");
              }}
              className="px-2 text-[13px] text-[#6E767C] underline"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 md:px-8">
        <section className="mt-8 grid grid-cols-1 border border-[#DCDCD6] bg-white sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="طلبات جديدة" value={nf.format(data.kpi.leadsRange)} sub={"خلال " + data.range + " يوم"} />
          <StatTile label="زيارات" value={nf.format(data.kpi.viewsRange)} sub={"خلال " + data.range + " يوم"} />
          <StatTile
            label="معدل التحويل"
            value={data.kpi.conversion.toFixed(1) + "%"}
            sub="زيارة تنتهي بطلب"
          />
          <StatTile label="إجمالي الطلبات" value={nf.format(data.kpi.leadsTotal)} sub="منذ إطلاق الموقع" />
        </section>

        <section className="mt-6 border border-[#DCDCD6] bg-white p-6 md:p-8">
          <DayColumns data={data.viewsByDay} label="الزيارات يومياً" />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-px border border-[#DCDCD6] bg-[#DCDCD6] md:grid-cols-2 xl:grid-cols-4">
          <div className="bg-white p-6">
            <BarList
              title="الزيارات حسب اللغة"
              rows={data.byLang}
              renderKey={(k) => LANG_LABEL[k] ?? k}
              empty="لا توجد زيارات بعد."
            />
          </div>
          <div className="bg-white p-6">
            <BarList title="الزيارات حسب الدولة" rows={data.byCountry} renderKey={countryLabel} empty="لا توجد زيارات بعد." />
          </div>
          <div className="bg-white p-6">
            <BarList
              title="نوع الجهاز"
              rows={data.byDevice}
              renderKey={(k) => DEVICE_LABEL[k] ?? k}
              empty="لا توجد زيارات بعد."
            />
          </div>
          <div className="bg-white p-6">
            <BarList title="مصدر الزيارة" rows={data.byReferrer} empty="كل الزيارات مباشرة حتى الآن." />
          </div>
        </section>

        <section className="mt-6 border border-[#DCDCD6] bg-white">
          <div className="flex items-baseline justify-between gap-4 border-b border-[#DCDCD6] px-6 py-5">
            <h2 className="k-display text-lg">الطلبات</h2>
            <span className="k-mono text-[13px] text-[#6E767C]">{nf.format(data.leads.length)}</span>
          </div>

          {data.leads.length === 0 ? (
            <p className="px-6 py-10 text-[14px] text-[#6E767C]">لم يصل أي طلب بعد.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-[14px]">
                <thead>
                  <tr className="border-b border-[#DCDCD6] text-[12px] text-[#6E767C]">
                    <th className="px-4 py-3 text-start font-normal">التاريخ</th>
                    <th className="px-4 py-3 text-start font-normal">الاسم</th>
                    <th className="px-4 py-3 text-start font-normal">الواتساب</th>
                    <th className="px-4 py-3 text-start font-normal">الوجهة</th>
                    <th className="px-4 py-3 text-start font-normal">الفئة</th>
                    <th className="px-4 py-3 text-start font-normal">المطلوب</th>
                    <th className="px-4 py-3 text-start font-normal">الميزانية</th>
                    <th className="px-4 py-3 text-start font-normal">اللغة</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map((l) => (
                    <tr key={l.id} className="border-b border-[#DCDCD6] align-top last:border-b-0">
                      <td className="k-mono whitespace-nowrap px-4 py-4 text-[12px] text-[#6E767C]" dir="ltr">
                        {l.created_at}
                      </td>
                      <td className="px-4 py-4 font-medium">{l.name}</td>
                      <td className="px-4 py-4">
                        <a
                          href={"https://wa.me/" + l.phone.replace(/[^0-9]/g, "")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="k-mono text-[#1F3FB8] underline"
                          dir="ltr"
                        >
                          {l.phone}
                        </a>
                      </td>
                      <td className="px-4 py-4 text-[#6E767C]">{l.country}</td>
                      <td className="px-4 py-4 text-[#6E767C]">{l.category}</td>
                      <td className="px-4 py-4">
                        {l.model}
                        {l.notes ? <span className="mt-1 block text-[12px] text-[#6E767C]">{l.notes}</span> : null}
                      </td>
                      <td className="px-4 py-4 text-[#6E767C]">{l.budget || "—".replace("—", "-")}</td>
                      <td className="px-4 py-4 text-[12px] text-[#6E767C]">
                        {l.lang ? (LANG_META[l.lang as Lang]?.label ?? l.lang) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
