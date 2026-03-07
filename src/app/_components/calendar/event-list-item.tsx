"use client";

import React from "react";
import type { CalendarEvent } from "../../_types/calendar";
import { formatEventTime } from "../../_lib/calendar-data";
import { BRAND_COLORS } from "../../_lib/consts";
import styles from "./calendar.module.css";

interface EventListItemProps {
  event: CalendarEvent;
  index: number;
}

function isHappeningNow(event: CalendarEvent): boolean {
  const now = new Date();
  const start = new Date(event.start.dateTime || event.start.date || "");
  const end = new Date(event.end.dateTime || event.end.date || "");
  return now >= start && now <= end;
}

function getEventDate(event: CalendarEvent): Date {
  return new Date(event.start.dateTime || event.start.date || "");
}

function isPast(event: CalendarEvent): boolean {
  const end = new Date(event.end.dateTime || event.end.date || "");
  return end < new Date();
}

export function EventListItem({ event, index }: EventListItemProps) {
  const accentColor = BRAND_COLORS[index % BRAND_COLORS.length];
  const live = isHappeningNow(event);
  const past = !live && isPast(event);
  const linkUrl = event.externalUrl || event.htmlLink;
  const date = getEventDate(event);
  const time = formatEventTime(event);

  const monthLabel = date
    .toLocaleDateString("en-GB", { month: "short" })
    .toUpperCase();
  const dayLabel = date.getDate();
  const dayOfWeek = date
    .toLocaleDateString("en-GB", { weekday: "short" })
    .toUpperCase();

  const endDate = new Date(event.end.dateTime || event.end.date || "");
  const startH = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endH = endDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const timeRange =
    event.start.dateTime && event.end.dateTime
      ? `${dayOfWeek} ${startH} - ${endH}`
      : time
        ? `${dayOfWeek} ${time}`
        : dayOfWeek;

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex gap-4 py-4 px-3 border-b border-neutral-200 transition-colors ${
        past ? "opacity-40" : "hover:bg-neutral-50"
      }`}
    >
      {/* Date badge */}
      <div
        className="flex-shrink-0 w-14 h-14 flex flex-col items-center justify-center"
        style={{ backgroundColor: past ? "#d4d4d4" : accentColor }}
      >
        <span className="text-[10px] font-body tracking-wide text-white/80 leading-none">
          {monthLabel}
        </span>
        <span className="text-xl font-body font-bold text-white leading-tight">
          {dayLabel}
        </span>
      </div>

      {/* Event info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3
            className={`text-sm font-body font-medium tracking-wide truncate ${
              past
                ? "text-neutral-400"
                : "text-neutral-900 group-hover:underline"
            }`}
          >
            {event.summary}
          </h3>
          {event.externalUrl && (
            <span className="text-neutral-400 text-xs flex-shrink-0">
              &#8599;
            </span>
          )}
        </div>

        <p className="text-xs font-body text-neutral-500 tracking-wide">
          {timeRange}
        </p>

        {event.location && (
          <p className="text-xs font-body text-neutral-400 tracking-wide mt-0.5 truncate">
            {event.location}
          </p>
        )}
      </div>

      {/* Right side: badges + live */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5 pt-0.5">
        {live && (
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot}>
              <div className={styles.livePulse} />
            </div>
            <span className="text-[10px] font-body text-red-600 tracking-wide font-medium">
              LIVE
            </span>
          </div>
        )}
        {event.hostedByUM ? (
          <span className="text-[9px] font-body tracking-wide bg-[#B307EB] px-1.5 py-0.5 text-white font-medium">
            UM
          </span>
        ) : (
          <span className="text-[9px] font-body tracking-wide bg-[#3198F1] px-1.5 py-0.5 text-white font-medium">
            COMMUNITY
          </span>
        )}
      </div>
    </a>
  );
}
