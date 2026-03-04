"use client";

import { useState, useEffect } from "react";
import EnergyScoreCard from "../_components/energy/energy-score-card";
import TrendHistory from "../_components/energy/trend-history";

export default function EnergyDashboard() {
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [historicalData, setHistoricalData] = useState<
    Array<{ date: string; score: number }>
  >([]);

  useEffect(() => {
    // Mock data - in production this would come from an API
    const mockScore = 87;
    const mockHistory = generateMockHistory(30);
    
    setCurrentScore(mockScore);
    setHistoricalData(mockHistory);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-medium font-title tracking-tight mb-4">
            daily energy score
          </h1>
          <p className="text-neutral-600 text-base font-body">
            community stability and engagement metrics
          </p>
        </div>

        <div className="space-y-8">
          <EnergyScoreCard score={currentScore} />
          <TrendHistory data={historicalData} />
        </div>
      </div>
    </div>
  );
}

function generateMockHistory(days: number): Array<{ date: string; score: number }> {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate a somewhat realistic trending score
    const baseScore = 75;
    const trend = (days - i) * 0.3;
    const randomVariation = Math.random() * 10 - 5;
    const score = Math.min(100, Math.max(0, baseScore + trend + randomVariation));
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(score),
    });
  }
  
  return data;
}
