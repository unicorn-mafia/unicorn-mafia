import Image from "next/image";

// Source image: 1200×896, transparent background
const ASPECT = 1200 / 896;

interface BouncerSpriteProps {
  height?: number;
}

export function BouncerSprite({ height = 57 }: BouncerSpriteProps) {
  const width = Math.round(height * ASPECT);

  return (
    <Image
      src="/bouncer-door.png"
      alt="bouncer"
      width={width}
      height={height}
      style={{ imageRendering: "pixelated", display: "block", flexShrink: 0 }}
    />
  );
}
