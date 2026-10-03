import { useCallback, useEffect, useRef, useState } from "react";

import type { Offer } from "../../lib/api/offers.functions";
import { captionOf, drawPostCard, loadFonts, titleOf, type PostSize } from "../../lib/post-card";

const SIZES: { key: PostSize; label: string; hint: string }[] = [
  { key: "square", label: "مربع", hint: "انستغرام · فيسبوك" },
  { key: "story", label: "ستوري", hint: "سناب · ستوري · تيك توك" },
];

type Card = { url: string; blob: Blob };

function fileOf(blob: Blob, offer: Offer, size: PostSize) {
  const name = "korabia-" + offer.id + "-" + size + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}

export function PostStudio({ offer, onClose }: { offer: Offer; onClose: () => void }) {
  const [size, setSize] = useState<PostSize>("square");
  const [cards, setCards] = useState<Partial<Record<PostSize, Card>>>({});
  const [caption, setCaption] = useState(() => captionOf(offer));
  const [note, setNote] = useState("");
  const [failed, setFailed] = useState(false);
  const made = useRef<Partial<Record<PostSize, Card>>>({});

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        await loadFonts();
        for (const s of ["square", "story"] as PostSize[]) {
          const blob = await drawPostCard(offer, s);
          if (!alive) return;
          const card = { url: URL.createObjectURL(blob), blob };
          made.current[s] = card;
          setCards((prev) => ({ ...prev, [s]: card }));
        }
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
      for (const card of Object.values(made.current)) if (card) URL.revokeObjectURL(card.url);
    };
  }, [offer]);

  // Escape closes, and the page behind must not scroll while the sheet is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const current = cards[size];

  const flash = useCallback((msg: string) => {
    setNote(msg);
    window.setTimeout(() => setNote(""), 2200);
  }, []);

  const share = useCallback(async () => {
    if (!current) return;
    const file = fileOf(current.blob, offer, size);
    try {
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], text: caption });
        return;
      }
      await navigator.share?.({ text: caption });
    } catch {
      /* The user dismissing the share sheet is not an error worth reporting. */
    }
  }, [current, offer, size, caption]);

  const download = useCallback(() => {
    if (!current) return;
    const a = document.createElement("a");
    a.href = current.url;
    a.download = "korabia-" + offer.id + "-" + size + ".jpg";
    a.click();
  }, [current, offer, size]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(caption);
      flash("تم نسخ النص");
    } catch {
      flash("ما قدرت أنسخ — اختر النص وانسخه بإيدك");
    }
  }, [caption, flash]);

  const canShareFiles =
    typeof navigator !== "undefined" &&
    typeof (navigator as Navigator & { canShare?: unknown }).canShare === "function";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#111619]/70 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[94vh] w-full max-w-[520px] overflow-y-auto bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-[#DCDCD6] bg-white px-5 py-4">
          <div className="min-w-0">
            <h2 className="k-display truncate text-[17px]">منشور للسوشال</h2>
            <p className="truncate text-[12px] text-[#6E767C]">{titleOf(offer)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 border border-[#DCDCD6] px-3 py-1.5 text-[12px] hover:border-[#111619]"
          >
            إغلاق
          </button>
        </div>

        <div className="flex gap-2 px-5 pt-5">
          {SIZES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSize(s.key)}
              className={
                "flex-1 border px-3 py-2.5 text-[13px] " +
                (size === s.key
                  ? "border-[#1F3FB8] bg-[#1F3FB8] text-white"
                  : "border-[#DCDCD6] hover:border-[#111619]")
              }
            >
              <span className="block font-medium">{s.label}</span>
              <span className={"block text-[11px] " + (size === s.key ? "text-white/75" : "text-[#6E767C]")}>
                {s.hint}
              </span>
            </button>
          ))}
        </div>

        <div className="px-5 pt-5">
          <div className="flex items-center justify-center bg-[#F2F2EF] p-4">
            {failed ? (
              <p className="py-16 text-[13px] text-[#B3261E]">ما قدرت أجهّز الصورة. جرّب مرة ثانية.</p>
            ) : current ? (
              <img
                src={current.url}
                alt=""
                className={size === "square" ? "w-[260px]" : "w-[180px]"}
              />
            ) : (
              <p className="py-16 text-[13px] text-[#6E767C]">جاري تجهيز الصورة…</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-5 pt-4">
          {canShareFiles ? (
            <button
              type="button"
              onClick={() => void share()}
              disabled={!current}
              className="k-cta-solid flex-1 bg-[#1F3FB8] px-5 py-3 text-[14px] font-medium text-white disabled:opacity-40"
            >
              مشاركة
            </button>
          ) : null}
          <button
            type="button"
            onClick={download}
            disabled={!current}
            className="flex-1 border border-[#DCDCD6] px-5 py-3 text-[14px] hover:border-[#111619] disabled:opacity-40"
          >
            تنزيل الصورة
          </button>
        </div>

        <div className="px-5 pb-6 pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="post-caption" className="text-[13px] font-medium">
              نص المنشور
            </label>
            <button type="button" onClick={() => void copy()} className="text-[12px] text-[#1F3FB8] underline">
              نسخ
            </button>
          </div>
          <textarea
            id="post-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={10}
            className="mt-2 w-full resize-y border border-[#DCDCD6] bg-[#F2F2EF] p-3 text-[13px] leading-[1.9] outline-none focus:border-[#1F3FB8]"
          />
          <p className="mt-2 text-[12px] text-[#6E767C]">
            {canShareFiles
              ? "زر المشاركة يفتح تطبيقات جوالك — اختر انستغرام أو سناب أو تيك توك. النص ينسخ معه في أغلب التطبيقات، وإذا ما انسخ اضغط «نسخ» والصقه."
              : "نزّل الصورة وانسخ النص، وانشرهم من تطبيق الجوال."}
          </p>
          {note ? <p className="mt-2 text-[12px] text-[#1F3FB8]">{note}</p> : null}
        </div>
      </div>
    </div>
  );
}
