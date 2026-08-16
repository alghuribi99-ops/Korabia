import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import brandCss from "../site/brand.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
import appMetaJson from "../app-meta.json";

declare const __HF_DESIGN_INSPECTOR__: boolean;

const DEFAULT_TITLE = "كورابيا | استيراد وتصدير السيارات من كوريا والصين";
const DEFAULT_DESCRIPTION =
  "نبحث لك عن السيارة المناسبة في المزادات والمعارض الكورية، نفحصها فحصاً موثقاً، ونشحنها من ميناء إنشون إلى مينائك بدون وسطاء.";

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];

function toOwnAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some(
      (zone) => u.hostname === zone || u.hostname.endsWith("." + zone),
    );
    if (isAppHost) return u.pathname + u.search;
    return value;
  } catch {
    return value;
  }
}

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? DEFAULT_TITLE;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
  const ogImage = toOwnAssetUrl(meta.og_image_url) ?? "/assets/og-cover.webp";
  const favicon = toOwnAssetUrl(meta.favicon_url) ?? "/assets/favicon.png";
  const ogVideo = toOwnAssetUrl(meta.og_video_url);

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "theme-color", content: "#f2f2ef" },
      {
        name: "keywords",
        content:
          "استيراد سيارات من كوريا, تصدير سيارات كوريا, مزاد السيارات الكوري, شحن سيارات من كوريا, سيارات مستعملة كورية, استيراد سيارات من الصين, korabia, korea car export",
      },
      { property: "og:site_name", content: "كورابيا Korabia" },
      { property: "og:locale", content: "ar_SA" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@korabia_service" },
      { name: "twitter:image", content: ogImage },
      ...(ogVideo ? [{ property: "og:video", content: ogVideo }] : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: brandCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: favicon },
      { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  };
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="k-mono text-sm text-[#6E767C]">404</span>
      <h1 className="k-display text-3xl">الصفحة غير موجودة</h1>
      <p className="text-[#6E767C]">الرابط الذي فتحته غير صحيح أو تم نقله.</p>
      <a
        href="/"
        className="mt-2 bg-[#1F3FB8] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#16309A]"
      >
        العودة للرئيسية
      </a>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="k-display text-3xl">الصفحة ما فتحت</h1>
      <p className="text-[#6E767C]">صار خطأ عندنا. جرب تحديث الصفحة.</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="bg-[#1F3FB8] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#16309A]"
        >
          حاول مرة ثانية
        </button>
        <a href="/" className="border border-[#111619] px-7 py-3 text-sm font-medium">
          الرئيسية
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-korabia="" style={{ colorScheme: "light" }}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }

    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(
          error instanceof Error ? error : new Error("Failed to load design inspector"),
          { boundary: "higgsfield_design_inspector_import" },
        );
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
