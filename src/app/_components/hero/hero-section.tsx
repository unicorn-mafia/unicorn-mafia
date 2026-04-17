"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Hero from "./hero";

const BallPitEasterEgg = dynamic(() => import("./ball-pit-easter-egg"), {
  ssr: false,
});

const stats = [
  { value: "1K+", label: "devs" },
  { value: "500+", label: "wins" },
  { value: "30+", label: "co.s" },
];

export default function HeroSection() {
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [heroHeight, setHeroHeight] = useState(0);
  const heroWrapperRef = useRef<HTMLDivElement>(null);

  function handleWinsClick() {
    if (!easterEggActive && heroWrapperRef.current) {
      setHeroHeight(heroWrapperRef.current.offsetHeight);
    }
    setEasterEggActive((v) => !v);
  }

  return (
    <>
      <div className="w-full border-b border-gray-200 bg-neutral-100/80">
        <div className="flex items-center justify-center gap-6 sm:gap-10 px-4 py-2.5">
          {stats.map((s) => (
            <div
              key={s.label}
              onClick={s.label === "wins" ? handleWinsClick : undefined}
              className={`group flex items-center gap-2 rounded-md px-2 py-1 font-deck-pixel text-[10px] sm:text-xs transition-all duration-200 ease-out hover:scale-[1.06] hover:bg-neutral-200/90 hover:shadow-sm active:scale-[0.98] ${
                s.label === "wins" ? "cursor-pointer" : "cursor-default"
              }`}
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

      <div
        ref={heroWrapperRef}
        className="w-full"
        style={heroHeight ? { minHeight: heroHeight } : undefined}
      >
        {easterEggActive ? <BallPitEasterEgg height={heroHeight} /> : <Hero />}
      </div>
    </>
  );
}
