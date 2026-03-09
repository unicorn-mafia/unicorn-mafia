"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LondonLocation, LocationCategory } from "../../_types/london";
import { CATEGORY_META } from "../../_types/london";

interface LondonMapProps {
  locations: LondonLocation[];
  activeCategories: Set<LocationCategory>;
  selectedLocation: LondonLocation | null;
  onSelectLocation: (loc: LondonLocation | null) => void;
  searchCenter: { lat: number; lng: number } | null;
  venueEventCounts: Map<string, number>;
  highlightedVenueId: string | null;
}

export default function LondonMap({
  locations,
  activeCategories,
  selectedLocation,
  onSelectLocation,
  searchCenter,
  venueEventCounts,
  highlightedVenueId,
}: LondonMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const ringsRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const searchCircleRef = useRef<L.Circle | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [51.52, -0.09],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 },
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    ringsRef.current.forEach((m) => m.remove());
    ringsRef.current.clear();

    // Only show permanent location categories (not events)
    const filtered = locations.filter(
      (loc) => loc.category !== "events" && activeCategories.has(loc.category),
    );

    // Check proximity to search center
    const inRadius = new Set<string>();
    if (searchCenter) {
      const center = L.latLng(searchCenter.lat, searchCenter.lng);
      for (const loc of filtered) {
        if (center.distanceTo(L.latLng(loc.lat, loc.lng)) <= 1500) {
          inRadius.add(loc.id);
        }
      }
    }

    for (const loc of filtered) {
      const meta = CATEGORY_META[loc.category];
      const isSelected = selectedLocation?.id === loc.id;
      const isHighlighted = highlightedVenueId === loc.id;
      const isNearby = inRadius.has(loc.id);
      const dimmed = searchCenter && !isNearby && !isSelected;
      const hasEvents = (venueEventCounts.get(loc.id) || 0) > 0;

      // Event ring — outer halo for venues with upcoming events
      if (hasEvents && !dimmed) {
        const ring = L.circleMarker([loc.lat, loc.lng], {
          radius: isHighlighted ? 18 : 14,
          fillColor: "#F59E0B",
          fillOpacity: isHighlighted ? 0.15 : 0.08,
          color: "#F59E0B",
          weight: isHighlighted ? 2 : 1.5,
          opacity: isHighlighted ? 0.8 : 0.4,
          className: isHighlighted
            ? "london-venue-ring-active"
            : "london-venue-ring",
        });
        ring.addTo(map);
        ringsRef.current.set(`ring-${loc.id}`, ring);
      }

      // Main marker
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: isSelected ? 10 : isHighlighted ? 10 : isNearby ? 9 : 7,
        fillColor: meta.color,
        fillOpacity: dimmed ? 0.2 : isSelected || isHighlighted ? 1 : 0.85,
        color:
          isSelected || isHighlighted
            ? "#14120B"
            : isNearby
              ? "#14120B"
              : "rgba(0,0,0,0.2)",
        weight: isSelected || isHighlighted ? 2.5 : isNearby ? 2 : 1,
        opacity: dimmed ? 0.3 : 1,
      });

      const eventCount = venueEventCounts.get(loc.id) || 0;
      const tooltipText =
        eventCount > 0
          ? `${loc.name} · ${eventCount} upcoming event${eventCount > 1 ? "s" : ""}`
          : loc.name;

      marker.bindTooltip(tooltipText, {
        className: "london-map-tooltip",
        direction: "top",
        offset: [0, -8],
      });

      marker.on("click", () => onSelectLocation(loc));

      marker.on("mouseover", () => {
        if (!isSelected) {
          marker.setRadius(10);
          marker.setStyle({ weight: 2, color: "#14120B", fillOpacity: 1 });
        }
      });

      marker.on("mouseout", () => {
        if (!isSelected) {
          marker.setRadius(isHighlighted ? 10 : isNearby ? 9 : 7);
          marker.setStyle({
            weight: isHighlighted ? 2.5 : isNearby ? 2 : 1,
            color: isHighlighted || isNearby ? "#14120B" : "rgba(0,0,0,0.2)",
            fillOpacity: dimmed ? 0.2 : 0.85,
          });
        }
      });

      marker.addTo(map);
      markersRef.current.set(loc.id, marker);
    }
  }, [
    locations,
    activeCategories,
    selectedLocation,
    onSelectLocation,
    searchCenter,
    venueEventCounts,
    highlightedVenueId,
  ]);

  // Search area circle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (searchCircleRef.current) {
      searchCircleRef.current.remove();
      searchCircleRef.current = null;
    }

    if (searchCenter) {
      const circle = L.circle([searchCenter.lat, searchCenter.lng], {
        radius: 1500,
        color: "#B307EB",
        weight: 2,
        opacity: 0.6,
        fillColor: "#B307EB",
        fillOpacity: 0.06,
        dashArray: "6 4",
        className: "london-search-circle",
      });
      circle.addTo(map);
      searchCircleRef.current = circle;
      map.flyTo([searchCenter.lat, searchCenter.lng], 14, { duration: 0.8 });
    }
  }, [searchCenter]);

  // Pan to selected
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 15, {
        duration: 0.6,
      });
    }
  }, [selectedLocation]);

  return (
    <>
      <style>{`
        .london-map-tooltip {
          background: #14120B;
          border: none;
          color: #fff;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .london-map-tooltip::before {
          border-top-color: #14120B !important;
        }
        .leaflet-control-zoom a {
          background: #fff !important;
          color: #14120B !important;
          border: 1px solid #e5e5e5 !important;
          border-radius: 0 !important;
          font-family: var(--font-mono), monospace !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f5f5f5 !important;
        }
        @keyframes venueRingPulse {
          0%, 100% { stroke-opacity: 0.4; fill-opacity: 0.08; }
          50% { stroke-opacity: 0.2; fill-opacity: 0.03; }
        }
        .london-venue-ring {
          animation: venueRingPulse 3s ease-in-out infinite;
        }
        @keyframes venueRingActive {
          0%, 100% { stroke-opacity: 0.8; fill-opacity: 0.15; }
          50% { stroke-opacity: 0.5; fill-opacity: 0.08; }
        }
        .london-venue-ring-active {
          animation: venueRingActive 1.5s ease-in-out infinite;
        }
        @keyframes searchGlow {
          0%, 100% { stroke-opacity: 0.6; }
          50% { stroke-opacity: 0.3; }
        }
        .london-search-circle {
          animation: searchGlow 3s ease-in-out infinite;
        }
      `}</style>
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
}
