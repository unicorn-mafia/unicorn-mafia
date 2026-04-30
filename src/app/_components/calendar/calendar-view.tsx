"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { CalendarEvent } from "../../_types/calendar";

export interface WeekGridHandle {
  scrollDays: (n: number) => void;
  scrollToToday: () => void;
}

export type CalendarMode = "week" | "month";

interface CalendarViewProps {
  events: CalendarEvent[];
  mode: CalendarMode;
  onModeChange: (m: CalendarMode) => void;
  weekOffset: number;
  monthOffset: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function stripLeadingEmojis(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, "")
    .trim();
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getMonthGridStart(monthOffset: number): {
  gridStart: Date;
  viewMonth: number;
  viewYear: number;
} {
  const now = new Date();
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const viewMonth = viewDate.getMonth();
  const viewYear = viewDate.getFullYear();
  const dayOfWeek = viewDate.getDay();
  const daysBack = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const gridStart = new Date(viewDate);
  gridStart.setDate(viewDate.getDate() - daysBack);
  return { gridStart, viewMonth, viewYear };
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function groupEventsByDay(
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const start = new Date(e.start.dateTime || e.start.date || "");
    const k = dayKey(start);
    const arr = map.get(k) ?? [];
    arr.push(e);
    map.set(k, arr);
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => {
      const aTime = new Date(a.start.dateTime || a.start.date || "").getTime();
      const bTime = new Date(b.start.dateTime || b.start.date || "").getTime();
      return aTime - bTime;
    });
  }
  return map;
}

function EventChip({ event }: { event: CalendarEvent }) {
  const start = new Date(event.start.dateTime || event.start.date || "");
  const linkUrl = event.externalUrl || event.htmlLink;
  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-neutral-300 bg-white p-1.5 hover:bg-neutral-50 hover:border-neutral-500 transition-colors group"
    >
      <div className="text-[9px] font-body text-neutral-500 tracking-wide mb-0.5">
        {formatTime(start)}
      </div>
      <div className="text-[11px] font-body text-neutral-900 leading-tight line-clamp-3 group-hover:underline">
        {stripLeadingEmojis(event.summary)}
      </div>
      {event.hostedByUM && (
        <div className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[#B307EB]" />
      )}
    </a>
  );
}

