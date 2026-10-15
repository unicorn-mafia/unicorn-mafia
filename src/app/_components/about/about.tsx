import React from "react";

export default function About() {
  return (
    <section
      id="about"
      className="w-full px-6 md:px-12 lg:px-20 py-20 md:py-28 border-b border-gray-200"
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-6 text-center">
        <h2 className="font-title text-3xl sm:text-4xl tracking-tight text-neutral-900">
          about
        </h2>

        <div className="flex flex-col gap-4">
          <p className="font-mono text-sm md:text-base text-neutral-600 leading-relaxed">
            an <span className="text-neutral-900">invite-only</span> community
            for Europe&apos;s best developers.
          </p>
          <p className="font-mono text-sm md:text-base text-neutral-600 leading-relaxed">
            we&apos;re building this community on a simple observation: when
            exceptional builders collide often enough, companies start
            appearing.
          </p>
          <p className="font-mono text-sm md:text-base text-neutral-600 leading-relaxed">
            our goal is to architect an ecosystem that turns those companies
            into unicorns.
          </p>
        </div>
      </div>
    </section>
  );
}
