"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { CompanyWithCategory } from "../../_types/companies";

interface CompanyCardProps {
  company: CompanyWithCategory;
  category: string;
}

export function CompanyCard({ company, category }: CompanyCardProps) {
  return (
    <Link
      href={company.website_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block aspect-square border border-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors group"
    >
      <div className="h-full flex flex-col">
        {/* Company Logo Area - fills most of the space */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-[128px] h-[30px] relative">
            <Image
              src={company.logo_url}
              alt={`${company.name} logo`}
              fill
              unoptimized={company.logo_url.startsWith('http')}
              className={`object-contain ${
                company.logo_url.includes('favicon') ? 'brightness-0' : ''
              }`}
              onError={(e) => {
                e.currentTarget.src = "/companies/placeholder-logo.svg";
              }}
            />
          </div>
        </div>
        
        {/* Company Name - compact bottom section */}
        <div className="border-t border-neutral-400 px-1 py-2 text-center">
          <h3 className="text-[10px] font-source font-medium text-neutral-900 tracking-wide leading-none truncate group-hover:text-neutral-700">
            {company.name.toUpperCase()}
          </h3>
        </div>
      </div>
    </Link>
  );
}