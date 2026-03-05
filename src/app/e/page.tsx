"use client";

import { useState, useEffect } from "react";
import { loadEvents } from "../_lib/calendar-data";
import type { CalendarEvent } from "../_types/calendar";
import { EventCard } from "../_components/calendar/event-card";

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<"all" | "um" | "community">(
    "all",
  );

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

  const now = new Date();
  const filteredEvents = events.filter((e) => {
    if (showUpcomingOnly) {
      const start = new Date(e.start.dateTime || e.start.date || "");
      if (start < now) return false;
    }
    if (sourceFilter === "um") return e.hostedByUM;
    if (sourceFilter === "community") return !e.hostedByUM;
    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center mt-12">
        <div className="border border-neutral-600 bg-neutral-50 p-6">
          <div className="text-sm font-body tracking-wide text-neutral-900">
            LOADING EVENTS...
          </div>
        </div>
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
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-600">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-medium font-body text-neutral-900 tracking-wide">
              ALL EVENTS
            </h1>
            <div className="flex items-center gap-4">
              <select
                value={sourceFilter}
                onChange={(e) =>
                  setSourceFilter(e.target.value as "all" | "um" | "community")
                }
                className="text-xs font-body tracking-wide text-neutral-600 bg-transparent border border-neutral-400 px-2 py-1 appearance-none cursor-pointer pr-6"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 6px center",
                }}
              >
                <option value="all">ALL SOURCES</option>
                <option value="um">UM ONLY</option>
                <option value="community">COMMUNITY</option>
              </select>
              <button
                onClick={() => setShowUpcomingOnly((v) => !v)}
                className="flex items-center gap-2 text-xs font-body text-neutral-600 tracking-wide"
              >
                <div
                  className={`w-9 h-5 rounded-full border transition-colors relative ${
                    showUpcomingOnly
                      ? "bg-neutral-900 border-neutral-900"
                      : "bg-neutral-200 border-neutral-400"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                      showUpcomingOnly ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </div>
                UPCOMING ONLY
              </button>
            </div>
          </div>
          <p className="text-xs font-body text-neutral-500 tracking-wide mt-2">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "EVENT" : "EVENTS"}
          </p>
        </div>
      </section>

      {/* Event grid */}
      <section className="py-8 px-6 md:px-12 lg:px-20 mt-4">
        <div className="max-w-6xl mx-auto">
          {filteredEvents.length === 0 ? (
            <div className="border border-dashed border-neutral-300 py-12 text-center">
              <p className="text-xs font-body text-neutral-400 tracking-wide">
                NO EVENTS FOUND
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
