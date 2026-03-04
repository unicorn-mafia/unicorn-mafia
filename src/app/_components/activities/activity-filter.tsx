"use client";

import React from "react";
import type { ActivityType } from "../../_types/activities";

interface ActivityFilterProps {
  selectedTypes: ActivityType[];
  onToggleType: (type: ActivityType) => void;
}

const typeLabels: Record<ActivityType, string> = {
  mental: "MENTAL",
  physical: "PHYSICAL",
  social: "SOCIAL",
};

export function ActivityFilter({ selectedTypes, onToggleType }: ActivityFilterProps) {
  const allTypes: ActivityType[] = ["mental", "physical", "social"];

  return (
    <div className="border border-neutral-600 bg-neutral-50 p-4">
      <div className="mb-3">
        <h3 className="text-xs font-medium font-body text-neutral-900 tracking-wide">
          FILTER BY TYPE
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {allTypes.map((type) => (
          <button
            key={type}
            onClick={() => onToggleType(type)}
            className={`text-xs font-body font-medium px-3 py-1.5 border transition-colors tracking-wide ${
              selectedTypes.includes(type)
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-400 hover:bg-neutral-100"
            }`}
          >
            {typeLabels[type]}
          </button>
        ))}
        {selectedTypes.length > 0 && (
          <button
            onClick={() => allTypes.forEach((type) => onToggleType(type))}
            className="text-xs font-body font-medium px-3 py-1.5 border bg-white text-neutral-500 border-neutral-300 hover:bg-neutral-50 tracking-wide"
          >
            CLEAR ALL
          </button>
        )}
      </div>
    </div>
  );
}
