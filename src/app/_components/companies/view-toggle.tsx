"use client";

import React from "react";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-600 font-source tracking-wide">VIEW:</span>
      <div className="flex border border-neutral-600">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`flex items-center px-3 py-2 text-xs font-source font-medium tracking-wide transition-colors border-r border-neutral-600 ${
            viewMode === "grid"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
          }`}
        >
          <div className="w-3 h-3 mr-2 grid grid-cols-2 grid-rows-2 gap-px">
            <div className="bg-current"></div>
            <div className="bg-current"></div>
            <div className="bg-current"></div>
            <div className="bg-current"></div>
          </div>
          GRID
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`flex items-center px-3 py-2 text-xs font-source font-medium tracking-wide transition-colors ${
            viewMode === "list"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
          }`}
        >
          <div className="w-3 h-3 mr-2 flex flex-col justify-between">
            <div className="h-px bg-current"></div>
            <div className="h-px bg-current"></div>
            <div className="h-px bg-current"></div>
          </div>
          LIST
        </button>
      </div>
    </div>
  );
}