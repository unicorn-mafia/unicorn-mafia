interface EnergyScoreCardProps {
  score: number;
}

export default function EnergyScoreCard({ score }: EnergyScoreCardProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "moderate";
    return "low";
  };

  const getScoreBg = (score: number): string => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="border border-black/10 rounded-lg p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-medium font-title mb-2">
            current energy score
          </h2>
          <p className="text-neutral-600 text-sm font-body">
            last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div
          className={`${getScoreBg(score)} border rounded-lg p-6 md:p-8 flex flex-col items-center justify-center min-w-[200px]`}
        >
          <div className={`${getScoreColor(score)} text-6xl md:text-7xl font-bold font-title mb-2`}>
            {score}
          </div>
          <div className="text-neutral-600 text-sm font-body uppercase tracking-wider">
            {getScoreLabel(score)}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="7-day avg" value={score - 3} />
          <MetricCard label="30-day avg" value={score - 8} />
          <MetricCard label="trend" value="+12%" isPercentage />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  isPercentage = false,
}: {
  label: string;
  value: number | string;
  isPercentage?: boolean;
}) {
  return (
    <div className="bg-neutral-50 rounded-lg p-4">
      <div className="text-neutral-500 text-xs font-body uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-2xl font-bold font-title text-neutral-900">
        {value}
      </div>
    </div>
  );
}
