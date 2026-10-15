"use client";

import React, { useState } from "react";
import type { CalendarEvent } from "../../_types/calendar";

interface MiniCalendarProps {
  events: CalendarEvent[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0

  const days: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function MiniCalendar({
  events,
  selectedDate,
  onSelectDate,
}: MiniCalendarProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const days = getMonthDays(viewYear, viewMonth);
  const weekDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

  const monthLabel = new Date(viewYear, viewMonth)
    .toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    .toUpperCase();

  // Build a set of dates that have events, tracking if UM or community
  const eventDates = new Map<
    string,
    { hasUM: boolean; hasCommunity: boolean }
  >();
  events.forEach((event) => {
    const d = new Date(event.start.dateTime || event.start.date || "");
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const existing = eventDates.get(key) || {
      hasUM: false,
      hasCommunity: false,
    };
    if (event.hostedByUM) existing.hasUM = true;
    else existing.hasCommunity = true;
    eventDates.set(key, existing);
  });

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <div className="border border-neutral-300 bg-white p-4">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="text-neutral-400 hover:text-neutral-900 text-sm font-body px-1"
        >
          &larr;
        </button>
        <span className="text-xs font-body font-medium tracking-wide text-neutral-900">
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          className="text-neutral-400 hover:text-neutral-900 text-sm font-body px-1"
        >
          &rarr;
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] font-body text-neutral-400 tracking-wide py-1"
          >
            {d}
          </div>
        ))}

        {/* Calendar cells */}
        {days.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="py-1.5" />;
          }

          const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
          const eventInfo = eventDates.get(key);
          const hasEvent = !!eventInfo;
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={key}
              onClick={() => {
                if (isSelected) {
                  onSelectDate(null);
                } else {
                  onSelectDate(day);
                }
              }}
              className={`relative flex flex-col items-center py-1.5 text-xs font-body transition-colors ${
                isSelected
                  ? "bg-neutral-900 text-white"
                  : isToday
                    ? "text-neutral-900 font-bold"
                    : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {day.getDate()}
              {hasEvent && (
                <div className="flex gap-0.5 mt-0.5">
                  {eventInfo.hasUM && (
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: isSelected ? "#fff" : "#B307EB",
                      }}
                    />
                  )}
                  {eventInfo.hasCommunity && (
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: isSelected ? "#fff" : "#3198F1",
                      }}
                    />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-200">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B307EB]" />
          <span className="text-[9px] font-body text-neutral-500 tracking-wide">
            UM
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3198F1]" />
          <span className="text-[9px] font-body text-neutral-500 tracking-wide">
            COMMUNITY
          </span>
        </div>
      </div>
    </div>
  );
}
