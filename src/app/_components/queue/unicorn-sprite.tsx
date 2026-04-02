import Image from "next/image";
import styles from "./queue.module.css";

// Source image: 578×432, transparent background
const ASPECT = 578 / 432;

interface UnicornSpriteProps {
  index: number;
  height?: number;
}

export function UnicornSprite({ index, height = 39 }: UnicornSpriteProps) {
  const width = Math.round(height * ASPECT);
  const delay = (index * 0.2) % 2;

  return (
    <div className={styles.unicorn} style={{ animationDelay: `${delay}s` }}>
      <Image
        src="/unicorn-pixel.png"
        alt="Pixel Unicorn"
        width={width}
        height={height}
        style={{
          imageRendering: "pixelated",
          display: "block",
          transform: "scaleX(-1)",
        }}
      />
    </div>
  );
}
