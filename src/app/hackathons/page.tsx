"use client";

import { useState, useEffect } from "react";
import { loadHackathonsData } from "../_lib/hackathons-data";
import type { HackathonsData } from "../_types/hackathons";
import { HackathonCard } from "../_components/hackathons/hackathon-card";
import { AddYoursCard } from "../_components/hackathons/add-yours-card";

export default function Hackathons() {
  const [hackathonsData, setHackathonsData] = useState<HackathonsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadHackathonsData();
        setHackathonsData(data);
      } catch (error) {
        console.error("Failed to load hackathons data:", error);
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
          <div className="text-sm font-body tracking-wide text-neutral-900">LOADING HACKATHONS...</div>
        </div>
      </div>
    );
  }

  if (!hackathonsData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="border border-neutral-600 bg-neutral-50 p-6">
          <div className="text-sm font-body tracking-wide text-neutral-900">FAILED TO LOAD HACKATHONS DATA</div>
        </div>
      </div>
    );
  }

  const allWins = hackathonsData.categories
    .flatMap((category) =>
      category.wins.map((win) => ({
        ...win,
        categoryName: category.name,
      }))
    )
    .sort(() => Math.random() - 0.5);

  return (
    <div className="bg-white">
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-600">
        <div className="max-w-6xl mx-auto">
          <div className="border border-neutral-600 bg-neutral-50 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-medium font-body text-neutral-900 tracking-wide">
                HACKATHON WINS
              </h1>
            </div>
            <p className="text-sm text-neutral-700 font-body max-w-2xl mb-4 leading-relaxed">
              Awarded projects and wins by Unicorn Mafia members across hackathons.
            </p>
            <div className="text-xs font-body text-neutral-600 tracking-wide">
              <span className="border border-neutral-400 px-2 py-1 bg-white">{allWins.length} WINS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {allWins.length === 0 ? (
            <div className="text-center py-16">
              <div className="border border-neutral-600 bg-neutral-50 p-8">
                <h3 className="text-lg font-medium text-neutral-900 mb-2 font-body tracking-wide">
                  NO HACKATHON WINS FOUND
                </h3>
                <p className="text-sm text-neutral-600 font-body">
                  Check back soon as we add more wins.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AddYoursCard />
              {allWins.map((win, index) => (
                <HackathonCard key={`${win.categoryName}-${index}`} win={win} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

