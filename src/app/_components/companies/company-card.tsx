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
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header with logo and basic info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 relative">
          <Image
            src={company.logo_url}
            alt={`${company.name} logo`}
            fill
            className="object-contain rounded"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.currentTarget.src = "/companies/placeholder-logo.svg";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 font-inter truncate">
            {company.name}
          </h3>
          <p className="text-sm text-gray-600">{company.industry}</p>
          {company.verified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
        {company.description}
      </p>

      {/* Company details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Founded</span>
          <span>{company.founded_year}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Stage</span>
          <span>{company.stage}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Team Size</span>
          <span>{company.team_size}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Location</span>
          <span>{company.location}</span>
        </div>
      </div>

      {/* Tags */}
      {company.tags && company.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {company.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {company.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              +{company.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer with links */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex space-x-3">
          {company.social_links?.twitter && (
            <Link
              href={company.social_links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          )}
          {company.social_links?.linkedin && (
            <Link
              href={company.social_links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
          )}
          {company.social_links?.github && (
            <Link
              href={company.social_links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
          )}
        </div>
        <Link
          href={company.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Visit Site →
        </Link>
      </div>
    </div>
  );
}