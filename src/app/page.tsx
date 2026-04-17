import Link from "next/link";
import type { CSSProperties } from "react";
import HeroSection from "./_components/hero/hero-section";
import TrustBy from "./_components/trustby/trustby";
import About from "./_components/about/about";
import Contact from "./_components/contact/contact";

const ctaLinks = [
  { label: "our hackathons", href: "/h", color: "280 80% 52%" },
  { label: "our events", href: "/e?filter=um", color: "217 78% 58%" },
  { label: "our team", href: "/t", color: "156 82% 71%" },
];

export default function Home() {
  return (
    <div className="home-page-root flex flex-col items-center w-full">
      <HeroSection />

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
