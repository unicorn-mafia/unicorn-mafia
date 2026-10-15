import type { CalendarEvent } from "../_types/calendar";

export interface WeekData {
  weekOffset: number;
  mondayISO: string;
  sundayISO: string;
  events: CalendarEvent[];
}

export interface CalendarData {
  weeks: WeekData[];
  startOffset: number;
}

export interface EventsData {
  events: CalendarEvent[];
}

export async function loadCalendarEvents(
  weekOffset: number = 0,
): Promise<CalendarData> {
  try {
    const response = await fetch(`/api/calendar?weekOffset=${weekOffset}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch calendar events: ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading calendar events:", error);
    throw error;
  }
}

export async function loadEvents(): Promise<EventsData> {
  try {
    const response = await fetch("/api/calendar");
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading events:", error);
    throw error;
  }
}

// External event links get UTM params so hosts (e.g. Luma) can attribute
// signups to us; our links use rel="noreferrer", so no referrer is sent.
export function getEventLink(event: CalendarEvent): string | undefined {
  if (!event.externalUrl) return event.htmlLink;
  try {
    const url = new URL(event.externalUrl);
    if (!url.searchParams.has("utm_source")) {
      url.searchParams.set("utm_source", "unicrnmafia.com");
      url.searchParams.set("utm_medium", "referral");
    }
    return url.toString();
  } catch {
    return event.externalUrl;
  }
}

export function formatDateRange(event: CalendarEvent): string {
  const start = new Date(event.start.dateTime || event.start.date || "");
  const end = new Date(event.end.dateTime || event.end.date || "");

  const startDay = start
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .toUpperCase();
  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > 1) {
    const displayEnd = new Date(end);
    displayEnd.setDate(displayEnd.getDate() - 1);
    const displayEndLabel = displayEnd
      .toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
      .toUpperCase();
    if (startDay === displayEndLabel) return startDay;
    return `${startDay} — ${displayEndLabel}`;
  }

  const time = formatEventTime(event);
  return time ? `${startDay} · ${time}` : startDay;
}

export function formatEventTime(event: CalendarEvent): string {
  const start = event.start.dateTime || event.start.date;
  if (!start) return "";

  if (event.start.date && !event.start.dateTime) {
    return "ALL DAY";
  }

  const date = new Date(start);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDayHeader(date: Date): string {
  const day = date
    .toLocaleDateString("en-GB", { weekday: "short" })
    .toUpperCase();
  const dayNum = date.getDate();
  const month = date
    .toLocaleDateString("en-GB", { month: "short" })
    .toUpperCase();
  return `${day} ${dayNum} ${month}`;
}

export function formatWeekRange(mondayISO: string, sundayISO: string): string {
  const monday = new Date(mondayISO);
  const sunday = new Date(sundayISO);
  const monLabel = formatDayHeader(monday);
  const sunLabel = formatDayHeader(sunday);
  const year = sunday.getFullYear();
  return `${monLabel} — ${sunLabel} ${year}`;
}
