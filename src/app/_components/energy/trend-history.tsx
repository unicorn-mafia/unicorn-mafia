"use client";

import { useState } from "react";

interface TrendHistoryProps {
  data: Array<{ date: string; score: number }>;
}

export default function TrendHistory({ data }: TrendHistoryProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const getFilteredData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    return data.slice(-days);
  };

  const filteredData = getFilteredData();

  return (
    <div className="border border-black/10 rounded-lg p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-lg font-medium font-title">trend history</h2>
        
        <div className="flex gap-2">
          <TimeRangeButton
            label="7 days"
            active={timeRange === "7d"}
            onClick={() => setTimeRange("7d")}
          />
          <TimeRangeButton
            label="30 days"
            active={timeRange === "30d"}
            onClick={() => setTimeRange("30d")}
          />
          <TimeRangeButton
            label="90 days"
            active={timeRange === "90d"}
            onClick={() => setTimeRange("90d")}
          />
        </div>
      </div>

      <div className="mb-6">
        <LineChart data={filteredData} />
      </div>

      <div className="border-t border-black/10 pt-6">
        <h3 className="text-sm font-medium font-title mb-4">recent scores</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredData
            .slice()
            .reverse()
            .map((entry, index) => (
              <ScoreEntry
                key={index}
                date={entry.date}
                score={entry.score}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function TimeRangeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-body rounded-md transition-colors ${
        active
          ? "bg-black text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }`}
    >
      {label}
    </button>
  );
}

function LineChart({ data }: { data: Array<{ date: string; score: number }> }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
        <p className="text-neutral-500 font-body">No data available</p>
      </div>
    );
  }

  const maxScore = 100;
  const minScore = 0;
  const chartHeight = 256;
  const chartPadding = 20;

  const points = data.map((entry, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y =
      chartPadding +
      ((maxScore - entry.score) / (maxScore - minScore)) *
        (chartHeight - 2 * chartPadding);
    return `${x},${y}`;
  });

  const pathD = points.map((point, i) => `${i === 0 ? "M" : "L"} ${point}`).join(" ");

  // Create area fill
  const areaD = `${pathD} L 100,${chartHeight} L 0,${chartHeight} Z`;

  return (
    <div className="relative bg-neutral-50 rounded-lg p-4 h-64">
      <svg
        viewBox={`0 0 100 ${chartHeight}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((score) => {
          const y =
            chartPadding +
            ((maxScore - score) / (maxScore - minScore)) *
              (chartHeight - 2 * chartPadding);
          return (
            <line
              key={score}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e5e5e5"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* Area fill */}
        <path
          d={areaD}
          fill="rgba(0, 0, 0, 0.05)"
          vectorEffect="non-scaling-stroke"
        />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="black"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Data points */}
        {points.map((point, index) => {
          const [x, y] = point.split(",").map(Number);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill="black"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4 -ml-8 text-xs text-neutral-500 font-body">
        {[100, 75, 50, 25, 0].map((score) => (
          <div key={score}>{score}</div>
        ))}
      </div>
    </div>
  );
}

function ScoreEntry({ date, score }: { date: string; score: number }) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-md hover:bg-neutral-100 transition-colors">
      <span className="text-sm font-body text-neutral-600">{formattedDate}</span>
      <span
        className={`${getScoreColor(score)} px-3 py-1 rounded-md text-sm font-medium font-title`}
      >
        {score}
      </span>
    </div>
  );
}
