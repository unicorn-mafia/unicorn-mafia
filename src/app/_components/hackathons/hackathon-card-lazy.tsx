"use client";

import React, { useEffect, useRef, useState } from "react";
import type { HackathonWinWithCategory } from "../../_types/hackathons";

interface HackathonCardLazyProps {
  win: HackathonWinWithCategory;
}

interface OgData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  author?: string;
}

// In-memory cache for OG data
const ogCache = new Map<string, OgData>();

export function HackathonCardLazy({ win }: HackathonCardLazyProps) {
  const [og, setOg] = useState<OgData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let cancelled = false;
    const load = async () => {
      try {
        // Check cache first
        const cached = ogCache.get(win.linkedin_url);
        if (cached) {
          setOg(cached);
          setLoading(false);
          return;
        }

        setLoading(true);
        const res = await fetch(`/api/og?url=${encodeURIComponent(win.linkedin_url)}`);
        const data: OgData = await res.json();
        
        if (!cancelled) {
          ogCache.set(win.linkedin_url, data);
          setOg(data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load preview");
          setLoading(false);
        }
      }
    };
    
    load();
    return () => {
      cancelled = true;
    };
  }, [win.linkedin_url, isVisible]);

  const content = loading ? (
    <div className="block aspect-square border border-neutral-600 bg-neutral-50 overflow-hidden animate-pulse">
      <div className="w-full h-1/2 bg-neutral-200" />
      <div className="h-1/2 flex flex-col p-3">
        <div className="h-4 bg-neutral-200 rounded mb-2" />
        <div className="h-3 bg-neutral-200 rounded w-3/4 mb-2" />
        <div className="h-2 bg-neutral-200 rounded w-full mb-1" />
        <div className="h-2 bg-neutral-200 rounded w-5/6 mb-1" />
        <div className="mt-auto pt-2">
          <div className="h-3 bg-neutral-200 rounded w-12" />
        </div>
      </div>
    </div>
  ) : (
    <a
      href={win.linkedin_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block aspect-square border border-neutral-600 bg-neutral-50 overflow-hidden hover:bg-neutral-100 transition-colors"
    >
      {og?.image ? (
        <div className="relative w-full h-1/2 bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={og.image} 
            alt={og.title || "Preview image"} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-full h-1/2 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
          <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="h-1/2 flex flex-col p-3">
        {og?.author && (
          <div className="text-[10px] font-semibold text-neutral-800 font-source tracking-wide mb-1 truncate">
            {og.author}
          </div>
        )}
        <div className="flex items-center gap-2 mb-2 min-h-5">
          {og?.favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={og.favicon} alt="" className="w-4 h-4" loading="lazy" />
          )}
          <span className="text-[10px] text-neutral-600 font-source tracking-wide truncate">
            {og?.siteName || new URL(win.linkedin_url).hostname}
          </span>
        </div>
        <div className="text-xs font-medium font-source text-neutral-900 leading-snug line-clamp-2">
          {og?.title || "Hackathon Win"}
        </div>
        <div className="mt-1 text-[10px] text-neutral-700 font-source leading-snug line-clamp-2">
          {og?.description || (error ? "Failed to load preview" : "Click to view on LinkedIn")}
        </div>
        <div className="mt-auto pt-2 text-[10px] text-neutral-600 font-source">VIEW →</div>
      </div>
    </a>
  );

  return <div ref={cardRef}>{content}</div>;
}