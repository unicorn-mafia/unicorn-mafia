"use client";

import { useMemo, useState, useCallback } from "react";
import type { LondonLocation, LocationCategory } from "../../_types/london";
import { CATEGORY_META } from "../../_types/london";
import { geocodeSearch } from "../../_lib/london-data";

interface SidebarProps {
  locations: LondonLocation[];
  activeCategories: Set<LocationCategory>;
  onToggleCategory: (cat: LocationCategory) => void;
  selectedLocation: LondonLocation | null;
  onSelectLocation: (loc: LondonLocation) => void;
  onSearchArea: (center: { lat: number; lng: number } | null) => void;
  searchCenter: { lat: number; lng: number } | null;
  nearbyIds: Set<string>;
}

const CATEGORY_ORDER: LocationCategory[] = [
  "coworking",
  "vc",
  "startup",
  "bigtech",
];

export function Sidebar({
  locations,
  activeCategories,
  onToggleCategory,
  selectedLocation,
  onSelectLocation,
  onSearchArea,
  searchCenter,
  nearbyIds,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const [postcodeQuery, setPostcodeQuery] = useState("");
  const [postcodeLabel, setPostcodeLabel] = useState("");
  const [searching, setSearching] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const loc of locations) {
      c[loc.category] = (c[loc.category] || 0) + 1;
    }
    return c;
  }, [locations]);

  const filtered = useMemo(() => {
    let result = locations.filter((loc) => activeCategories.has(loc.category));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.area.toLowerCase().includes(q) ||
          (loc.tagline || "").toLowerCase().includes(q) ||
          (loc.stages || "").toLowerCase().includes(q),
      );
    }
    // If searching by area, show nearby first
    if (searchCenter) {
      result.sort((a, b) => {
        const aNear = nearbyIds.has(a.id) ? 0 : 1;
        const bNear = nearbyIds.has(b.id) ? 0 : 1;
        return aNear - bNear;
      });
    }
    return result;
  }, [locations, activeCategories, search, searchCenter, nearbyIds]);

  const grouped = useMemo(() => {
    if (searchCenter) {
      // When searching by area, show nearby vs far
      const nearby = filtered.filter((l) => nearbyIds.has(l.id));
      const far = filtered.filter((l) => !nearbyIds.has(l.id));
      const groups: {
        category: string;
        label: string;
        items: LondonLocation[];
        dimmed?: boolean;
      }[] = [];
      if (nearby.length)
        groups.push({ category: "nearby", label: "NEARBY", items: nearby });
      if (far.length)
        groups.push({
          category: "other",
          label: "FURTHER AWAY",
          items: far,
          dimmed: true,
        });
      return groups;
    }
    const groups: {
      category: string;
      label: string;
      items: LondonLocation[];
      dimmed?: boolean;
    }[] = [];
    for (const cat of CATEGORY_ORDER) {
      const items = filtered.filter((l) => l.category === cat);
      if (items.length > 0)
        groups.push({
          category: cat,
          label: CATEGORY_META[cat].label,
          items,
        });
    }
    return groups;
  }, [filtered, searchCenter, nearbyIds]);

  const handlePostcodeSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!postcodeQuery.trim()) {
        onSearchArea(null);
        setPostcodeLabel("");
        return;
      }
      setSearching(true);
      try {
        const result = await geocodeSearch(postcodeQuery);
        if (result) {
          onSearchArea({ lat: result.lat, lng: result.lng });
          setPostcodeLabel(result.label);
        } else {
          setPostcodeLabel("NOT FOUND");
          onSearchArea(null);
        }
      } finally {
        setSearching(false);
      }
    },
    [postcodeQuery, onSearchArea],
  );

  const clearPostcode = useCallback(() => {
    setPostcodeQuery("");
    setPostcodeLabel("");
    onSearchArea(null);
  }, [onSearchArea]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <h1 className="text-lg font-mono font-bold text-neutral-900 tracking-wide mb-1">
          LONDON
        </h1>
        <p className="text-[10px] font-mono text-neutral-400 tracking-widest">
          {locations.length} LOCATIONS · TECH ECOSYSTEM
        </p>
      </div>

      {/* Postcode search */}
      <form
        onSubmit={handlePostcodeSearch}
        className="px-4 py-3 border-b border-neutral-200"
      >
        <label className="text-[9px] font-mono font-medium text-neutral-400 tracking-[0.15em] block mb-1.5">
          FIND YOUR AREA
        </label>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={postcodeQuery}
            onChange={(e) => setPostcodeQuery(e.target.value)}
            placeholder="POSTCODE E.G. EC2A 4NE"
            className="flex-1 text-[11px] font-mono tracking-wide text-neutral-900 placeholder:text-neutral-300 bg-neutral-50 border border-neutral-200 px-2.5 py-1.5 outline-none focus:border-neutral-400 transition-colors"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-3 py-1.5 bg-neutral-900 text-white text-[10px] font-mono tracking-widest hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {searching ? "..." : "GO"}
          </button>
        </div>
        {postcodeLabel && (
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] font-mono text-[#B307EB] tracking-wide">
              {postcodeLabel}
            </span>
            <button
              type="button"
              onClick={clearPostcode}
              className="text-[10px] font-mono text-neutral-400 hover:text-neutral-900 tracking-wide underline"
            >
              CLEAR
            </button>
          </div>
        )}
      </form>

      {/* Category pills */}
      <div className="px-4 py-3 border-b border-neutral-200">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = activeCategories.has(cat);
            const count = counts[cat] || 0;
            if (count === 0 && cat === "events") return null;
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-wide transition-all border ${
                  active
                    ? "border-neutral-900 text-neutral-900"
                    : "border-neutral-200 text-neutral-400"
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full transition-opacity"
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

      {/* Text filter */}
      <div className="px-4 py-2 border-b border-neutral-200">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="FILTER BY NAME..."
          className="w-full text-[11px] font-mono tracking-wide text-neutral-900 placeholder:text-neutral-300 bg-transparent outline-none py-1"
        />
      </div>

      {/* Location list */}
      <div className="flex-1 overflow-y-auto">
        {grouped.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[10px] font-mono text-neutral-400 tracking-widest">
              NO LOCATIONS FOUND
            </p>
          </div>
        ) : (
          grouped.map(({ category, label, items, dimmed }) => (
            <div key={category} className={dimmed ? "opacity-40" : ""}>
              <div className="px-4 pt-3 pb-1 sticky top-0 bg-white z-10">
                <h2 className="text-[9px] font-mono font-medium text-neutral-400 tracking-[0.15em]">
                  {label}
                  <span className="ml-1.5 text-neutral-300">
                    {items.length}
                  </span>
                </h2>
              </div>
              {items.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => onSelectLocation(loc)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-2.5 border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                    selectedLocation?.id === loc.id ? "bg-neutral-50" : ""
                  }`}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      backgroundColor: CATEGORY_META[loc.category].color,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-medium text-neutral-900 tracking-wide truncate">
                      {loc.name}
                    </p>
                    <p className="text-[10px] font-mono text-neutral-400 tracking-wide truncate">
                      {loc.area}
                      {loc.stages
                        ? ` · ${loc.stages}`
                        : loc.tagline
                          ? ` — ${loc.tagline}`
                          : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
