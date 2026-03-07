"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CalendarEvent } from "../../_types/calendar";
import { formatDateRange } from "../../_lib/calendar-data";
import { BRAND_COLORS } from "../../_lib/consts";
import styles from "./calendar.module.css";

const FALLBACK_IMAGES = [
  "/fallback-hackathon.png",
  "/fallback-code-review.png",
  "/fallback-clean-code.png",
  "/fallback-branching.png",
  "/fallback-bug-fixed.png",
  "/fallback-deprecated.png",
];

interface EventCardProps {
  event: CalendarEvent;
  index: number;
}

function stripLeadingEmojis(text: string): string {
  return text
    .replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, "")
    .trim();
}

function isHappeningNow(event: CalendarEvent): boolean {
  const now = new Date();
  const start = new Date(event.start.dateTime || event.start.date || "");
  const end = new Date(event.end.dateTime || event.end.date || "");
  return now >= start && now <= end;
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
      className="block border border-neutral-300 bg-white overflow-hidden"
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Image area — square to match Luma poster covers */}
      <div className="aspect-square relative overflow-hidden bg-neutral-100">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={stripLeadingEmojis(event.summary)}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
            alt={stripLeadingEmojis(event.summary)}
            className="w-full h-full object-cover"
          />
        )}
        {/* Badge */}
        <div className="absolute top-2 right-2">
          {event.hostedByUM ? (
            <div className="text-[9px] font-body tracking-wide bg-[#B307EB] px-1.5 py-0.5 text-white font-medium">
              UM
            </div>
          ) : (
            <div className="text-[9px] font-body tracking-wide bg-[#3198F1] px-1.5 py-0.5 text-white font-medium">
              COMMUNITY
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
              <span className="text-[10px] font-body text-red-600 tracking-wide font-medium">
                LIVE
              </span>
            </div>
          )}
          <span className="text-[10px] font-body text-neutral-500 tracking-wide">
            {dateRange}
          </span>
        </div>

        {/* Title */}
        <motion.h3
          className="text-xs font-medium font-body text-neutral-900 tracking-wide mb-1 line-clamp-2"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {stripLeadingEmojis(event.summary)}
        </motion.h3>
      </div>
    </motion.a>
  );
}
