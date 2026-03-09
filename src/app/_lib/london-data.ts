import type { LondonLocation } from "../_types/london";
import type { CalendarEvent } from "../_types/calendar";

// Known London venue coordinates for mapping calendar events to the map
const VENUE_COORDINATES: Record<string, [number, number]> = {
  "second home": [51.5247, -0.078],
  plexal: [51.5387, -0.0083],
  "google for startups": [51.5256, -0.0854],
  "campus london": [51.5256, -0.0854],
  "huckletree shoreditch": [51.5268, -0.0792],
  "huckletree white city": [51.512, -0.2245],
  techhub: [51.5257, -0.0878],
  "runway east": [51.5142, -0.1348],
  "encode hub": [51.5274, -0.0855],
  "founders factory": [51.5163, -0.1357],
  uncommon: [51.5057, -0.0892],
  "powerleague shoreditch": [51.5237, -0.0759],
  shoreditch: [51.5264, -0.0803],
  "old street": [51.5256, -0.0875],
  "king's cross": [51.5322, -0.1243],
  "kings cross": [51.5322, -0.1243],
  soho: [51.5137, -0.1337],
  moorgate: [51.5186, -0.0886],
  "finsbury square": [51.5178, -0.0882],
  "somerset house": [51.5113, -0.1174],
  angel: [51.5322, -0.1058],
  farringdon: [51.5203, -0.1053],
  "south bank": [51.5058, -0.1164],
  whitechapel: [51.5155, -0.0715],
  bermondsey: [51.4979, -0.0637],
  camberley: [51.3371, -0.7424],
};

export async function loadLocations(): Promise<LondonLocation[]> {
  const res = await fetch("/api/london");
  if (!res.ok) throw new Error("Failed to load locations");
  const data = await res.json();
  return data.locations;
}

export function calendarEventsToLocations(
  events: CalendarEvent[],
): LondonLocation[] {
  const now = new Date();
  const thirtyDaysOut = new Date(now);
  thirtyDaysOut.setDate(thirtyDaysOut.getDate() + 60);

  return events
    .filter((e) => {
      const start = new Date(e.start.dateTime || e.start.date || "");
      return start >= now && start <= thirtyDaysOut;
    })
    .map((e) => {
      const loc = (e.location || "").toLowerCase();
      let coords: [number, number] | null = null;
      for (const [venue, c] of Object.entries(VENUE_COORDINATES)) {
        if (loc.includes(venue)) {
          coords = c;
          break;
        }
      }
      if (!coords) return null;

      const start = new Date(e.start.dateTime || e.start.date || "");
      return {
        id: `event-${e.id}`,
        name: e.summary,
        category: "events" as const,
        lat: coords[0],
        lng: coords[1],
        area: e.location || "London",
        url: e.externalUrl || e.htmlLink || "",
        tagline: start
          .toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
          .toUpperCase(),
        eventDate: e.start.dateTime || e.start.date,
      };
    })
    .filter(Boolean) as LondonLocation[];
}

// Geocode a UK postcode or area name using postcodes.io (free, no key needed)
export async function geocodeSearch(
  query: string,
): Promise<{ lat: number; lng: number; label: string } | null> {
  const trimmed = query.trim().toUpperCase();
  if (!trimmed) return null;

  // Try as postcode first (postcodes.io)
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`,
    );
    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        return {
          lat: data.result.latitude,
          lng: data.result.longitude,
          label: `${data.result.postcode} — ${data.result.admin_ward || data.result.admin_district}`,
        };
      }
    }
  } catch {
    // not a postcode
  }

  // Try partial/autocomplete postcode
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}/autocomplete`,
    );
    if (res.ok) {
      const data = await res.json();
      if (data.result && data.result.length > 0) {
        // Lookup the first match
        const pcRes = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(data.result[0])}`,
        );
        if (pcRes.ok) {
          const pcData = await pcRes.json();
          if (pcData.result) {
            return {
              lat: pcData.result.latitude,
              lng: pcData.result.longitude,
              label: `${pcData.result.postcode} — ${pcData.result.admin_ward || pcData.result.admin_district}`,
            };
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return null;
}
