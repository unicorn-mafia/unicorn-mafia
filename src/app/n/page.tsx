"use client";

import { useState } from "react";
import newsFeedRaw from "@/data/news-feed.json";
import { CATEGORY_COLOURS } from "@/lib/brand";

interface NewsItem {
  id: string;
  platform: "x" | "linkedin";
  category: "launches" | "product" | "hackathon_wins";
  author: string;
  date: string;
  blurb: string;
  postUrl: string;
}

const newsFeed = newsFeedRaw as NewsItem[];

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "launches", label: "Launches" },
  { key: "product", label: "Product" },
  { key: "hackathon_wins", label: "Hackathon Wins" },
] as const;

type FilterKey = "all" | "launches" | "product" | "hackathon_wins";

const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NewsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const items =
    filter === "all"
      ? [...newsFeed].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
      : newsFeed
          .filter((i) => i.category === filter)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-title text-4xl sm:text-5xl tracking-tight text-neutral-900 mb-2">
            news
          </h1>
          <p className="font-mono text-sm text-neutral-500 leading-relaxed">
            Launches, products and wins from the Unicorn Mafia community.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="px-6 md:px-12 lg:px-20 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto flex gap-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setFilter(cat.key as FilterKey)}
              className="font-title text-[11px] sm:text-sm tracking-widest uppercase px-4 py-3 border-b-2 transition-all duration-150"
              style={{
                borderBottomColor:
                  filter === cat.key
                    ? cat.key === "all"
                      ? "#000"
                      : CATEGORY_COLOURS[cat.key]
                    : "transparent",
                color: filter === cat.key ? "#111" : "#999",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section className="py-8 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="border border-neutral-200 p-8 text-center">
              <p className="font-mono text-sm text-neutral-400">No posts yet</p>
            </div>
          ) : (
            items.map((item) => (
              <a
                key={item.id}
                href={item.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-neutral-200 hover:border-neutral-900 transition-colors bg-white"
              >
                <div className="p-5">
                  {/* Author header */}
                  <p className="font-mono text-sm font-semibold text-neutral-900 mb-2">
                    {item.author}
                  </p>

                  {/* Post text */}
                  <p className="font-mono text-sm text-neutral-600 leading-relaxed mb-3">
                    {item.blurb}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-2">
                    {/* Platform badge — black & white */}
                    <span className="flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-medium bg-black text-white">
                      {item.platform === "x" ? <XIcon /> : <LinkedInIcon />}
                      {item.platform === "x" ? "X" : "LinkedIn"}
                    </span>

                    {/* Category pill */}
                    <span
                      className="font-title text-[8px] uppercase tracking-wider px-2 py-0.5"
                      style={{
                        background: CATEGORY_COLOURS[item.category] + "22",
                        color: CATEGORY_COLOURS[item.category],
                        border: `1px solid ${CATEGORY_COLOURS[item.category]}44`,
                      }}
                    >
                      {item.category === "hackathon_wins"
                        ? "hackathon win"
                        : item.category}
                    </span>

                    <span className="font-mono text-xs text-neutral-400 ml-auto">
                      {formatDate(item.date)}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-neutral-400 mt-3 group-hover:text-neutral-900 transition-colors">
                    View post →
                  </p>
                </div>
              </a>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
