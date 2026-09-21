import { useEffect, useState } from "react";

import { INSTALL_READY, type InstallPrompt } from "../../lib/install-bridge";

const DISMISS_KEY = "korabia:install-dismissed";

type Platform = "ios" | "android" | "desktop";

const STEPS: Record<Platform, string[]> = {
  ios: [
    "اضغط زر المشاركة في شريط سفاري",
    "انزل واختر «إضافة إلى الشاشة الرئيسية»",
    "اضغط «إضافة»، وبتلقى أيقونة كورابيا بين تطبيقاتك",
  ],
  android: [
    "اضغط النقاط الثلاث في أعلى المتصفح",
    "اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»",
    "أكّد، وبتلقى أيقونة كورابيا بين تطبيقاتك",
  ],
  desktop: [
    "اضغط أيقونة التثبيت في يمين شريط العنوان",
    "أو افتح قائمة المتصفح واختر «تثبيت»",
    "بيفتح لك كنافذة مستقلة بدون شريط متصفح",
  ],
};

function detect(): Platform {
  const ua = navigator.userAgent;
  const touchMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iPad|iPhone|iPod/.test(ua) || touchMac) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

/**
 * Always offers a way in. A real prompt when the browser grants one, and the
 * platform's own two taps when it does not, so the banner is never a dead end.
 */
export function InstallApp() {
  const [ready, setReady] = useState(false);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      /* storage blocked, keep offering */
    }

    setPlatform(detect());
    setPrompt(window.__korabiaInstall ?? null);
    setReady(!standalone && !dismissed);

    const sync = () => {
      setPrompt(window.__korabiaInstall ?? null);
      if (window.__korabiaInstall === null) setReady(false);
    };
    window.addEventListener(INSTALL_READY, sync);
    return () => window.removeEventListener(INSTALL_READY, sync);
  }, []);

  if (!ready) return null;

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* storage blocked */
    }
    setReady(false);
  }

  return (
    <div className="bg-[#111619] px-5 py-4 text-[#F2F2EF]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3">
        <p className="flex-1 text-[14px]">ثبّت الأداة على جوالك وافتحها بضغطة واحدة، بدون متصفح.</p>

        {prompt ? (
          <button
            type="button"
            onClick={() => {
              void prompt.prompt();
              void prompt.userChoice.finally(() => {
                window.__korabiaInstall = null;
                setPrompt(null);
                setReady(false);
              });
            }}
            className="bg-[#1F3FB8] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#16309A]"
          >
            ثبّت الآن
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="border border-[#F2F2EF]/50 px-5 py-2.5 text-[14px] font-medium transition-colors hover:border-[#F2F2EF]"
          >
            {open ? "إخفاء الخطوات" : "كيف أثبتها؟"}
          </button>
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label="إخفاء"
          className="px-2 text-xl leading-none text-[#F2F2EF]/50 transition-colors hover:text-[#F2F2EF]"
        >
          &#215;
        </button>
      </div>

      {open ? (
        <ol className="mx-auto mt-4 max-w-[1200px] list-inside list-decimal space-y-1.5 text-[13px] text-[#F2F2EF]/70">
          {STEPS[platform].map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
