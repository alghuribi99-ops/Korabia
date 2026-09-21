import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  adminListOffers,
  createOffer,
  offerAction,
  type Offer,
} from "../../lib/api/offers.functions";
import { parseListing } from "../../lib/parse-listing";
import { COLORS, FUELS, OFFER_TEXT, TRANSMISSIONS } from "../../site/offer-labels";

const AR = OFFER_TEXT.ar;
const MAX_PHOTOS = 6;

const EMPTY = {
  make: "",
  model: "",
  year: "",
  mileage: "",
  price: "",
  transmission: "auto",
  fuel: "petrol",
  color: "white",
  note: "",
};

/** Phone photos are large; downscale in the browser so uploads stay quick. */
async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/jpeg", 0.82),
  );
}

function remaining(offer: Offer) {
  return new Date(offer.expiresAt).getTime() - Date.now();
}

function statusOf(offer: Offer) {
  if (offer.hidden) return { label: "مخفي", tone: "text-[#6E767C]" };
  const left = remaining(offer);
  if (left <= 0) return { label: "منتهي", tone: "text-[#6E767C]" };
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  return { label: "نشط، باقي " + h + " ساعة و" + m + " دقيقة", tone: "text-[#1F3FB8]" };
}

const field =
  "w-full border-0 border-b border-[#DCDCD6] bg-transparent py-2.5 text-[15px] outline-none focus:border-[#1F3FB8]";

