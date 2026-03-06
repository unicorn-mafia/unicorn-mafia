"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Sponsor } from "../../_types/sponsors";

interface SponsorCardProps {
  sponsor: Sponsor;
}

export function SponsorCard({ sponsor }: SponsorCardProps) {
  return (
    <Link
      href={sponsor.website_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block aspect-square border border-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors group"
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-[128px] h-[30px] relative">
            <Image
              src={sponsor.logo_url}
              alt={`${sponsor.name} logo`}
              fill
              className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
              onError={(e) => {
                e.currentTarget.src = "/companies/placeholder-logo.svg";
              }}
            />
          </div>
        </div>

        <div className="border-t border-neutral-400 px-1 py-2 text-center">
          <h3 className="text-[10px] font-body font-medium text-neutral-900 tracking-wide leading-none truncate group-hover:text-neutral-700">
            {sponsor.name.toUpperCase()}
          </h3>
        </div>
      </div>
    </Link>
  );
}
