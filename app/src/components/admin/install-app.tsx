import { useEffect, useState } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Turns the panel into a home screen app. Chrome hands us a real prompt;
 * iOS Safari never does, so there it explains the two taps instead.
 */
export function InstallApp() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(true);
  const [ios, setIos] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    const ua = window.navigator.userAgent;
    setIos(/iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPrompt);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin" }).catch(() => {
        /* installability is a bonus, never a blocker */
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;
  if (!prompt && !ios) return null;

  return (
    <div className="border border-[#111619] bg-[#111619] px-5 py-4 text-[#F2F2EF]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3">
        <p className="text-[14px]">
          ثبّت الأداة على جوالك وافتحها بضغطة واحدة، بدون متصفح.
        </p>
        {prompt ? (
          <button
            type="button"
            onClick={() => {
              void prompt.prompt();
              void prompt.userChoice.finally(() => setPrompt(null));
            }}
            className="bg-[#1F3FB8] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#16309A]"
          >
            ثبّت الآن
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="border border-[#F2F2EF]/50 px-5 py-2.5 text-[14px] font-medium transition-colors hover:border-[#F2F2EF]"
          >
            كيف أثبتها؟
          </button>
        )}
      </div>
      {showHelp ? (
        <ol className="mx-auto mt-4 max-w-[1200px] list-inside list-decimal space-y-1.5 text-[13px] text-[#F2F2EF]/70">
          <li>اضغط زر المشاركة في أسفل شاشة سفاري</li>
          <li>انزل واختر «إضافة إلى الشاشة الرئيسية»</li>
          <li>اضغط «إضافة»، وراح تلقى أيقونة كورابيا بين تطبيقاتك</li>
        </ol>
      ) : null}
    </div>
  );
}
