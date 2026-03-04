"use client";

import React, { useState, useEffect } from 'react';
import {
  EnergyStabilityCalculator,
  HealthMetrics,
  EnergyScore,
  generateSampleData,
} from '@/lib/energy-stability';

export default function EnergyStabilityDemo() {
  const [calculator] = useState(() => new EnergyStabilityCalculator());
  const [scores, setScores] = useState<EnergyScore[]>([]);
  const [currentDay, setCurrentDay] = useState(7);
  const [todayHRV, setTodayHRV] = useState(65);
  const [todayHR, setTodayHR] = useState(54);
  const [sampleData, setSampleData] = useState<HealthMetrics[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const data = generateSampleData(30);
    setSampleData(data);
    
    // Add first 7 days for baseline
    data.slice(0, 7).forEach(d => calculator.addDataPoint(d));
    
    // Calculate scores
    updateScores();
  }, []);

  const updateScores = () => {
    const historicalScores = calculator.getHistoricalScores();
    setScores(historicalScores);
  };

  const addDay = () => {
    if (currentDay < sampleData.length) {
      calculator.addDataPoint(sampleData[currentDay]);
      setCurrentDay(currentDay + 1);
      updateScores();
    }
  };

  const calculateCustomScore = () => {
    try {
      const score = calculator.calculateScore({
        date: new Date(),
        hrv: todayHRV,
        restingHR: todayHR,
      });
      
      alert(
        `Energy Stability Score: ${score.score.toFixed(1)}/100\n` +
        `HRV Component: ${score.hrvComponent.toFixed(1)}/50\n` +
        `HR Component: ${score.hrComponent.toFixed(1)}/50\n` +
        `Trend: ${score.trend}\n` +
        `Confidence: ${(score.confidence * 100).toFixed(0)}%`
      );
    } catch (error) {
      alert('Need more calibration data. Please add more days first.');
    }
  };

  const baseline = calculator.getBaseline();
  const latestScore = scores.length > 0 ? scores[scores.length - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Energy Stability Algorithm
          </h1>
          <p className="text-xl text-gray-300">
            HRV + Resting Heart Rate Analysis with Baseline Calibration & Smoothing
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls & Current Status */}
          <div className="space-y-6">
            {/* Baseline Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">📊 Baseline Calibration</h2>
              {baseline ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">HRV Baseline:</span>
                    <span className="text-cyan-400 font-mono text-lg">
                      {baseline.hrvBaseline.toFixed(1)} ± {baseline.hrvStdDev.toFixed(1)} ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">HR Baseline:</span>
                    <span className="text-purple-400 font-mono text-lg">
                      {baseline.hrBaseline.toFixed(1)} ± {baseline.hrStdDev.toFixed(1)} bpm
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Calibration Days:</span>
                    <span className="text-green-400 font-mono text-lg">
                      {baseline.calibrationDays}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  Need at least 3 data points for baseline...
                </p>
              )}
            </div>

            {/* Latest Score */}
            {latestScore && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-4">🎯 Latest Score</h2>
                <div className="text-center mb-4">
                  <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {latestScore.score.toFixed(1)}
                  </div>
                  <div className="text-gray-300 text-sm mt-2">out of 100</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Trend:</span>
                    <span className="text-lg">
                      {latestScore.trend === 'improving' && '📈 Improving'}
                      {latestScore.trend === 'stable' && '➡️ Stable'}
                      {latestScore.trend === 'declining' && '📉 Declining'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Confidence:</span>
                    <span className="text-green-400 font-mono">
                      {(latestScore.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>HRV Component:</span>
                      <span className="text-cyan-400">{latestScore.hrvComponent.toFixed(1)}/50</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(latestScore.hrvComponent / 50) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>HR Component:</span>
                      <span className="text-purple-400">{latestScore.hrComponent.toFixed(1)}/50</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(latestScore.hrComponent / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Input */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">🔧 Test Custom Values</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    HRV (ms): {todayHRV}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    value={todayHRV}
                    onChange={(e) => setTodayHRV(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Resting HR (bpm): {todayHR}
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    value={todayHR}
                    onChange={(e) => setTodayHR(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <button
                  onClick={calculateCustomScore}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Calculate Score
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">⏱️ Simulation Controls</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Day:</span>
                  <span className="text-cyan-400 font-mono text-lg">
                    {currentDay} / 30
                  </span>
                </div>
                <button
                  onClick={addDay}
                  disabled={currentDay >= sampleData.length}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Add Next Day
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Visualization */}
          <div className="space-y-6">
            {/* Score History Chart */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">📈 Score History</h2>
              <div className="relative h-64">
                <svg className="w-full h-full" viewBox="0 0 800 300">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <g key={y}>
                      <line
                        x1="40"
                        y1={260 - (y * 2.2)}
                        x2="780"
                        y2={260 - (y * 2.2)}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                      <text
                        x="10"
                        y={265 - (y * 2.2)}
                        fill="rgba(255,255,255,0.5)"
                        fontSize="12"
                      >
                        {y}
                      </text>
                    </g>
                  ))}
                  
                  {/* Score line */}
                  {scores.length > 1 && (
                    <polyline
                      points={scores
                        .map((score, idx) => {
                          const x = 40 + (idx / (scores.length - 1)) * 740;
                          const y = 260 - (score.score * 2.2);
                          return `${x},${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  
                  {/* Score points */}
                  {scores.map((score, idx) => {
                    const x = 40 + (idx / (scores.length - 1 || 1)) * 740;
                    const y = 260 - (score.score * 2.2);
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="4"
                        fill={
                          score.trend === 'improving'
                            ? '#22c55e'
                            : score.trend === 'declining'
                            ? '#ef4444'
                            : '#a78bfa'
                        }
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  })}
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Recent Days Table */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">📅 Recent Days</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {scores.slice(-10).reverse().map((score, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">
                        {score.date.toISOString().split('T')[0]}
                      </span>
                      <span className="font-bold text-lg">
                        {score.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">HRV:</span>
                        <span className="text-cyan-400 font-mono">
                          {score.smoothedMetrics.hrv.toFixed(1)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">HR:</span>
                        <span className="text-purple-400 font-mono">
                          {score.smoothedMetrics.restingHR.toFixed(1)}bpm
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold mb-4">🧬 Algorithm Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">
                Baseline Calibration
              </h3>
              <p className="text-gray-300 text-sm">
                Automatically establishes personal baselines using rolling averages
                over 7 days (configurable). Recalibrates every 30 days.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-purple-400">
                Signal Smoothing
              </h3>
              <p className="text-gray-300 text-sm">
                Applies exponential moving average (EMA) to handle HRV signal noise.
                Smoothing factor of 0.3 balances responsiveness and stability.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-green-400">
                Trend Detection
              </h3>
              <p className="text-gray-300 text-sm">
                Analyzes recent score history to identify improving, stable, or
                declining energy patterns based on 5-day rolling average.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            Developed by <a href="https://60x.ai" className="text-cyan-400 hover:text-cyan-300">60x</a> | 
            Part of the <a href="/" className="text-purple-400 hover:text-purple-300">Unicorn Mafia</a> community
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee, #a78bfa);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee, #a78bfa);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
