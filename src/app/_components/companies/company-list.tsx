"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { CompanyWithCategory } from "../../_types/companies";

interface CompanyListProps {
  companies: CompanyWithCategory[];
}

export function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Industry
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Founded
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Website
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr
              key={`${company.categoryName}-${company.name}`}
              className="hover:bg-gray-50"
            >
              {/* Company Name with Logo */}
              <td className="sticky left-0 z-20 bg-white px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 relative">
                    <Image
                      src={company.logo_url}
                      alt={`${company.name} logo`}
                      fill
                      className="object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/companies/placeholder-logo.svg";
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {company.name}
                    </div>
                    {company.verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Description */}
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={company.description}>
                    {company.description}
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {company.categoryName}
                </span>
              </td>

              {/* Industry */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {company.industry}
              </td>

              {/* Stage */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {company.stage}
                </span>
              </td>

              {/* Location */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {company.location}
              </td>

              {/* Founded Year */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {company.founded_year}
              </td>

              {/* Team Size */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {company.team_size}
              </td>

              {/* Website */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {company.website_url
                    .replace(/^https?:\/\//, "")
                    .replace(/^www\./, "")
                    .replace(/\/$/, "")}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}