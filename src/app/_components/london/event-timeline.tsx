"use client";

import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import type { CalendarEvent } from "../../_types/calendar";

interface EventTimelineProps {
  events: CalendarEvent[];
  hoveredEventId: string | null;
  onHoverEvent: (id: string | null) => void;
  onClickEvent: (event: CalendarEvent) => void;
}

function groupByDate(events: CalendarEvent[]) {
  const groups: {
    dateLabel: string;
    dateKey: string;
    events: CalendarEvent[];
  }[] = [];
  const map = new Map<string, CalendarEvent[]>();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (const event of events) {
    const start = new Date(event.start.dateTime || event.start.date || "");
    const key = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(event);
  }

  for (const [key, dayEvents] of map) {
    const start = new Date(
      dayEvents[0].start.dateTime || dayEvents[0].start.date || "",
    );
    const isToday =
      start.getFullYear() === today.getFullYear() &&
      start.getMonth() === today.getMonth() &&
      start.getDate() === today.getDate();
    const isTomorrow =
      start.getFullYear() === tomorrow.getFullYear() &&
      start.getMonth() === tomorrow.getMonth() &&
      start.getDate() === tomorrow.getDate();

    let dateLabel: string;
    if (isToday) {
      dateLabel = "TODAY";
    } else if (isTomorrow) {
      dateLabel = "TOMORROW";
    } else {
      dateLabel = start
        .toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
        .toUpperCase();
    }

    groups.push({ dateLabel, dateKey: key, events: dayEvents });
  }

  return groups;
}

function stripLeadingEmojis(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, "")
    .trim();
}

function formatTime(event: CalendarEvent): string {
  const start = event.start.dateTime;
  if (!start) return "";
  const d = new Date(start);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function EventTimeline({
  events,
  hoveredEventId,
  onHoverEvent,
  onClickEvent,
}: EventTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const upcoming = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => {
        const start = new Date(e.start.dateTime || e.start.date || "");
        return start >= now;
      })
      .sort((a, b) => {
        const aDate = new Date(a.start.dateTime || a.start.date || "");
        const bDate = new Date(b.start.dateTime || b.start.date || "");
        return aDate.getTime() - bDate.getTime();
      })
      .slice(0, 30);
  }, [events]);

  const groups = useMemo(() => groupByDate(upcoming), [upcoming]);

  if (upcoming.length === 0) return null;

  return (
    <div className="border-t border-neutral-200 bg-white overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="text-[9px] font-mono font-medium text-neutral-400 tracking-[0.15em]">
            UPCOMING EVENTS
          </span>
          <span className="text-[9px] font-mono text-neutral-300">
            {upcoming.length}
          </span>
        </div>
        <a
          href="/e"
          className="text-[9px] font-mono text-neutral-400 hover:text-neutral-900 tracking-widest transition-colors"
        >
          VIEW ALL →
        </a>
      </div>

      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {groups.map(({ dateLabel, dateKey, events: dayEvents }) => (
          <div
            key={dateKey}
            className="flex-shrink-0 border-r border-neutral-100 last:border-r-0"
          >
            {/* Date header */}
            <div className="px-3 py-1.5 bg-neutral-50 border-b border-neutral-100 sticky left-0">
              <span className="text-[9px] font-mono font-bold text-neutral-900 tracking-[0.12em]">
                {dateLabel}
              </span>
            </div>

            {/* Event cards for this date */}
            <div className="flex">
              {dayEvents.map((event) => {
                const isHovered = hoveredEventId === event.id;
                const time = formatTime(event);

                return (
                  <motion.button
                    key={event.id}
                    onClick={() => onClickEvent(event)}
                    onMouseEnter={() => onHoverEvent(event.id)}
                    onMouseLeave={() => onHoverEvent(null)}
                    className={`flex-shrink-0 w-48 text-left px-3 py-2.5 border-r border-neutral-50 transition-colors ${
                      isHovered
                        ? "bg-neutral-50"
                        : "bg-white hover:bg-neutral-50/50"
                    }`}
                    whileHover={{ y: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {/* Time */}
                    {time && (
                      <p className="text-[9px] font-mono text-neutral-400 tracking-widest mb-0.5">
                        {time}
                      </p>
                    )}

                    {/* Title */}
                    <p className="text-[11px] font-mono font-medium text-neutral-900 tracking-wide leading-tight truncate">
                      {stripLeadingEmojis(event.summary)}
                    </p>

                    {/* Location */}
                    {event.location && (
                      <p className="text-[9px] font-mono text-neutral-400 tracking-wide mt-0.5 truncate">
                        {event.location}
                      </p>
                    )}

                    {/* UM badge */}
                    {event.hostedByUM && (
                      <div className="flex items-center gap-1 mt-1">
                        <svg
                          viewBox="0 0 22 22"
                          fill="#B307EB"
                          className="w-3 h-3"
                        >
                          <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                        </svg>
                        <span className="text-[8px] font-mono text-[#B307EB] tracking-widest font-medium">
                          UM
                        </span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
