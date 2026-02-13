"use client";

import React from "react";
import type { CalendarEvent } from "../../_types/calendar";
import { EventCard } from "./event-card";

interface DayColumnProps {
  dayLabel: string;
  events: CalendarEvent[];
  startIndex: number;
}

export function DayColumn({ dayLabel, events, startIndex }: DayColumnProps) {
  return (
    <div className="border border-neutral-600 bg-neutral-50">
      {/* Day header */}
      <div className="border-b border-neutral-600 px-4 py-3">
        <h2 className="text-sm font-medium font-body text-neutral-900 tracking-widest">
          {dayLabel}
        </h2>
      </div>

      {/* Events list */}
      <div className="p-4 space-y-4">
        {events.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs font-body text-neutral-400 tracking-wide">
              NO EVENTS SCHEDULED
            </p>
          </div>
        ) : (
          events.map((event, i) => (
            <EventCard key={event.id} event={event} index={startIndex + i} />
          ))
        )}
      </div>
    </div>
  );
}