function DayEventList({ day, events }: { day: Date; events: CalendarEvent[] }) {
  const isToday = isSameDay(day, new Date());
  const dayLabel = day
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    })
    .toUpperCase();

  return (
    <div className="border border-neutral-300 mt-4">
      <div
        className={`px-3 py-2 border-b border-neutral-300 ${
          isToday ? "bg-neutral-900 text-white" : "bg-neutral-50"
        }`}
      >
        <span
          className={`text-[10px] font-body font-medium tracking-widest ${
            isToday ? "text-white" : "text-neutral-700"
          }`}
        >
          {isToday ? `TODAY · ${dayLabel}` : dayLabel}
        </span>
      </div>
      {events.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs font-body text-neutral-400 tracking-wide">
            NO EVENTS THIS DAY
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200">
          {events.map((event) => {
            const start = new Date(
              event.start.dateTime || event.start.date || "",
            );
            const linkUrl = event.externalUrl || event.htmlLink;
            return (
              <a
                key={event.id}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-3 py-2.5 hover:bg-neutral-50 transition-colors"
              >
                <div className="text-[10px] font-body text-neutral-500 tracking-wide pt-0.5 w-12 flex-shrink-0">
                  {formatTime(start)}
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <span className="text-xs font-body text-neutral-900 leading-snug">
                    {stripLeadingEmojis(event.summary)}
                  </span>
                  {event.hostedByUM && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B307EB] flex-shrink-0" />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Continuous infinite-feel scroll: render a wide range of days as a single
// horizontal strip. User scrolls smoothly through individual days; prev/next
// buttons scroll by 7 days at a time.
const DAYS_BACK = 7 * 8; // 8 weeks of history
const DAYS_FORWARD = 7 * 16; // 16 weeks ahead
const TOTAL_DAYS = DAYS_BACK + DAYS_FORWARD;

const WeekGrid = forwardRef<WeekGridHandle, { events: CalendarEvent[] }>(
  function WeekGrid({ events }, ref) {
    const today = new Date();
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const start = new Date(todayMidnight);
    start.setDate(todayMidnight.getDate() - DAYS_BACK);

    const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });

    const eventsByDay = groupEventsByDay(events);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to today on mount (instant, no animation)
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const colWidth = el.scrollWidth / TOTAL_DAYS;
      el.scrollLeft = DAYS_BACK * colWidth;
    }, []);

    // Convert vertical mouse wheel into horizontal scroll, but only when the
    // user's gesture is dominantly vertical (regular mouse) and we have room
    // to scroll horizontally. Lets shift-less mouse users navigate the strip.
    const onWheel = useCallback((e: React.WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // already horizontal — let native handle
      const el = containerRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = el.scrollLeft + e.deltaY;
      if (
        (e.deltaY < 0 && el.scrollLeft <= 0) ||
        (e.deltaY > 0 && el.scrollLeft >= max)
      ) {
        return; // at edge — let page scroll vertically
      }
      e.preventDefault();
      el.scrollLeft = Math.max(0, Math.min(max, next));
    }, []);

    useImperativeHandle(ref, () => ({
      scrollDays: (n: number) => {
        const el = containerRef.current;
        if (!el) return;
        const colWidth = el.scrollWidth / TOTAL_DAYS;
        el.scrollBy({ left: n * colWidth, behavior: "smooth" });
      },
      scrollToToday: () => {
        const el = containerRef.current;
        if (!el) return;
        const colWidth = el.scrollWidth / TOTAL_DAYS;
        el.scrollTo({ left: DAYS_BACK * colWidth, behavior: "smooth" });
      },
    }));

    return (
      <div
        ref={containerRef}
        onWheel={onWheel}
        className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        <div className="flex border-l border-t border-neutral-300">
          {days.map((day) => {
            const isToday = isSameDay(day, today);
            const dayEvents = eventsByDay.get(dayKey(day)) ?? [];
            const dayLabel = day
              .toLocaleDateString("en-GB", { weekday: "short" })
              .toUpperCase();
            const dayNum = day.getDate();
            const monthLabel = day
              .toLocaleDateString("en-GB", { month: "short" })
              .toUpperCase();
            const isFirstOfMonth = day.getDate() === 1;

            return (
              <div
                key={day.toISOString()}
                className="relative flex-shrink-0 w-[140px] md:w-[180px] lg:w-[220px] border-r border-b border-neutral-300 min-h-[320px] flex flex-col snap-start"
              >
                <div
                  className={`px-2.5 py-2.5 border-b ${
                    isToday
                      ? "bg-neutral-900 border-neutral-900"
                      : "bg-neutral-50 border-neutral-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`text-[9px] font-body tracking-widest ${
                        isToday ? "text-white/70" : "text-neutral-400"
                      }`}
                    >
                      {dayLabel}
                    </div>
                    {isToday && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B307EB] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B307EB]" />
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span
                      className={`text-sm font-body font-medium ${
                        isToday ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {isFirstOfMonth && (
                      <span
                        className={`text-[9px] tracking-widest ${
                          isToday ? "text-white/70" : "text-neutral-400"
                        }`}
                      >
                        {monthLabel}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 p-1.5 space-y-1.5 overflow-hidden">
                  {dayEvents.map((event) => (
                    <EventChip key={event.id} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

function MonthGrid({
  events,
  monthOffset,
}: {
  events: CalendarEvent[];
  monthOffset: number;
}) {
  const { gridStart, viewMonth } = getMonthGridStart(monthOffset);
  const today = new Date();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  const eventsByDay = groupEventsByDay(events);

  const weekdayHeaders = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const selectedDay =
    selectedKey === null
      ? null
      : (cells.find((c) => dayKey(c) === selectedKey) ?? null);
  const selectedEvents =
    selectedDay !== null ? (eventsByDay.get(dayKey(selectedDay)) ?? []) : [];

  return (
    <>
      <div>
        <div className="grid grid-cols-7 border-l border-t border-neutral-300">
          {weekdayHeaders.map((h) => (
            <div
              key={h}
              className="border-r border-b border-neutral-300 bg-neutral-50 px-2 py-2 text-[9px] font-body tracking-widest text-neutral-400"
            >
              {h}
            </div>
          ))}
          {cells.map((day) => {
            const isToday = isSameDay(day, today);
            const inMonth = day.getMonth() === viewMonth;
            const k = dayKey(day);
            const dayEvents = eventsByDay.get(k) ?? [];
            const visible = dayEvents.slice(0, 2);
            const overflow = dayEvents.length - visible.length;
            const isSelected = k === selectedKey;

            return (
              <button
                key={day.toISOString()}
                onClick={() =>
                  setSelectedKey((curr) => (curr === k ? null : k))
                }
                className={`border-r border-b border-neutral-300 min-h-[110px] p-1.5 flex flex-col gap-1 text-left transition-colors ${
                  inMonth ? "bg-white" : "bg-neutral-50/50"
                } ${isSelected ? "ring-2 ring-inset ring-neutral-900" : "hover:bg-neutral-50"}`}
              >
                <div
                  className={`text-[11px] font-body font-medium leading-none flex-shrink-0 ${
                    isToday
                      ? "inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white"
                      : inMonth
                        ? "text-neutral-900 px-1"
                        : "text-neutral-400 px-1"
                  }`}
                >
                  {day.getDate()}
                </div>
                <div className="flex-1 space-y-1 overflow-hidden w-full">
                  {visible.map((event) => (
                    <EventChip key={event.id} event={event} />
                  ))}
                  {overflow > 0 && (
                    <div className="text-[9px] font-body text-neutral-500 tracking-wide px-1">
                      +{overflow} MORE
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day events — useful for "+N MORE" overflow */}
      {selectedDay !== null && (
        <DayEventList day={selectedDay} events={selectedEvents} />
      )}
    </>
  );
}

export function CalendarView({
  events,
  mode,
  onModeChange,
  monthOffset,
  onPrev,
  onNext,
  onToday,
}: CalendarViewProps) {
  const weekGridRef = useRef<WeekGridHandle>(null);

  // In week mode the grid has its own continuous scroll, so prev/next/today
  // drive the grid directly instead of incrementing weekOffset.
  const handlePrev =
    mode === "week" ? () => weekGridRef.current?.scrollDays(-7) : onPrev;
  const handleNext =
    mode === "week" ? () => weekGridRef.current?.scrollDays(7) : onNext;
  const handleToday =
    mode === "week" ? () => weekGridRef.current?.scrollToToday() : onToday;

  let rangeLabel = "";
  if (mode === "month") {
    const now = new Date();
    const viewDate = new Date(
      now.getFullYear(),
      now.getMonth() + monthOffset,
      1,
    );
    rangeLabel = viewDate
      .toLocaleDateString("en-GB", { month: "long", year: "numeric" })
      .toUpperCase();
  } else {
    // Week mode: show the current calendar week's Mon–Sun span
    const now = new Date();
    const dow = now.getDay();
    const back = dow === 0 ? 6 : dow - 1;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    monday.setDate(monday.getDate() - back);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    rangeLabel = `${monday
      .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      .toUpperCase()} — ${sunday
      .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      .toUpperCase()} ${sunday.getFullYear()}`;
  }
  const showTodayHighlight = mode === "month" && monthOffset === 0;

  return (
    <div>
      {/* Top controls */}
      <div className="flex items-center justify-between mb-4 px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrev}
            className="px-2 py-1.5 border border-neutral-300 hover:bg-neutral-100 transition-colors"
            aria-label={mode === "week" ? "Previous week" : "Previous month"}
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3 text-neutral-700"
            >
              <path d="M10.5 3.5L5.5 8l5 4.5V3.5z" />
            </svg>
          </button>
          <button
            onClick={handleToday}
            className={`px-3 py-1.5 text-[10px] font-body tracking-wide border border-neutral-300 transition-colors ${
              showTodayHighlight
                ? "bg-neutral-900 text-white border-neutral-900"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            TODAY
          </button>
          <button
            onClick={handleNext}
            className="px-2 py-1.5 border border-neutral-300 hover:bg-neutral-100 transition-colors"
            aria-label={mode === "week" ? "Next week" : "Next month"}
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3 text-neutral-700"
            >
              <path d="M5.5 3.5L10.5 8l-5 4.5V3.5z" />
            </svg>
          </button>
          {rangeLabel && (
            <span className="text-xs font-body text-neutral-700 tracking-wide ml-1 sm:ml-2">
              {rangeLabel}
            </span>
          )}
        </div>

        {/* Week / Month toggle */}
        <div className="flex border border-neutral-300">
          {(
            [
              ["week", "WEEK"],
              ["month", "MONTH"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => onModeChange(value)}
              className={`px-3 py-1.5 text-[10px] font-body tracking-wide transition-colors ${
                mode === value
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === "week" ? (
        <WeekGrid ref={weekGridRef} events={events} />
      ) : (
        <MonthGrid events={events} monthOffset={monthOffset} />
      )}
    </div>
  );
}
