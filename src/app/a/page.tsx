"use client";

import { useState, useEffect } from "react";
import { ActivityCard } from "../_components/activities/activity-card";
import { ActivityFilter } from "../_components/activities/activity-filter";
import { loadActivitiesData } from "../_lib/activities-data";
import type { ActivitiesData, ActivityType } from "../_types/activities";

export default function Activities() {
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadActivitiesData();
        setActivitiesData(data);
      } catch (error) {
        console.error("Failed to load activities data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleType = (type: ActivityType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="border border-neutral-600 bg-neutral-50 p-6">
          <div className="text-sm font-body tracking-wide text-neutral-900">
            LOADING ACTIVITIES...
          </div>
        </div>
      </div>
    );
  }

  if (!activitiesData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="border border-neutral-600 bg-neutral-50 p-6">
          <div className="text-sm font-body tracking-wide text-neutral-900">
            FAILED TO LOAD ACTIVITIES DATA
          </div>
        </div>
      </div>
    );
  }

  const activitiesWithCategory = activitiesData.categories.flatMap((category) =>
    category.activities.map((activity) => ({
      ...activity,
      categoryName: category.name,
    }))
  );

  const filteredActivities = selectedTypes.length > 0
    ? activitiesWithCategory.filter((activity) =>
        activity.type.some((type) => selectedTypes.includes(type))
      )
    : activitiesWithCategory;

  const typeStats = {
    mental: activitiesWithCategory.filter((a) => a.type.includes("mental")).length,
    physical: activitiesWithCategory.filter((a) => a.type.includes("physical")).length,
    social: activitiesWithCategory.filter((a) => a.type.includes("social")).length,
  };

  return (
    <div className="bg-white">
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-600">
        <div className="max-w-6xl mx-auto">
          <div className="border border-neutral-600 bg-neutral-50 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-medium font-body text-neutral-900 tracking-wide">
                ACTIVITY LOG
              </h1>
            </div>
            <p className="text-sm text-neutral-700 font-body max-w-2xl mb-4 leading-relaxed">
              Track and categorize activities by type: mental, physical, and social exertion.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-body text-neutral-600 tracking-wide">
              <span className="border border-neutral-400 px-2 py-1 bg-white">
                {activitiesWithCategory.length} TOTAL
              </span>
              <span className="border border-blue-600 px-2 py-1 bg-blue-50 text-blue-900">
                {typeStats.mental} MENTAL
              </span>
              <span className="border border-green-600 px-2 py-1 bg-green-50 text-green-900">
                {typeStats.physical} PHYSICAL
              </span>
              <span className="border border-purple-600 px-2 py-1 bg-purple-50 text-purple-900">
                {typeStats.social} SOCIAL
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <ActivityFilter
              selectedTypes={selectedTypes}
              onToggleType={handleToggleType}
            />
          </div>

          {filteredActivities.length === 0 ? (
            <div className="text-center py-16">
              <div className="border border-neutral-600 bg-neutral-50 p-8">
                <h3 className="text-lg font-medium text-neutral-900 mb-2 font-body tracking-wide">
                  NO ACTIVITIES FOUND
                </h3>
                <p className="text-sm text-neutral-600 font-body">
                  {selectedTypes.length > 0
                    ? "Try adjusting your filters."
                    : "Check back soon as we log more activities."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
