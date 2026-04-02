"use client";

import { useEffect, useState } from "react";
import {
  WAITLIST_COUNT_FALLBACK,
  mapCountToVisual,
} from "@/app/_lib/queue-config";
import Image from "next/image";
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
    <div style={{ backgroundColor: "#14120B", position: "relative" }}>
      {/* Scene strip: queue on left, door+bouncer anchored right */}
      <div
        className="flex flex-row items-end"
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
        <div style={{ position: "relative", flexShrink: 0 }}>
          <BouncerSprite height={bouncerHeight} />
          <a
            href="https://x.com/amoneill_"
            target="_blank"
            rel="noopener noreferrer"
            style={{ position: "absolute", bottom: 0, right: 0, zIndex: 10 }}
          >
            <Image
              src="/plant-easter-egg.png"
              alt=""
              width={18}
              height={18}
              style={{ imageRendering: "pixelated", display: "block" }}
            />
          </a>
        </div>
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
      </div>
    </div>
  );
}
