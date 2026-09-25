import { useCallback, useEffect, useState, type TouchEvent } from "react";

import { OFFER_TEXT } from "../../site/offer-labels";
import type { Lang } from "../../site/types";

/** Below this a drag is a tap that wandered, not a swipe. */
const SWIPE_MIN = 40;

function src(key: string) {
  return "/img?k=" + encodeURIComponent(key);
}

/**
 * A card has room for one photo, so the rest live here. The viewer is laid out
 * left to right in every language: a photo strip is a physical sequence, and a
 * mirrored one fights the swipe the hand already knows.
 */
export function PhotoViewer({
  images,
  title,
  lang,
  start,
  onClose,
}: {
  images: string[];
  title: string;
  lang: Lang;
  start: number;
  onClose: () => void;
}) {
  const o = OFFER_TEXT[lang];
  const count = images.length;
  const [index, setIndex] = useState(() => Math.min(Math.max(start, 0), count - 1));
  const [touchX, setTouchX] = useState<number | null>(null);

  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + count) % count),
    [count],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [go, onClose]);

  // The next photo is the one most likely to be asked for, so fetch it early.
  useEffect(() => {
    const next = images[(index + 1) % count];
    if (!next) return;
    const preload = new window.Image();
    preload.src = src(next);
  }, [index, images, count]);

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    setTouchX(event.changedTouches[0]?.clientX ?? null);
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchX === null) return;
    const moved = (event.changedTouches[0]?.clientX ?? touchX) - touchX;
    setTouchX(null);
    if (Math.abs(moved) < SWIPE_MIN) return;
    go(moved < 0 ? 1 : -1);
  }

  const arrow =
    "absolute top-1/2 hidden -translate-y-1/2 items-center justify-center bg-[#111619]/70 px-4 py-6 text-2xl leading-none text-[#F2F2EF] transition-colors hover:bg-[#1F3FB8] sm:flex";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      dir="ltr"
      onClick={onClose}
      className="fixed inset-0 z-[120] flex flex-col bg-[#111619]/97"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-between px-5 py-4 text-[#F2F2EF]"
      >
        <span className="k-mono text-[13px] tabular-nums">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={o.close}
          className="k-mono px-3 py-1.5 text-[13px] transition-colors hover:text-[#8FA4F0]"
        >
          {o.close} ✕
        </button>
      </div>

      <div
        onClick={(event) => event.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative flex flex-1 items-center justify-center px-3"
      >
        <img
          src={src(images[index] ?? "")}
          alt={title + " — " + (index + 1)}
          className="max-h-[calc(100vh-12rem)] w-auto max-w-full object-contain"
        />
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={o.previous}
              className={arrow + " left-0"}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={o.next}
              className={arrow + " right-0"}
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div
          onClick={(event) => event.stopPropagation()}
          className="k-rail-scroll overflow-x-auto px-5 py-4"
        >
          <div className="mx-auto flex w-max gap-2">
            {images.map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={o.photos + " " + (i + 1)}
                aria-current={i === index}
                className={
                  "h-14 w-20 shrink-0 overflow-hidden border-2 transition-opacity " +
                  (i === index
                    ? "border-[#F2F2EF]"
                    : "border-transparent opacity-50 hover:opacity-90")
                }
              >
                <img src={src(key)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
