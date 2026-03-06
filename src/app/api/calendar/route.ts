import { NextResponse } from "next/server";
import type { RawGoogleEvent } from "../../_types/calendar";

// Fetch events from a single Google Calendar
async function fetchCalendarEvents(
  calendarId: string,
  apiKey: string,
  timeMin: Date,
  timeMax: Date,
): Promise<RawGoogleEvent[]> {
  const encodedId = encodeURIComponent(calendarId);
  const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodedId}/events`;
  const res = await fetch(
    `${baseUrl}?key=${apiKey}&singleEvents=true&orderBy=startTime&sanitizeHtml=true&timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&maxResults=100`,
  );
  if (!res.ok) {
    const errText = await res.text();
    console.error(
      `Google Calendar API error for ${calendarId}:`,
      res.status,
      errText,
    );
    return [];
  }
  const data = await res.json();
  return data.items || [];
}

// Extract first URL from event description or location
function extractUrl(event: {
  description?: string;
  location?: string;
}): string | null {
  const text = `${event.description || ""} ${event.location || ""}`;
  const urlRegex = /https?:\/\/[^\s<>"']+/gi;
  const matches = text.match(urlRegex);
  if (!matches) return null;
  for (const url of matches) {
    if (
      !url.includes("google.com/calendar") &&
      !url.includes("googleapis.com")
    ) {
      return url.replace(/[.,;)]+$/, "");
    }
  }
  return null;
}

// Fetch OG image from a URL
async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; bot)" },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const html = await res.text();
    const ogMatch =
      html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
      );
    return ogMatch ? ogMatch[1] : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const umCalendarId = process.env.GOOGLE_CALENDAR_ID;
  const communityCalendarId = process.env.GOOGLE_CALENDAR_ID_COMMUNITY;
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;

  if (!umCalendarId || !apiKey) {
    console.warn(
      "Missing GOOGLE_CALENDAR_ID or GOOGLE_CALENDAR_API_KEY env vars",
    );
    return NextResponse.json({ events: [] });
  }

  try {
    // Fetch a broad range of events: 6 months past to 6 months future
    const now = new Date();
    const timeMin = new Date(now);
    timeMin.setMonth(timeMin.getMonth() - 6);
    const timeMax = new Date(now);
    timeMax.setMonth(timeMax.getMonth() + 6);

    // Fetch both calendars in parallel
    const [umRawEvents, communityRawEvents] = await Promise.all([
      fetchCalendarEvents(umCalendarId, apiKey, timeMin, timeMax),
      communityCalendarId
        ? fetchCalendarEvents(communityCalendarId, apiKey, timeMin, timeMax)
        : Promise.resolve([]),
    ]);

    // Enrich events, tagging by source calendar
    const enrichUM = umRawEvents.map(async (event) => {
      const externalUrl = extractUrl(event);
      const imageUrl = externalUrl ? await fetchOgImage(externalUrl) : null;
      return {
        ...event,
        externalUrl: externalUrl || undefined,
        imageUrl: imageUrl || undefined,
        hostedByUM: true,
      };
    });

    const enrichCommunity = communityRawEvents.map(async (event) => {
      const externalUrl = extractUrl(event);
      const imageUrl = externalUrl ? await fetchOgImage(externalUrl) : null;
      return {
        ...event,
        externalUrl: externalUrl || undefined,
        imageUrl: imageUrl || undefined,
        hostedByUM: false,
      };
    });

    const enrichedEvents = await Promise.all([...enrichUM, ...enrichCommunity]);

    // Sort: newest first (by start date descending)
    enrichedEvents.sort((a, b) => {
      const aDate = new Date(a.start.dateTime || a.start.date || "");
      const bDate = new Date(b.start.dateTime || b.start.date || "");
      return bDate.getTime() - aDate.getTime();
    });

    return NextResponse.json(
      { events: enrichedEvents },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 },
    );
  }
}
