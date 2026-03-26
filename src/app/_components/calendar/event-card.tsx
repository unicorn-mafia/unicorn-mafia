"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import posthog from "posthog-js";
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

function isPast(event: CalendarEvent): boolean {
  const end = new Date(event.end.dateTime || event.end.date || "");
  return end < new Date();
}

export function EventCard({ event, index }: EventCardProps) {
  const accentColor = BRAND_COLORS[index % BRAND_COLORS.length];
  const live = isHappeningNow(event);
  const past = !live && isPast(event);
  const linkUrl = event.externalUrl || event.htmlLink;
  const dateRange = formatDateRange(event);

  const featured = event.featured && event.borderColors?.length === 2;

  return (
    <motion.a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white overflow-hidden ${past ? "opacity-40" : ""} ${
        featured ? styles.featuredBorder : "border border-neutral-300"
      }`}
      style={
        featured
          ? ({
              "--border-c1": event.borderColors![0],
              "--border-c2": event.borderColors![1],
            } as React.CSSProperties)
          : undefined
      }
      onClick={() =>
        posthog.capture("event_card_clicked", {
          event_name: event.summary,
          is_live: live,
          is_past: past,
          hosted_by_um: event.hostedByUM ?? false,
        })
      }
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
          <Image
            src={event.imageUrl}
            alt={stripLeadingEmojis(event.summary)}
            fill
            unoptimized
            sizes="(min-width: 1280px) 20rem, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Image
            src={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
            alt={stripLeadingEmojis(event.summary)}
            fill
            sizes="(min-width: 1280px) 20rem, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
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
        <div className="flex items-start gap-1.5 mb-1">
          <motion.h3
            className="text-xs font-medium font-body text-neutral-900 tracking-wide line-clamp-2"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {stripLeadingEmojis(event.summary)}
          </motion.h3>
          {event.hostedByUM && (
            <svg
              viewBox="0 0 22 22"
              fill="#B307EB"
              className="w-4 h-4 flex-shrink-0 mt-px"
              aria-label="Hosted by Unicorn Mafia"
            >
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
            </svg>
          )}
        </div>
      </div>
    </motion.a>
  );
}
