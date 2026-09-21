/**
 * Chrome fires beforeinstallprompt once, shortly after load. The panel's own
 * banner mounts only after sign in, long past that moment, so the event has to
 * be caught at app start and parked here for whoever asks later.
 */
export type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __korabiaInstall?: InstallPrompt | null;
    __korabiaInstallBound?: boolean;
  }
}

export const INSTALL_READY = "korabia:install-ready";

export function armInstallCapture() {
  if (typeof window === "undefined" || window.__korabiaInstallBound) return;
  window.__korabiaInstallBound = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    window.__korabiaInstall = event as InstallPrompt;
    window.dispatchEvent(new Event(INSTALL_READY));
  });

  window.addEventListener("appinstalled", () => {
    window.__korabiaInstall = null;
    window.dispatchEvent(new Event(INSTALL_READY));
  });

  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin" }).catch(() => {
      /* installability is a bonus, never a blocker */
    });
  }
}
