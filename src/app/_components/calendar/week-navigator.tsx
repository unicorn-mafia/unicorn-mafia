"use client";

import React from "react";
import { formatWeekRange } from "../../_lib/calendar-data";

interface WeekNavigatorProps {
  weekOffset: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function WeekNavigator({ weekOffset, onPrev, onNext, onToday }: WeekNavigatorProps) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayDate = new Date(now);
  mondayDate.setDate(now.getDate() + daysUntilMonday + weekOffset * 7);
  const sundayDate = new Date(mondayDate);
  sundayDate.setDate(mondayDate.getDate() + 6);
  const monday = mondayDate.toISOString();
  const sunday = sundayDate.toISOString();

  return (
    <div className="border border-neutral-600 bg-neutral-50 flex items-center justify-between px-4 py-3">
      <button
        onClick={onPrev}
        className="text-xs font-body text-neutral-700 tracking-wide hover:text-black transition-colors px-2 py-1 border border-neutral-400 bg-white"
      >
        ← PREV
      </button>

      <div className="flex items-center gap-3">
        <span className="text-xs font-body text-neutral-700 tracking-wide">
          {formatWeekRange(monday, sunday)}
        </span>
        {weekOffset !== 0 && (
          <button
            onClick={onToday}
            className="text-[10px] font-body text-neutral-500 tracking-wide hover:text-black transition-colors px-2 py-0.5 border border-neutral-300 bg-white"
          >
            THIS WEEK
          </button>
        )}
      </div>

      <button
        onClick={onNext}
        className="text-xs font-body text-neutral-700 tracking-wide hover:text-black transition-colors px-2 py-1 border border-neutral-400 bg-white"
      >
        NEXT →
      </button>
    </div>
  );
}
