"use client";

import React from "react";
import type { CalendarEvent } from "../../_types/calendar";
import { formatEventTime } from "../../_lib/calendar-data";
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

function stripLeadingEmojis(text: string): string {
  return text
    .replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, "")
    .trim();
}

function isPast(event: CalendarEvent): boolean {
  const end = new Date(event.end.dateTime || event.end.date || "");
  return end < new Date();
}

export function EventListItem({ event }: EventListItemProps) {
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
        className={`flex-shrink-0 w-14 h-14 flex flex-col items-center justify-center rounded ${
          past ? "bg-neutral-200" : "bg-neutral-800"
        }`}
      >
        <span className="text-[10px] font-body tracking-wide text-white/70 leading-none">
          {monthLabel}
        </span>
        <span className="text-xl font-body font-bold text-white leading-tight">
          {dayLabel}
        </span>
      </div>

      {/* Event info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3
            className={`text-sm font-body font-medium tracking-wide truncate ${
              past
                ? "text-neutral-400"
                : "text-neutral-900 group-hover:underline"
            }`}
          >
            {stripLeadingEmojis(event.summary)}
          </h3>
          {event.hostedByUM && !past && (
            <svg
              viewBox="0 0 22 22"
              fill="#B307EB"
              className="w-4 h-4 flex-shrink-0"
              aria-label="Hosted by Unicorn Mafia"
            >
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
            </svg>
          )}
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

      {/* Right side: live indicator */}
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
      </div>
    </a>
  );
}
