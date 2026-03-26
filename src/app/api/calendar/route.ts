import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import type { RawGoogleEvent, CalendarEvent } from "../../_types/calendar";

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

// Unwrap Google redirect URLs (google.com/url?q=actualUrl)
function unwrapGoogleRedirect(url: string): string {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes("google.com") &&
      parsed.pathname === "/url" &&
      parsed.searchParams.has("q")
    ) {
      return parsed.searchParams.get("q")!;
    }
  } catch {
    // not a valid URL, return as-is
  }
  return url;
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
  for (const rawUrl of matches) {
    const cleaned = rawUrl.replace(/[.,;)]+$/, "");
    const url = unwrapGoogleRedirect(cleaned);
    if (
      !url.includes("google.com/calendar") &&
      !url.includes("googleapis.com") &&
      !url.includes("google.com/url")
    ) {
      return url;
    }
  }
  return null;
}

// Try Luma API for event cover image
async function fetchLumaImage(url: string): Promise<string | null> {
  try {
    const match = url.match(/luma\.com\/([a-zA-Z0-9-]+)/);
    if (!match) return null;
    const slug = match[1];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://api.lu.ma/url?url=${encodeURIComponent(`https://lu.ma/${slug}`)}`,
      {
        signal: controller.signal,
        headers: { accept: "application/json" },
      },
    );
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.event?.cover_url || null;
  } catch {
    return null;
  }
}

// Fetch OG image from a URL
async function fetchOgImage(url: string): Promise<string | null> {
  // Try Luma API first for luma.com URLs
  if (url.includes("luma.com") || url.includes("lu.ma")) {
    const lumaImage = await fetchLumaImage(url);
    if (lumaImage) return lumaImage;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
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
    if (!ogMatch) return null;
    // Decode HTML entities (e.g. &amp; -> &)
    const ogUrl = ogMatch[1]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // For Luma OG URLs, extract the actual poster from the img= parameter
    if (ogUrl.includes("og.luma.com")) {
      try {
        const imgParam = new URL(ogUrl).searchParams.get("img");
        if (imgParam) return imgParam;
      } catch {
        // fall through to return full OG URL
      }
    }

    return ogUrl;
  } catch {
    return null;
  }
}

interface CommunityEventYaml {
  name: string;
  start: string;
  end: string;
  cover: string;
  location: string;
  url: string;
  featured?: boolean;
  borderColors?: string[];
}

function loadCommunityEventsFromYaml(): CalendarEvent[] {
  try {
    const filePath = join(process.cwd(), "public", "community-events.yaml");
    const content = readFileSync(filePath, "utf-8");
    const events = yaml.load(content) as CommunityEventYaml[];
    if (!Array.isArray(events)) return [];

    return events.map((e, i) => ({
      id: `community-yaml-${i}`,
      summary: e.name,
      location: e.location || undefined,
      start: { dateTime: e.start },
      end: { dateTime: e.end },
      htmlLink: e.url,
      externalUrl: e.url,
      imageUrl: e.cover || undefined,
      hostedByUM: false,
      featured: e.featured || false,
      borderColors: e.borderColors || undefined,
    }));
  } catch (err) {
    console.error("Failed to load community-events.yaml:", err);
    return [];
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

    // Load community events from YAML and merge (dedup by URL)
    const yamlEvents = loadCommunityEventsFromYaml();
    const existingUrls = new Set(
      enrichedEvents.map((e) => e.externalUrl).filter(Boolean),
    );
    const newYamlEvents = yamlEvents
      .filter((e) => !existingUrls.has(e.externalUrl))
      .map((e) => ({
        ...e,
        externalUrl: e.externalUrl || undefined,
        imageUrl: e.imageUrl || undefined,
      }));
    enrichedEvents.push(...newYamlEvents);

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
