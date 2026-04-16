import Link from "next/link";
import type { CSSProperties } from "react";
import Hero from "./_components/hero/hero";
import TrustBy from "./_components/trustby/trustby";
import About from "./_components/about/about";
import Contact from "./_components/contact/contact";

const stats = [
  { value: "1K+", label: "devs" },
  { value: "500+", label: "wins" },
  { value: "30+", label: "co.s" },
];

const ctaLinks = [
  { label: "our hackathons", href: "/h", color: "280 80% 52%" },
  { label: "our events", href: "/e?filter=um", color: "217 78% 58%" },
  { label: "our team", href: "/t", color: "156 82% 71%" },
];

export default function Home() {
  return (
    <div className="home-page-root flex flex-col items-center w-full">
      <div className="w-full border-b border-gray-200 bg-neutral-100/80">
        <div className="flex items-center justify-center gap-6 sm:gap-10 px-4 py-2.5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group flex cursor-default items-center gap-2 rounded-md px-2 py-1 font-deck-pixel text-[10px] sm:text-xs transition-all duration-200 ease-out hover:scale-[1.06] hover:bg-neutral-200/90 hover:shadow-sm active:scale-[0.98]"
            >
              <span className="text-neutral-900 transition-colors group-hover:text-neutral-950">
                {s.value}
              </span>
              <span className="text-neutral-500 transition-colors group-hover:text-neutral-700">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Hero />

      <section className="w-full flex flex-wrap items-center justify-center gap-4 px-6 py-12 border-b border-gray-200">
        {ctaLinks.map((cta) => (
          <Link
            key={cta.label}
            href={cta.href}
            className="home-cta-link font-deck-pixel relative px-5 py-2.5 text-[8px] sm:text-[10px]"
            style={{ "--cta": cta.color } as CSSProperties}
          >
            {cta.label}
          </Link>
        ))}
      </section>

      <TrustBy />
      <About />
      <Contact />
    </div>
  );
}
