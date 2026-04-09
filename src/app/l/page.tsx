"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import type { LondonLocation, LocationCategory } from "../_types/london";
import { CATEGORY_META } from "../_types/london";
import type { CalendarEvent } from "../_types/calendar";
import { loadLocations, calendarEventsToLocations } from "../_lib/london-data";
import { loadEvents } from "../_lib/calendar-data";
import { Sidebar } from "../_components/london/sidebar";
import { LocationCard } from "../_components/london/location-card";
import { EventTimeline } from "../_components/london/event-timeline";

const LondonMap = dynamic(() => import("../_components/london/london-map"), {
  ssr: false,
});

// Permanent location categories only (events go in the timeline)
const MAP_CATEGORIES: LocationCategory[] = [
  "coworking",
  "vc",
  "startup",
  "bigtech",
];

function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Map event locations to the nearest permanent venue (within 300m)
function matchEventToVenue(
  eventLoc: LondonLocation,
  venues: LondonLocation[],
): string | null {
  let closest: { id: string; dist: number } | null = null;
  for (const v of venues) {
    const dist = distanceMeters(eventLoc.lat, eventLoc.lng, v.lat, v.lng);
    if (dist <= 300 && (!closest || dist < closest.dist)) {
      closest = { id: v.id, dist };
    }
  }
  return closest?.id || null;
}

export default function LondonPage() {
  const [locations, setLocations] = useState<LondonLocation[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [eventLocations, setEventLocations] = useState<LondonLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeCategories, setActiveCategories] = useState<
    Set<LocationCategory>
  >(new Set(MAP_CATEGORIES));
  const [selectedLocation, setSelectedLocation] =
    useState<LondonLocation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchCenter, setSearchCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoadError(null);
      try {
        const [locResult, eventsResult] = await Promise.allSettled([
          loadLocations(),
          loadEvents(),
        ]);

        if (locResult.status === "rejected") {
          console.error("Failed to load locations:", locResult.reason);
          setLoadError("FAILED TO LOAD LOCATIONS");
          setLocations([]);
          setCalendarEvents([]);
          setEventLocations([]);
          return;
        }

        setLocations(locResult.value);

        if (eventsResult.status === "rejected") {
          console.error("Failed to load events:", eventsResult.reason);
          setCalendarEvents([]);
          setEventLocations([]);
          return;
        }

        setCalendarEvents(eventsResult.value.events);
        setEventLocations(calendarEventsToLocations(eventsResult.value.events));
      } catch (err) {
        console.error("Failed to load locations:", err);
        setLoadError("FAILED TO LOAD LOCATIONS");
        setLocations([]);
        setCalendarEvents([]);
        setEventLocations([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleCategory = useCallback((cat: LocationCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const handleSelectLocation = useCallback((loc: LondonLocation | null) => {
    setSelectedLocation(loc);
  }, []);

  const handleSearchArea = useCallback(
    (center: { lat: number; lng: number } | null) => {
      setSearchCenter(center);
      setSelectedLocation(null);
    },
    [],
  );

  // Map each event location to its nearest permanent venue
  const eventToVenueMap = useMemo(() => {
    const m = new Map<string, string>(); // event location id -> venue id
    for (const evLoc of eventLocations) {
      const venueId = matchEventToVenue(evLoc, locations);
      if (venueId) m.set(evLoc.id, venueId);
    }
    return m;
  }, [eventLocations, locations]);

  // Count events per venue for the ring indicators
  const venueEventCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const venueId of eventToVenueMap.values()) {
      counts.set(venueId, (counts.get(venueId) || 0) + 1);
    }
    return counts;
  }, [eventToVenueMap]);

  // When hovering an event in the timeline, find its matching venue
  const highlightedVenueId = useMemo(() => {
    if (!hoveredEventId) return null;
    // Find the event location that matches this calendar event
    const evLoc = eventLocations.find(
      (el) => el.id === `event-${hoveredEventId}`,
    );
    if (!evLoc) return null;
    return eventToVenueMap.get(evLoc.id) || null;
  }, [hoveredEventId, eventLocations, eventToVenueMap]);

  const handleClickTimelineEvent = useCallback((event: CalendarEvent) => {
    const url = event.externalUrl || event.htmlLink;
    if (url) window.open(url, "_blank");
  }, []);

  const nearbyIds = useMemo(() => {
    if (!searchCenter) return new Set<string>();
    const ids = new Set<string>();
    for (const loc of locations) {
      if (
        distanceMeters(searchCenter.lat, searchCenter.lng, loc.lat, loc.lng) <=
        1500
      )
        ids.add(loc.id);
    }
    return ids;
  }, [locations, searchCenter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const loc of locations) {
      c[loc.category] = (c[loc.category] || 0) + 1;
    }
    return c;
  }, [locations]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-10rem)] bg-white overflow-hidden p-4">
        <div className="h-full animate-pulse border border-neutral-200">
          <div className="h-10 border-b border-neutral-200 bg-neutral-100" />
          <div className="h-[calc(100%-2.5rem)] bg-neutral-50" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center bg-white overflow-hidden">
        <div className="border border-neutral-600 bg-neutral-50 p-6">
          <p className="text-xs font-body tracking-wide text-neutral-900">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col overflow-hidden">
      {/* Main area: sidebar + map */}
      <div className="flex flex-1 relative min-h-0">
        {/* Sidebar - desktop */}
        <div
          className={`hidden md:flex flex-col transition-all duration-300 border-r border-neutral-200 ${
            sidebarOpen ? "w-80" : "w-0"
          } overflow-hidden flex-shrink-0 relative z-[500]`}
        >
          <Sidebar
            locations={locations}
            activeCategories={activeCategories}
            onToggleCategory={toggleCategory}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
            onSearchArea={handleSearchArea}
            searchCenter={searchCenter}
            nearbyIds={nearbyIds}
          />
        </div>

        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="hidden md:flex absolute top-3 z-[1000] items-center justify-center w-6 h-6 bg-white border border-neutral-300 hover:bg-neutral-50 transition-all"
          style={{ left: sidebarOpen ? "calc(20rem - 12px)" : 4 }}
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`w-3 h-3 text-neutral-500 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
          >
            <path d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" />
          </svg>
        </button>

        {/* Map */}
        <div className="flex-1 relative min-w-0 overflow-hidden [clip-path:inset(0)]">
          <LondonMap
            locations={locations}
            activeCategories={activeCategories}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
            searchCenter={searchCenter}
            venueEventCounts={venueEventCounts}
            highlightedVenueId={highlightedVenueId}
          />

          <LocationCard
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />

          {/* Mobile bottom bar */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm border-t border-neutral-200 px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {MAP_CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat];
                const active = activeCategories.has(cat);
                const count = counts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono tracking-wide transition-all border whitespace-nowrap ${
                      active
                        ? "border-neutral-900 text-neutral-900"
                        : "border-neutral-200 text-neutral-400"
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: meta.color,
                        opacity: active ? 1 : 0.3,
                      }}
                    />
                    {meta.label}
                    <span className="text-[9px] text-neutral-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Event timeline strip — bottom of page */}
      <EventTimeline
        events={calendarEvents}
        hoveredEventId={hoveredEventId}
        onHoverEvent={setHoveredEventId}
        onClickEvent={handleClickTimelineEvent}
      />
    </div>
  );
}
