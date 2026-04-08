import React from "react";

export default function About() {
  return (
    <section
      id="about"
      className="w-full px-6 md:px-12 lg:px-20 py-20 md:py-28 border-b border-gray-200"
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-6 text-center">
        <h2 className="font-deck-pixel text-lg sm:text-xl tracking-tight text-neutral-900">
          about
        </h2>

        <div className="flex flex-col gap-4">
          <p className="font-mono text-sm md:text-base text-neutral-600 leading-relaxed">
            Unicorn Mafia is an{" "}
            <span className="text-neutral-900">invite-only</span> community of
            europe&apos;s sharpest developers.
          </p>
          <p className="font-mono text-sm md:text-base text-neutral-600 leading-relaxed">
            &quot;growth compounds in teams, not in isolation.&quot;
          </p>
          <p className="font-mono text-sm md:text-base text-neutral-600 leading-relaxed">
            this community exists to create a space where builders help builders
            accelerate.
          </p>
        </div>
      </div>
    </section>
  );
}
