"use client";

import { useState, useEffect } from "react";
import { CompanyCard } from "../_components/companies/company-card";
import { loadCompaniesData } from "../_lib/companies-data";
import type { CompaniesData, Company } from "../_types/companies";
import Navbar from "../_components/navbar/navbar";

export default function Companies() {
  const [companiesData, setCompaniesData] = useState<CompaniesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadCompaniesData();
        setCompaniesData(data);
      } catch (error) {
        console.error("Failed to load companies data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="border border-neutral-600 bg-neutral-50 p-6">
            <div className="text-sm font-source tracking-wide text-neutral-900">LOADING COMPANIES...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!companiesData) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="border border-neutral-600 bg-neutral-50 p-6">
            <div className="text-sm font-source tracking-wide text-neutral-900">FAILED TO LOAD COMPANIES DATA</div>
          </div>
        </div>
      </div>
    );
  }

  // Get all companies from all categories and shuffle for fairness
  const allCompanies = companiesData.categories.flatMap((category) =>
    category.companies.map((company) => ({
      ...company,
      categoryName: category.name,
    }))
  ).sort(() => Math.random() - 0.5); // Random shuffle for fair display

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-600">
        <div className="max-w-6xl mx-auto">
          <div className="border border-neutral-600 bg-neutral-50 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-medium font-source text-neutral-900 tracking-wide">
                MEMBER COMPANIES
              </h1>
            </div>
            <p className="text-sm text-neutral-700 font-source max-w-2xl mb-4 leading-relaxed">
              Companies founded, co-founded, or where mafia members hold key positions.
            </p>
            <div className="text-xs font-source text-neutral-600 tracking-wide">
              <span className="border border-neutral-400 px-2 py-1 bg-white">{allCompanies.length} COMPANIES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-8 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {allCompanies.length === 0 ? (
            <div className="text-center py-16">
              <div className="border border-neutral-600 bg-neutral-50 p-8">
                <h3 className="text-lg font-medium text-neutral-900 mb-2 font-source tracking-wide">
                  NO COMPANIES FOUND
                </h3>
                <p className="text-sm text-neutral-600 font-source">
                  Check back soon as we add more member companies.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {allCompanies.map((company) => (
                <CompanyCard
                  key={`${company.categoryName}-${company.name}`}
                  company={company}
                  category={company.categoryName}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}