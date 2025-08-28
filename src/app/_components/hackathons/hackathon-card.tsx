"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { HackathonWinWithCategory } from "../../_types/hackathons";

interface HackathonCardProps {
  win: HackathonWinWithCategory;
}

export function HackathonCard({ win }: HackathonCardProps) {
  const href = win.project_url || win.repo_url || "#";
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block aspect-square border border-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors group"
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-20 h-20 relative">
            <Image
              src={win.logo_url}
              alt={`${win.project_name} logo`}
              fill
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src = "/companies/placeholder-logo.svg";
              }}
            />
          </div>
        </div>
        <div className="border-t border-neutral-400 px-1 py-2 text-center">
          <h3 className="text-[10px] font-source font-medium text-neutral-900 tracking-wide leading-none truncate group-hover:text-neutral-700">
            {`${win.project_name.toUpperCase()} · ${win.prize.toUpperCase()}`}
          </h3>
          <p className="mt-1 text-[9px] text-neutral-700 leading-none truncate">
            {`${win.event_name} ${win.year}`}
          </p>
        </div>
      </div>
    </Link>
  );
}

