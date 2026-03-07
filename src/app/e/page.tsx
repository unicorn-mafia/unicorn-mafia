"use client";

import { useState, useEffect, useMemo } from "react";
import { loadEvents } from "../_lib/calendar-data";
import type { CalendarEvent } from "../_types/calendar";
import { EventListItem } from "../_components/calendar/event-list-item";
import { EventCard } from "../_components/calendar/event-card";
import { MiniCalendar } from "../_components/calendar/mini-calendar";

type SourceFilter = "all" | "um" | "community";
type ViewMode = "list" | "grid";

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function groupEventsByDate(events: CalendarEvent[]) {
  const groups: { label: string; events: CalendarEvent[] }[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const grouped = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const date = new Date(event.start.dateTime || event.start.date || "");
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (!grouped.has(dayKey)) grouped.set(dayKey, []);
    grouped.get(dayKey)!.push(event);
  }

  for (const [, dayEvents] of grouped) {
    const date = new Date(
      dayEvents[0].start.dateTime || dayEvents[0].start.date || "",
    );

    let label: string;
    if (isSameDay(date, today)) {
      label = "TODAY";
    } else if (isSameDay(date, tomorrow)) {
      label = "TOMORROW";
    } else {
      label = date
        .toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
        .toUpperCase();
    }

    groups.push({ label, events: dayEvents });
  }

  return groups;
}

export default function EventsPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await loadEvents();
        setEvents(data.events);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    let result = events;

    if (showUpcomingOnly) {
      result = result.filter((e) => {
        const start = new Date(e.start.dateTime || e.start.date || "");
        return start >= now;
      });
    }

    if (sourceFilter === "um") {
      result = result.filter((e) => e.hostedByUM);
    } else if (sourceFilter === "community") {
      result = result.filter((e) => !e.hostedByUM);
    }

    if (selectedDate) {
      result = result.filter((e) => {
        const start = new Date(e.start.dateTime || e.start.date || "");
        return isSameDay(start, selectedDate);
      });
    }

    // Always sort nearest first (ascending by date)
    result.sort((a, b) => {
      const aDate = new Date(a.start.dateTime || a.start.date || "");
      const bDate = new Date(b.start.dateTime || b.start.date || "");
      return aDate.getTime() - bDate.getTime();
    });

    return result;
  }, [events, showUpcomingOnly, sourceFilter, selectedDate]);

  const groupedEvents = useMemo(
    () => groupEventsByDate(filteredEvents),
    [filteredEvents],
  );

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-300">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-medium font-body text-neutral-900 tracking-wide">
              EVENTS
            </h1>
          </div>
        </section>
        <section className="py-6 px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4 py-4 px-3 border-b border-neutral-200 animate-pulse"
                >
                  <div className="w-14 h-14 bg-neutral-200 rounded" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center mt-12">
        <div className="border border-neutral-600 bg-neutral-50 p-6">
          <div className="text-sm font-body tracking-wide text-neutral-900">
            FAILED TO LOAD EVENTS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-medium font-body text-neutral-900 tracking-wide">
                EVENTS
              </h1>
              <p className="text-xs font-body text-neutral-500 tracking-wide mt-1">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "EVENT" : "EVENTS"}
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="ml-2 text-neutral-400 hover:text-neutral-900 underline"
                  >
                    CLEAR DATE
                  </button>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              {/* View toggle */}
              <div className="flex border border-neutral-300">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-2 py-1.5 transition-colors ${
                    viewMode === "list"
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                  aria-label="List view"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M2 3h12v1.5H2V3zm0 4h12v1.5H2V7zm0 4h12v1.5H2V11z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2 py-1.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                  aria-label="Grid view"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z" />
                  </svg>
                </button>
              </div>

              {/* Source filter */}
              <div className="flex border border-neutral-300">
                {(
                  [
                    ["all", "ALL"],
                    ["um", "UM"],
                    ["community", "COMMUNITY"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setSourceFilter(value)}
                    className={`px-3 py-1.5 text-[10px] font-body tracking-wide transition-colors ${
                      sourceFilter === value
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Upcoming toggle */}
              <button
                onClick={() => setShowUpcomingOnly((v) => !v)}
                className="flex items-center gap-2 text-[10px] font-body text-neutral-600 tracking-wide"
              >
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative ${
                    showUpcomingOnly ? "bg-neutral-900" : "bg-neutral-300"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all ${
                      showUpcomingOnly ? "left-[17px]" : "left-[3px]"
                    }`}
                  />
                </div>
                <span className="hidden sm:inline">UPCOMING</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-6 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto flex gap-8">
          {/* Event list */}
          <div className="flex-1 min-w-0">
            {filteredEvents.length === 0 ? (
              <div className="border border-dashed border-neutral-300 py-12 text-center">
                <p className="text-xs font-body text-neutral-400 tracking-wide">
                  NO EVENTS FOUND
                </p>
              </div>
            ) : viewMode === "list" ? (
              <div>
                {groupedEvents.map((group) => (
                  <div key={group.label} className="mb-6">
                    <h2 className="text-[10px] font-body font-medium text-neutral-400 tracking-widest mb-2 px-3">
                      {group.label}
                    </h2>
                    <div>
                      {group.events.map((event, i) => (
                        <EventListItem key={event.id} event={event} index={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <MiniCalendar
                events={events}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />

              {/* Location info */}
              <div className="border border-neutral-300 bg-white p-4">
                <h3 className="text-[10px] font-body font-medium text-neutral-400 tracking-widest mb-3">
                  LOCATION
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#4EF9BD] rounded-full" />
                  <span className="text-xs font-body text-neutral-700 tracking-wide">
                    LONDON
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
