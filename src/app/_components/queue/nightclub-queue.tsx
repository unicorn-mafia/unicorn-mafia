"use client";

import { useEffect, useState } from "react";
import {
  WAITLIST_COUNT_FALLBACK,
  mapCountToVisual,
} from "@/app/_lib/queue-config";
import { BouncerSprite } from "./bouncer-sprite";
import { UnicornSprite } from "./unicorn-sprite";
import styles from "./queue.module.css";

interface NightclubQueueProps {
  compact?: boolean;
}

export function NightclubQueue({ compact = false }: NightclubQueueProps) {
  const [count, setCount] = useState(WAITLIST_COUNT_FALLBACK);

  useEffect(() => {
    fetch("/api/queue-count")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.count === "number") setCount(data.count);
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);
  const containerHeight = compact ? 64 : 96;
  // Bouncer+door image fills full scene height
  const bouncerHeight = containerHeight;
  const unicornHeight = Math.round(containerHeight * 0.65);
  const unicornWidth = Math.round(unicornHeight * (578 / 432));
  const overlap = -Math.round(unicornWidth * 0.62);

  const visibleCount = mapCountToVisual(count);

  return (
    <div className="overflow-hidden" style={{ backgroundColor: "#14120B" }}>
      {/* Scene strip: queue on left, door+bouncer anchored right */}
      <div
        className="flex flex-row items-end overflow-hidden"
        style={{ height: containerHeight }}
      >
        {/* Unicorn queue — row-reverse so index 0 is rightmost (closest to door) */}
        <div
          className={`${styles.queueRow} ${styles.fadeLeft}`}
          style={{ flexDirection: "row-reverse" }}
        >
          {Array.from({ length: visibleCount }).map((_, i) => (
            <div
              key={i}
              style={{ marginRight: i === 0 ? 0 : overlap, flexShrink: 0 }}
            >
              <UnicornSprite index={i} height={unicornHeight} />
            </div>
          ))}
        </div>

        {/* Door + bouncer anchored to right */}
        <BouncerSprite height={bouncerHeight} />
      </div>

      {/* Queue info */}
      <div
        className="flex flex-row items-center gap-3 flex-wrap"
        style={{ padding: compact ? "4px 8px 6px" : "6px 10px 8px" }}
      >
        <span
          className="font-body"
          style={{
            fontSize: compact ? 9 : 10,
            color: "#999",
            letterSpacing: "0.04em",
          }}
        >
          {count.toLocaleString()} applicants in line
        </span>
        <span
          className="font-body"
          style={{
            fontSize: compact ? 9 : 10,
            color: "#555",
            letterSpacing: "0.04em",
          }}
        >
          We review every application
        </span>
      </div>
    </div>
  );
}
