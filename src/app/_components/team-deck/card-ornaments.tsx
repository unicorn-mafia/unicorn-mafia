/** Inline SVG corner ornament — rotated per corner */
export const CornerOrnament = ({
  rotation,
  color,
}: {
  rotation: number;
  color: string;
}) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    style={{
      transform: `rotate(${rotation}deg)`,
      filter: `drop-shadow(0 0 4px ${color}60)`,
    }}
  >
    <path
      d="M2 2 L2 14 L4 14 L4 4 L14 4 L14 2 Z"
      fill={color}
      fillOpacity={0.7}
    />
    <path
      d="M6 6 L6 10 L7 10 L7 7 L10 7 L10 6 Z"
      fill={color}
      fillOpacity={0.5}
    />
    <rect
      x="3"
      y="3"
      width="2"
      height="2"
      fill={color}
      fillOpacity={0.9}
      transform="rotate(45 4 4)"
    />
    <line
      x1="14"
      y1="3"
      x2="20"
      y2="3"
      stroke={color}
      strokeOpacity={0.3}
      strokeWidth="0.5"
    />
    <line
      x1="3"
      y1="14"
      x2="3"
      y2="20"
      stroke={color}
      strokeOpacity={0.3}
      strokeWidth="0.5"
    />
    <circle cx="20" cy="3" r="1" fill={color} fillOpacity={0.4} />
    <circle cx="3" cy="20" r="1" fill={color} fillOpacity={0.4} />
  </svg>
);

/** Decorative edge line with notches */
export const EdgeLine = ({
  orientation,
  color,
}: {
  orientation: "horizontal" | "vertical";
  color: string;
}) => {
  if (orientation === "horizontal") {
    return (
      <svg
        width="100%"
        height="6"
        viewBox="0 0 200 6"
        preserveAspectRatio="none"
        className="w-full"
      >
        <line
          x1="0"
          y1="3"
          x2="200"
          y2="3"
          stroke={color}
          strokeOpacity={0.25}
          strokeWidth="0.5"
        />
        {[20, 50, 80, 100, 120, 150, 180].map((x) => (
          <line
            key={x}
            x1={x}
            y1="1"
            x2={x}
            y2="5"
            stroke={color}
            strokeOpacity={0.2}
            strokeWidth="0.5"
          />
        ))}
        <rect
          x="98"
          y="1"
          width="4"
          height="4"
          fill={color}
          fillOpacity={0.3}
          transform="rotate(45 100 3)"
        />
      </svg>
    );
  }
  return (
    <svg
      width="6"
      height="100%"
      viewBox="0 0 6 200"
      preserveAspectRatio="none"
      className="h-full"
    >
      <line
        x1="3"
        y1="0"
        x2="3"
        y2="200"
        stroke={color}
        strokeOpacity={0.25}
        strokeWidth="0.5"
      />
      {[20, 50, 80, 100, 120, 150, 180].map((y) => (
        <line
          key={y}
          x1="1"
          y1={y}
          x2="5"
          y2={y}
          stroke={color}
          strokeOpacity={0.2}
          strokeWidth="0.5"
        />
      ))}
      <rect
        x="1"
        y="98"
        width="4"
        height="4"
        fill={color}
        fillOpacity={0.3}
        transform="rotate(45 3 100)"
      />
    </svg>
  );
};

/** Full ornamental frame overlay — corners + edge lines */
export const OrnamentalFrame = ({ color }: { color: string }) => (
  <>
    <div className="absolute top-[12px] left-[20px] right-[20px] z-20 pointer-events-none">
      <EdgeLine orientation="horizontal" color={color} />
    </div>
    <div className="absolute bottom-[12px] left-[20px] right-[20px] z-20 pointer-events-none">
      <EdgeLine orientation="horizontal" color={color} />
    </div>
    <div className="absolute top-[20px] bottom-[20px] left-[12px] z-20 pointer-events-none">
      <EdgeLine orientation="vertical" color={color} />
    </div>
    <div className="absolute top-[20px] bottom-[20px] right-[12px] z-20 pointer-events-none">
      <EdgeLine orientation="vertical" color={color} />
    </div>
    <div className="absolute top-[6px] left-[6px] z-20 pointer-events-none">
      <CornerOrnament rotation={0} color={color} />
    </div>
    <div className="absolute top-[6px] right-[6px] z-20 pointer-events-none">
      <CornerOrnament rotation={90} color={color} />
    </div>
    <div className="absolute bottom-[6px] left-[6px] z-20 pointer-events-none">
      <CornerOrnament rotation={270} color={color} />
    </div>
    <div className="absolute bottom-[6px] right-[6px] z-20 pointer-events-none">
      <CornerOrnament rotation={180} color={color} />
    </div>
  </>
);
