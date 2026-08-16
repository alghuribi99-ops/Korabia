import { useEffect, useState } from "react";

import { CTA, NAV } from "../../site/content";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <img src="/assets/mark.webp" alt="" aria-hidden="true" width={28} height={28} className={className} />
  );
}

export function SiteNav() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 " +
        (compact
          ? "border-[#DCDCD6] bg-[#F2F2EF]/95 backdrop-blur"
          : "border-transparent bg-transparent")
      }
    >
      <div
        className={
          "mx-auto flex max-w-[1400px] items-center justify-between px-5 transition-all duration-500 md:px-10 " +
          (compact ? "h-[64px]" : "h-[76px]")
        }
      >
        <a href="#top" className="flex items-center gap-3">
          <BrandMark />
          <span
            className={
              "k-latin text-lg font-semibold tracking-[0.14em] transition-colors duration-500 " +
              (compact ? "text-[#111619]" : "text-[#F2F2EF]")
            }
          >
            KORABIA
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={
                "k-underline relative text-[15px] transition-colors duration-500 " +
                (compact ? "text-[#111619] hover:text-[#1F3FB8]" : "text-[#F2F2EF]/90 hover:text-white")
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#request"
          className={
            "border px-5 py-2.5 text-sm font-medium transition-colors duration-300 " +
            (compact
              ? "border-[#111619] text-[#111619] hover:bg-[#111619] hover:text-[#F2F2EF]"
              : "border-[#F2F2EF]/70 text-[#F2F2EF] hover:bg-[#F2F2EF] hover:text-[#111619]")
          }
        >
          {CTA.request}
        </a>
      </div>
    </header>
  );
}
