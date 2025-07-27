"use client";

import React from "react";

interface FilterTabsProps {
  tags: string[];
  activeTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function FilterTabs({ tags, activeTags, onTagsChange }: FilterTabsProps) {
  const handleTagClick = (tag: string) => {
    if (tag === "all") {
      onTagsChange(["all"]);
      return;
    }

    let newActiveTags: string[];

    if (activeTags.includes("all")) {
      // If "all" is active and we click another tag, replace with just that tag
      newActiveTags = [tag];
    } else if (activeTags.includes(tag)) {
      // If tag is already active, remove it
      newActiveTags = activeTags.filter((t) => t !== tag);
      // If no tags left, set to "all"
      if (newActiveTags.length === 0) {
        newActiveTags = ["all"];
      }
    } else {
      // Add the tag to active tags
      newActiveTags = [...activeTags, tag];
    }

    onTagsChange(newActiveTags);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by tags:</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = activeTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag === "all" ? "All" : tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}