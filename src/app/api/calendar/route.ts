import { NextResponse } from "next/server";

const CALENDAR_ID =
  "bd7d0051661085245197d1e689f90ae11a791735595bcd0f0a34a4aad4722d95@group.calendar.google.com";

// Known event overrides — matched by substring in summary
const KNOWN_EVENTS: Record<
  string,
  { externalUrl: string; imageUrl: string; hostedByUM?: boolean }
> = {
  HackEurope: {
    externalUrl: "https://luma.com/london-hackathon?tk=xy9L0p",
    imageUrl:
      "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=500,height=500/event-covers/hh/7b10d668-43f4-45b7-a534-4641c4ac432b.png",
  },
  "START Hack": {
    externalUrl: "https://starthack.eu/#/application?event_id=7",
    imageUrl:
      "https://framerusercontent.com/assets/KAQO6ZUrn6oWZg1A6KQkyx8Hi4.webp",
  },
};

// Keywords that indicate an event is hosted by Unicorn Mafia
const UM_KEYWORDS = ["unicorn mafia", "unicorn-mafia", "[um]", "hosted by um"];

function isHostedByUM(event: {
  summary: string;
  description?: string;
}): boolean {
  const text = `${event.summary} ${event.description || ""}`.toLowerCase();
  // Check exact keywords
  if (UM_KEYWORDS.some((kw) => text.includes(kw))) return true;
  // Check for standalone "um" as a word (e.g. "UM Turns 1 Party")
  if (/\bum\b/.test(text)) return true;
  return false;
}

function getKnownOverride(summary: string) {
  for (const [key, value] of Object.entries(KNOWN_EVENTS)) {
    if (summary.includes(key)) return value;
  }
  return null;
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

interface RawEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  htmlLink: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
}

export async function GET() {
  const encodedId = encodeURIComponent(CALENDAR_ID);
  const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodedId}/events`;
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    // Fetch a broad range of events: 6 months past to 6 months future
    const now = new Date();
    const timeMin = new Date(now);
    timeMin.setMonth(timeMin.getMonth() - 6);
    const timeMax = new Date(now);
    timeMax.setMonth(timeMax.getMonth() + 6);

    const res = await fetch(
      `${baseUrl}?key=${apiKey}&singleEvents=true&orderBy=startTime&sanitizeHtml=true&calendarId=${encodedId}&timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&maxResults=100`,
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Google Calendar API response:", res.status, errText);
      throw new Error("Failed to fetch from Google Calendar API");
    }

    const data = await res.json();
    const rawEvents: RawEvent[] = data.items || [];

    // Enrich events
    const enrichedEvents = await Promise.all(
      rawEvents.map(async (event) => {
        const override = getKnownOverride(event.summary);
        const hostedByUM =
          isHostedByUM(event) || (override?.hostedByUM ?? false);

        if (override) {
          return {
            ...event,
            externalUrl: override.externalUrl,
            imageUrl: override.imageUrl,
            hostedByUM,
          };
        }

        const externalUrl = extractUrl(event);
        let imageUrl: string | null = null;
        if (externalUrl) {
          imageUrl = await fetchOgImage(externalUrl);
        }

        return {
          ...event,
          externalUrl: externalUrl || undefined,
          imageUrl: imageUrl || undefined,
          hostedByUM,
        };
      }),
    );

    // Sort: upcoming first (by start date descending so newest first)
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
