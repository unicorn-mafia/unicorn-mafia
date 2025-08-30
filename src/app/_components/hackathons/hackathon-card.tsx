"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { HackathonWinWithCategory } from "../../_types/hackathons";

interface HackathonCardProps {
  win: HackathonWinWithCategory;
}

interface OgData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export function HackathonCard({ win }: HackathonCardProps) {
  const [og, setOg] = useState<OgData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/og?url=${encodeURIComponent(win.linkedin_url)}`, { cache: "no-store" });
        const data: OgData = await res.json();
        if (!cancelled) setOg(data);
      } catch (e) {
        if (!cancelled) setError("Failed to load preview");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [win.linkedin_url]);

  return (
    <a
      href={win.linkedin_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block aspect-square border border-neutral-600 bg-neutral-50 overflow-hidden hover:bg-neutral-100 transition-colors"
    >
      {og?.image ? (
        <div className="relative w-full h-1/2 bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={og.image} alt={og.title || "Preview image"} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-1/2 bg-neutral-100" />
      )}
      <div className="h-1/2 flex flex-col p-3">
        <div className="flex items-center gap-2 mb-2 min-h-5">
          {og?.favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={og.favicon} alt="" className="w-4 h-4" />
          )}
          <span className="text-[10px] text-neutral-600 font-source tracking-wide truncate">
            {og?.siteName || new URL(win.linkedin_url).hostname}
          </span>
        </div>
        <div className="text-xs font-medium font-source text-neutral-900 leading-snug line-clamp-2">
          {og?.title || "Open Graph Preview"}
        </div>
        <div className="mt-1 text-[10px] text-neutral-700 font-source leading-snug line-clamp-3">
          {og?.description || (error ? "Failed to load preview" : "")}
        </div>
        <div className="mt-auto pt-2 text-[10px] text-neutral-600 font-source">VIEW →</div>
      </div>
    </a>
  );
}
