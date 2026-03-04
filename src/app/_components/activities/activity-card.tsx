"use client";

import React from "react";
import type { ActivityWithCategory, ActivityType } from "../../_types/activities";

interface ActivityCardProps {
  activity: ActivityWithCategory;
}

const typeColors: Record<ActivityType, { bg: string; text: string; border: string }> = {
  mental: { bg: "bg-blue-50", text: "text-blue-900", border: "border-blue-600" },
  physical: { bg: "bg-green-50", text: "text-green-900", border: "border-green-600" },
  social: { bg: "bg-purple-50", text: "text-purple-900", border: "border-purple-600" },
};

const intensityIcons: Record<string, string> = {
  low: "○",
  medium: "◐",
  high: "●",
};

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="border border-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium font-body text-neutral-900 tracking-wide">
            {activity.title.toUpperCase()}
          </h3>
          {activity.intensity && (
            <span className="text-xs text-neutral-600 font-body" title={`Intensity: ${activity.intensity}`}>
              {intensityIcons[activity.intensity]}
            </span>
          )}
        </div>

        <p className="text-xs text-neutral-700 font-body mb-3 leading-relaxed">
          {activity.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {activity.type.map((type) => (
            <span
              key={type}
              className={`text-[10px] font-body font-medium px-2 py-1 border ${typeColors[type].bg} ${typeColors[type].text} ${typeColors[type].border} tracking-wide`}
            >
              {type.toUpperCase()}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-[10px] font-body text-neutral-600 tracking-wide">
          <span>{new Date(activity.date).toLocaleDateString()}</span>
          {activity.duration_minutes && (
            <span>{activity.duration_minutes} MIN</span>
          )}
        </div>

        {activity.notes && (
          <div className="mt-2 pt-2 border-t border-neutral-400">
            <p className="text-[10px] text-neutral-600 font-body italic">
              {activity.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
