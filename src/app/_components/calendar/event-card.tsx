"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CalendarEvent } from "../../_types/calendar";
import { formatEventTime } from "../../_lib/calendar-data";
import styles from "./calendar.module.css";

const BRAND_COLORS = ["#B307EB", "#3198F1", "#4EF9BD", "#EE1701"];

interface EventCardProps {
  event: CalendarEvent;
  index: number;
}

function isHappeningNow(event: CalendarEvent): boolean {
  const now = new Date();
  const start = new Date(event.start.dateTime || event.start.date || "");
  const end = new Date(event.end.dateTime || event.end.date || "");
  return now >= start && now <= end;
}


function formatDateRange(event: CalendarEvent): string {
  const start = new Date(event.start.dateTime || event.start.date || "");
  const end = new Date(event.end.dateTime || event.end.date || "");

  const startDay = start.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
  const endDay = end.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();

  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > 1) {
    // Subtract 1 day from end for display (end is typically midnight of the next day)
    const displayEnd = new Date(end);
    displayEnd.setDate(displayEnd.getDate() - 1);
    const displayEndLabel = displayEnd.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
    if (startDay === displayEndLabel) return startDay;
    return `${startDay} — ${displayEndLabel}`;
  }

  const time = formatEventTime(event);
  return time ? `${startDay} · ${time}` : startDay;
}

export function EventCard({ event, index }: EventCardProps) {
  const accentColor = BRAND_COLORS[index % BRAND_COLORS.length];
  const live = isHappeningNow(event);
  const linkUrl = event.externalUrl || event.htmlLink;
  const dateRange = formatDateRange(event);

  return (
    <motion.a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-neutral-600 bg-neutral-50 overflow-hidden aspect-square"
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Image area */}
      <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.summary}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={event.hostedByUM ? "/event-fallback-um.png" : (index % 2 === 0 ? "/event-fallback.png" : "/event-fallback-2.png")}
            alt={event.summary}
            className="w-full h-full object-cover"
          />
        )}
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {event.hostedByUM && (
            <div className="text-[9px] font-body tracking-wide bg-[#B307EB] px-1.5 py-0.5 text-white font-medium">
              HOSTED BY UM
            </div>
          )}
          {event.externalUrl && (
            <div className="text-[9px] font-body tracking-wide bg-white/90 border border-neutral-300 px-1.5 py-0.5 text-neutral-600">
              WEBSITE ↗
            </div>
          )}
        </div>
      </div>

      {/* Accent bar */}
      <motion.div
        className="w-full"
        style={{ backgroundColor: accentColor, height: 3 }}
        whileHover={{ height: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      <div className="p-3">
        {/* Date/time + live indicator */}
        <div className="flex items-center gap-2 mb-1.5">
          {live && (
            <div className={styles.liveIndicator}>
              <div className={styles.liveDot}>
                <div className={styles.livePulse} />
              </div>
              <span className="text-[10px] font-body text-red-600 tracking-wide font-medium">LIVE</span>
            </div>
          )}
          <span className="text-[10px] font-body text-neutral-500 tracking-wide">{dateRange}</span>
        </div>

        {/* Title */}
        <motion.h3
          className="text-xs font-medium font-body text-neutral-900 tracking-wide mb-1 line-clamp-2"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {event.summary}
        </motion.h3>

        {/* Location */}
        {event.location && (
          <p className="text-[10px] font-body text-neutral-500 tracking-wide truncate">
            {event.location}
          </p>
        )}
      </div>
    </motion.a>
  );
}
