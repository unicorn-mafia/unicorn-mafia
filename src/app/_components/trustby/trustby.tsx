import React from "react";
import Image from "next/image";

/** High-res / vector logos only — crisp on screen (no pixelated layer). */
const companies = [
  { name: "Amazon", logo: "/companies/amazon.svg" },
  { name: "Anthropic", logo: "/companies/anthropic.svg" },
  { name: "Apple", logo: "/companies/apple.svg" },
  { name: "Cambridge", logo: "/companies/cambridge.svg" },
  { name: "Google", logo: "/companies/google.svg" },
  { name: "Imperial", logo: "/companies/imperial.svg" },
  { name: "Meta", logo: "/companies/meta.svg" },
  { name: "Nvidia", logo: "/companies/nvidia.svg" },
  { name: "OpenAI", logo: "/companies/openai.svg" },
  { name: "Oxford", logo: "/companies/oxford.svg" },
  { name: "UCL", logo: "/companies/ucl.svg" },
  { name: "Y Combinator", logo: "/companies/ycombinator.svg" },
  { name: "xAI", logo: "/companies/xai-hd.svg" },
  { name: "Palantir", logo: "/companies/palantir-hd.svg" },
];

export default function TrustBy() {
  return (
    <section className="w-full py-16 md:py-24 border-b border-gray-200">
      <div className="px-6 md:px-12 lg:px-20 mb-12">
        <h2 className="font-deck-pixel normal-case text-lg sm:text-xl tracking-tight text-neutral-900 text-center">
          the best hackers from
        </h2>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex items-center animate-scroll-left"
          style={{ width: "max-content" }}
        >
          {[...companies, ...companies].map((company, i) => (
            <div
              key={`${company.name}-${i}`}
              className="flex-shrink-0 w-36 h-14 mx-8 relative grayscale hover:grayscale-0 transition-[filter] duration-300"
            >
              <Image
                src={company.logo}
                alt={company.name}
                fill
                className="object-contain"
                sizes="144px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
