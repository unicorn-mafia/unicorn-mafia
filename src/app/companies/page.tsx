"use client";

import { useState, useEffect } from "react";
import { CompanyCard } from "../_components/companies/company-card";
import { CompanyList } from "../_components/companies/company-list";
import { FilterTabs } from "../_components/companies/filter-tabs";
import { ViewToggle } from "../_components/companies/view-toggle";
import { loadCompaniesData } from "../_lib/companies-data";
import type { CompaniesData, Company } from "../_types/companies";
import Navbar from "../_components/navbar/navbar";

export default function Companies() {
  const [companiesData, setCompaniesData] = useState<CompaniesData | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTags, setActiveTags] = useState<string[]>(["all"]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl font-inter">Loading companies...</div>
        </div>
      </div>
    );
  }

  if (!companiesData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl font-inter">Failed to load companies data</div>
        </div>
      </div>
    );
  }

  // Get all companies from all categories
  const allCompanies = companiesData.categories.flatMap((category) =>
    category.companies.map((company) => ({
      ...company,
      categoryName: category.name,
    }))
  );

  // Filter companies based on active category and tags
  const filteredCompanies = allCompanies.filter((company) => {
    // Category filter
    if (activeCategory !== "all") {
      if (company.categoryName !== activeCategory) return false;
    }

    // Tag filter
    if (!activeTags.includes("all")) {
      const hasMatchingTag = company.tags?.some((tag) =>
        activeTags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  // Get all unique tags for filter tabs
  const allTags = ["all", ...new Set(allCompanies.flatMap((company) => company.tags || []))];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 border-b border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-inter tracking-tighter text-black mb-6">
            Member Companies
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-inter max-w-3xl mx-auto mb-8">
            Discover the innovative companies built by our community members. From AI to fintech, 
            these startups are shaping the future of technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <span>{filteredCompanies.length} companies</span>
            <span className="hidden sm:block">•</span>
            <span>{companiesData.categories.length} categories</span>
          </div>
        </div>
      </section>

      {/* Filter and View Controls */}
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === "all"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Categories
              </button>
              {companiesData.categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.name
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Tag Filter */}
          <FilterTabs
            tags={allTags}
            activeTags={activeTags}
            onTagsChange={setActiveTags}
          />
        </div>
      </section>

      {/* Companies Display */}
      <section className="py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No companies found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more results
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard
                  key={`${company.categoryName}-${company.name}`}
                  company={company}
                  category={company.categoryName}
                />
              ))}
            </div>
          ) : (
            <CompanyList companies={filteredCompanies} />
          )}
        </div>
      </section>
    </div>
  );
}