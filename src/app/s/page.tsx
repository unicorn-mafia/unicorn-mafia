"use client";

import { useState, useEffect } from "react";
import { loadSponsorsData } from "../_lib/sponsors-data";
import type { SponsorsData } from "../_types/sponsors";
import { SponsorCard } from "../_components/sponsors/sponsor-card";

export default function Sponsors() {
  const [sponsorsData, setSponsorsData] = useState<SponsorsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadSponsorsData();
        setSponsorsData(data);
      } catch (error) {
        console.error("Failed to load sponsors data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="border border-neutral-600 bg-neutral-50 p-6">
          <div className="text-sm font-body tracking-wide text-neutral-900">
            LOADING SPONSORS...
          </div>
        </div>
      </div>
    );
  }

  if (!sponsorsData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="border border-neutral-600 bg-neutral-50 p-6">
          <div className="text-sm font-body tracking-wide text-neutral-900">
            FAILED TO LOAD SPONSORS DATA
          </div>
        </div>
      </div>
    );
  }

  const sponsors = sponsorsData.sponsors;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-600">
        <div className="max-w-6xl mx-auto">
          <div className="border border-neutral-600 bg-neutral-50 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-medium font-body text-neutral-900 tracking-wide">
                OUR SPONSORS
              </h1>
            </div>
            <p className="text-sm text-neutral-700 font-body max-w-2xl mb-4 leading-relaxed">
              Companies and partners that support the Unicorn Mafia community.
            </p>
            <div className="text-xs font-body text-neutral-600 tracking-wide">
              <span className="border border-neutral-400 px-2 py-1 bg-white">
                {sponsors.length} SPONSORS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-8 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {sponsors.length === 0 ? (
            <div className="text-center py-16">
              <div className="border border-neutral-600 bg-neutral-50 p-8">
                <h3 className="text-lg font-medium text-neutral-900 mb-2 font-body tracking-wide">
                  NO SPONSORS FOUND
                </h3>
                <p className="text-sm text-neutral-600 font-body">
                  Check back soon as we add more sponsors.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sponsors.map((sponsor) => (
                <SponsorCard key={sponsor.name} sponsor={sponsor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="px-6 md:px-12 lg:px-20 py-16"
        style={{ backgroundColor: "#14120B" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight framer-text leading-tight font-title"
            data-text-fill="true"
            style={{
              backgroundImage:
                "linear-gradient(95deg, rgb(255, 255, 255) 37%, rgb(56, 56, 56) 95%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Become a sponsor.
          </h2>
          <p className="text-sm text-neutral-400 font-body max-w-xl leading-relaxed">
            Partner with one of London&apos;s most active AI and tech
            communities. Get your brand in front of 500+ builders, founders, and
            engineers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:stable@unicornmafia.ai?subject=Sponsorship%20Enquiry"
              className="inline-flex items-center gap-2 border border-white text-white font-body text-sm tracking-wide px-6 py-3 hover:bg-white hover:text-black transition-colors"
            >
              GET IN TOUCH
            </a>
          </div>
          <div className="border-t border-neutral-700 pt-6 mt-4">
            <p className="text-xs text-neutral-500 font-body tracking-wide">
              PARTNERSHIP TIERS AND FRAMEWORK COMING SOON
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