export function OffersPanel({ password }: { password: string }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [values, setValues] = useState(EMPTY);
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState<"idle" | "loading" | "saving" | "uploading">("idle");
  const [paste, setPaste] = useState("");
  const [pasteNote, setPasteNote] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setBusy("loading");
    const res = await adminListOffers({ data: { password } });
    setOffers(res.offers);
    setBusy("idle");
  }, [password]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onPick(e: { target: HTMLInputElement }) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - photos.length);
    if (files.length === 0) return;
    setBusy("uploading");
    setError("");
    const added: string[] = [];
    for (const file of files) {
      try {
        const blob = await downscale(file);
        const form = new FormData();
        form.append("password", password);
        form.append("file", new File([blob], "photo.jpg", { type: "image/jpeg" }));
        const res = await fetch("/api/offer-image", { method: "POST", body: form });
        const json = (await res.json()) as { ok: boolean; key?: string };
        if (json.ok && json.key) added.push(json.key);
        else setError("تعذر رفع إحدى الصور.");
      } catch {
        setError("تعذر قراءة إحدى الصور.");
      }
    }
    setPhotos((prev) => [...prev, ...added].slice(0, MAX_PHOTOS));
    e.target.value = "";
    setBusy("idle");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy("saving");
    setError("");
    const res = await createOffer({
      data: {
        password,
        make: values.make,
        model: values.model,
        year: values.year ? Number(values.year) : null,
        mileage: values.mileage ? Number(values.mileage) : null,
        price: values.price,
        transmission: values.transmission as (typeof TRANSMISSIONS)[number],
        fuel: values.fuel as (typeof FUELS)[number],
        color: values.color as (typeof COLORS)[number],
        note: values.note,
        images: photos,
      },
    });
    if (res.ok) {
      setValues(EMPTY);
      setPhotos([]);
      await refresh();
    } else {
      setError("ما انحفظ العرض. جرب مرة ثانية.");
      setBusy("idle");
    }
  }

  async function act(id: number, action: "extend" | "expire" | "hide" | "show" | "delete") {
    if (action === "delete" && !window.confirm("حذف العرض نهائياً مع صوره؟")) return;
    setBusy("loading");
    await offerAction({ data: { password, id, action } });
    await refresh();
  }

  function applyPaste() {
    const found = parseListing(paste);
    const filled = Object.keys(found).length;
    if (filled === 0) {
      setPasteNote("ما قدرت أقرأ بيانات من النص. عبّي الحقول يدوياً.");
      return;
    }
    setValues((prev) => ({
      ...prev,
      make: found.make ?? prev.make,
      model: found.model ?? prev.model,
      year: found.year ?? prev.year,
      mileage: found.mileage ?? prev.mileage,
      price: found.price ?? prev.price,
      transmission: found.transmission ?? prev.transmission,
      fuel: found.fuel ?? prev.fuel,
      color: found.color ?? prev.color,
    }));
    setPasteNote("عبّيت " + filled + " حقول. راجعها قبل النشر.");
  }

  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setValues((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <section className="border border-[#DCDCD6] bg-white p-6 md:p-8">
        <h2 className="k-display text-lg">أضف سيارة للعرض</h2>
        <p className="mt-2 text-[13px] text-[#6E767C]">
          العرض ينشر فوراً ويختفي تلقائياً بعد ٤٨ ساعة.
        </p>

        <div className="mt-6 border border-[#DCDCD6] bg-[#F2F2EF] p-4">
          <label className="block">
            <span className="text-[13px] text-[#6E767C]">الصق رسالة الواتساب هنا</span>
            <textarea
              rows={3}
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="هيونداي سوناتا 2021 ممشى 38000 كم اوتوماتيك بنزين ابيض السعر 14500$"
              className="mt-2 w-full resize-none border border-[#DCDCD6] bg-white p-3 text-[14px] outline-none focus:border-[#1F3FB8]"
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={applyPaste}
              disabled={!paste.trim()}
              className="bg-[#111619] px-4 py-2 text-[13px] font-medium text-[#F2F2EF] transition-colors hover:bg-[#1F3FB8] disabled:opacity-40"
            >
              اقرأ وعبّي الحقول
            </button>
            {paste ? (
              <button
                type="button"
                onClick={() => {
                  setPaste("");
                  setPasteNote("");
                }}
                className="text-[13px] text-[#6E767C] underline"
              >
                امسح
              </button>
            ) : null}
            {pasteNote ? <span className="text-[12px] text-[#6E767C]">{pasteNote}</span> : null}
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <label className="sm:col-span-1">
            <span className="text-[13px] text-[#6E767C]">الماركة</span>
            <input required className={field} value={values.make} onChange={set("make")} placeholder="Hyundai" />
          </label>
          <label className="sm:col-span-1">
            <span className="text-[13px] text-[#6E767C]">الموديل</span>
            <input required className={field} value={values.model} onChange={set("model")} placeholder="Sonata" />
          </label>
          <label className="sm:col-span-1">
            <span className="text-[13px] text-[#6E767C]">سنة الصنع</span>
            <input inputMode="numeric" dir="ltr" className={field} value={values.year} onChange={set("year")} placeholder="2021" />
          </label>
          <label className="sm:col-span-1">
            <span className="text-[13px] text-[#6E767C]">الممشى بالكيلو</span>
            <input inputMode="numeric" dir="ltr" className={field} value={values.mileage} onChange={set("mileage")} placeholder="45000" />
          </label>
          <label className="sm:col-span-2">
            <span className="text-[13px] text-[#6E767C]">
              السعر <span className="text-[#6E767C]/70">(اتركه فاضي ليظهر «تواصل للسعر»)</span>
            </span>
            <input className={field} value={values.price} onChange={set("price")} placeholder="12,500 USD" />
          </label>
          <label className="sm:col-span-1">
            <span className="text-[13px] text-[#6E767C]">ناقل الحركة</span>
            <select className={field} value={values.transmission} onChange={set("transmission")}>
              {TRANSMISSIONS.map((k) => (
                <option key={k} value={k}>{AR.transmission[k]}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-1">
            <span className="text-[13px] text-[#6E767C]">الوقود</span>
            <select className={field} value={values.fuel} onChange={set("fuel")}>
              {FUELS.map((k) => (
                <option key={k} value={k}>{AR.fuel[k]}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="text-[13px] text-[#6E767C]">اللون</span>
            <select className={field} value={values.color} onChange={set("color")}>
              {COLORS.map((k) => (
                <option key={k} value={k}>{AR.color[k]}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="text-[13px] text-[#6E767C]">ملاحظة قصيرة (اختياري)</span>
            <input className={field} value={values.note} onChange={set("note")} placeholder="فحص كامل، بدون حوادث" />
          </label>

          <div className="sm:col-span-2">
            <span className="text-[13px] text-[#6E767C]">الصور (حتى ٦)</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {photos.map((key) => (
                <div key={key} className="relative">
                  <img src={"/img?k=" + encodeURIComponent(key)} alt="" className="h-24 w-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((p) => p.filter((x) => x !== key))}
                    aria-label="حذف الصورة"
                    className="absolute -top-2 -end-2 h-6 w-6 bg-[#111619] text-[13px] leading-none text-[#F2F2EF]"
                  >
                    &#215;
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS ? (
                <label className="flex h-24 w-24 cursor-pointer items-center justify-center border border-dashed border-[#DCDCD6] text-[28px] text-[#6E767C]">
                  +
                  <input type="file" accept="image/*" multiple className="hidden" onChange={onPick} />
                </label>
              ) : null}
            </div>
          </div>

          {error ? <p className="text-[13px] text-[#B3261E] sm:col-span-2">{error}</p> : null}

          <button
            type="submit"
            disabled={busy === "saving" || busy === "uploading"}
            className="mt-2 bg-[#1F3FB8] py-4 sm:col-span-2 text-[15px] font-medium text-white transition-colors hover:bg-[#16309A] disabled:opacity-60"
          >
            {busy === "uploading" ? "جاري رفع الصور" : busy === "saving" ? "جاري النشر" : "انشر العرض الآن"}
          </button>
        </form>
      </section>

      <section className="border border-[#DCDCD6] bg-white">
        <div className="flex items-baseline justify-between gap-4 border-b border-[#DCDCD6] px-6 py-5">
          <h2 className="k-display text-lg">العروض</h2>
          <span className="k-mono text-[13px] text-[#6E767C]">{offers.length}</span>
        </div>

        {offers.length === 0 ? (
          <p className="px-6 py-10 text-[14px] text-[#6E767C]">ما فيه عروض بعد.</p>
        ) : (
          <ul>
            {offers.map((offer) => {
              const st = statusOf(offer);
              const live = !offer.hidden && remaining(offer) > 0;
              return (
                <li key={offer.id} className="flex flex-wrap items-start gap-4 border-b border-[#DCDCD6] p-5 last:border-b-0">
                  {offer.images[0] ? (
                    <img
                      src={"/img?k=" + encodeURIComponent(offer.images[0])}
                      alt=""
                      className="h-16 w-20 shrink-0 object-cover"
                    />
                  ) : (
                    <div className="h-16 w-20 shrink-0 bg-[#F2F2EF]" />
                  )}
                  <div className="min-w-[10rem] flex-1">
                    <p className="text-[15px] font-medium">
                      {offer.make} {offer.model} {offer.year ?? ""}
                    </p>
                    <p className={"mt-1 text-[12px] " + st.tone}>{st.label}</p>
                    <p className="k-mono mt-1 text-[12px] text-[#6E767C]">
                      {offer.price || "تواصل للسعر"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => void act(offer.id, "extend")} className="border border-[#DCDCD6] px-3 py-1.5 text-[12px] hover:border-[#111619]">
                      جدد ٤٨ ساعة
                    </button>
                    {live ? (
                      <button type="button" onClick={() => void act(offer.id, "expire")} className="border border-[#DCDCD6] px-3 py-1.5 text-[12px] hover:border-[#111619]">
                        أنهِ الآن
                      </button>
                    ) : null}
                    <button type="button" onClick={() => void act(offer.id, offer.hidden ? "show" : "hide")} className="border border-[#DCDCD6] px-3 py-1.5 text-[12px] hover:border-[#111619]">
                      {offer.hidden ? "أظهر" : "أخفِ"}
                    </button>
                    <button type="button" onClick={() => void act(offer.id, "delete")} className="px-2 py-1.5 text-[12px] text-[#B3261E] underline">
                      حذف
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
