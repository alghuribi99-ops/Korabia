import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import brandCss from "../site/brand.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
import { getDict } from "../site/content";
import { LANGS, LANG_META, type Lang } from "../site/types";

declare const __HF_DESIGN_INSPECTOR__: boolean;

/** The URL owns the locale, so the document shell can be resolved from it. */
export function langFromPath(pathname: string): Lang {
  const first = pathname.split("/").filter(Boolean)[0];
  const hit = LANGS.find((code) => code !== "ar" && code === first);
  return hit ?? "ar";
}

function buildHead() {
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: brandCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Sans+KR:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/assets/favicon.png" },
    ],
  };
}

function useLang(): Lang {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return langFromPath(pathname);
}

function NotFoundComponent() {
  const t = getDict("en");
  return (
    <div data-lang="en" dir="ltr" className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="k-mono text-sm text-[#6E767C]">{t.notFound.code}</span>
      <h1 className="k-display text-3xl">{t.notFound.title}</h1>
      <p className="text-[#6E767C]">{t.notFound.body}</p>
      <a
        href="/"
        className="mt-2 bg-[#1F3FB8] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#16309A]"
      >
        {t.notFound.home}
      </a>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const t = getDict("en");
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div data-lang="en" dir="ltr" className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="k-display text-3xl">{t.errorPage.title}</h1>
      <p className="text-[#6E767C]">{t.errorPage.body}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="bg-[#1F3FB8] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#16309A]"
        >
          {t.errorPage.retry}
        </button>
        <a href="/" className="border border-[#111619] px-7 py-3 text-sm font-medium">
          {t.errorPage.home}
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const lang = useLang();
  const meta = LANG_META[lang];

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      data-korabia=""
      data-lang={lang}
      style={{ colorScheme: "light" }}
    >
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
