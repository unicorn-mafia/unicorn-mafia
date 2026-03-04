# Energy Stability Algorithm - Quick Start Guide

## Overview

The Energy Stability Algorithm is a TypeScript implementation that calculates daily energy scores from Heart Rate Variability (HRV) and resting heart rate measurements.

## Files

- `src/lib/energy-stability.ts` - Core algorithm implementation
- `src/lib/energy-stability.test.ts` - Comprehensive tests and examples
- `src/app/energy-stability-demo/page.tsx` - Interactive demo page
- `ENERGY_STABILITY_README.md` - Full documentation

## Quick Start

### 1. Basic Usage

```typescript
import { EnergyStabilityCalculator, HealthMetrics } from '@/lib/energy-stability';

// Create calculator
const calculator = new EnergyStabilityCalculator();

// Add daily measurements (morning HRV & resting HR)
const weekData: HealthMetrics[] = [
  { date: new Date('2024-03-01'), hrv: 62, restingHR: 56 },
  { date: new Date('2024-03-02'), hrv: 58, restingHR: 59 },
  { date: new Date('2024-03-03'), hrv: 65, restingHR: 54 },
  { date: new Date('2024-03-04'), hrv: 61, restingHR: 57 },
  { date: new Date('2024-03-05'), hrv: 63, restingHR: 55 },
  { date: new Date('2024-03-06'), hrv: 59, restingHR: 58 },
  { date: new Date('2024-03-07'), hrv: 66, restingHR: 53 },
];

weekData.forEach(data => calculator.addDataPoint(data));

// Calculate today's score
const todayScore = calculator.calculateScore({
  date: new Date('2024-03-08'),
  hrv: 68,
  restingHR: 52,
});

console.log(`Energy Score: ${todayScore.score}/100`);
console.log(`Trend: ${todayScore.trend}`);
console.log(`Confidence: ${(todayScore.confidence * 100).toFixed(0)}%`);
```

### 2. Custom Configuration

```typescript
const calculator = new EnergyStabilityCalculator({
  calibrationPeriod: 14,      // Use 14 days for baseline
  smoothingFactor: 0.2,        // More responsive to changes
  minDataPoints: 5,            // Require 5 points minimum
  outlierThreshold: 2.5,       // Stricter outlier detection
  recalibrationInterval: 21,   // Recalibrate every 3 weeks
});
```

### 3. View Results

```typescript
// Get baseline metrics
const baseline = calculator.getBaseline();
console.log(`HRV Baseline: ${baseline.hrvBaseline.toFixed(1)} ms`);
console.log(`HR Baseline: ${baseline.hrBaseline.toFixed(1)} bpm`);

// Get all historical scores
const scores = calculator.getHistoricalScores();
scores.forEach(score => {
  console.log(`${score.date.toISOString().split('T')[0]}: ${score.score} (${score.trend})`);
});

// Export to CSV
import { exportToCSV } from '@/lib/energy-stability';
const csv = exportToCSV(scores);
console.log(csv);
```

## Testing

Run the comprehensive test suite:

```bash
npx tsx src/lib/energy-stability.test.ts
```

## Demo

View the interactive demo at:

```bash
npm run dev
# Visit http://localhost:3000/energy-stability-demo
```

## Key Concepts

### Score Components (0-100)

- **HRV Component (0-50)**: Higher HRV = Better score
  - Measures recovery and resilience
  - Compares to personal baseline
  
- **HR Component (0-50)**: Lower resting HR = Better score
  - Indicates cardiovascular fitness
  - Compares to personal baseline

### Trends

- **Improving** 📈: Score increased by >5 points from recent average
- **Stable** ➡️: Score within ±5 points of recent average
- **Declining** 📉: Score decreased by >5 points from recent average

### Data Quality

Best practices for accurate measurements:

1. Measure at the same time each morning
2. Measure before getting out of bed
3. Use consistent measurement device/method
4. Ensure calm, relaxed state
5. Avoid measurements after caffeine/stimulants

### Typical Values

- **HRV (RMSSD)**: 20-200ms (higher is better, varies by individual)
- **Resting HR**: 40-100 bpm (lower is better for most people)
- **Athletes**: Often have HRV >60ms and HR <60 bpm

## Integration Examples

### Health Tracking App

```typescript
// Track daily readiness
const readinessScore = calculator.calculateScore(todayMetrics);

if (readinessScore.score > 70) {
  console.log("Ready for high-intensity training! 💪");
} else if (readinessScore.score > 50) {
  console.log("Moderate activity recommended 🚶");
} else {
  console.log("Focus on recovery today 😴");
}
```

### Wearable Device Integration

```typescript
// Import data from wearable
const wearableData = await fetchFromWearable();

wearableData.forEach(day => {
  calculator.addDataPoint({
    date: day.date,
    hrv: day.hrv_rmssd,
    restingHR: day.resting_heart_rate,
    sleepQuality: day.sleep_score,
    dataQuality: {
      isValid: day.measurement_quality === 'good',
      confidence: day.signal_quality / 100,
    }
  });
});
```

### Coaching Dashboard

```typescript
// Weekly summary for athlete
const weekScores = calculator.getHistoricalScores().slice(-7);
const avgScore = weekScores.reduce((sum, s) => sum + s.score, 0) / 7;
const trendCounts = {
  improving: weekScores.filter(s => s.trend === 'improving').length,
  declining: weekScores.filter(s => s.trend === 'declining').length,
};

console.log(`Weekly Average: ${avgScore.toFixed(1)}`);
console.log(`Training Load: ${trendCounts.declining > 3 ? 'High' : 'Moderate'}`);
```

## Support

For questions or issues:
- View full documentation: `ENERGY_STABILITY_README.md`
- Run tests: `npx tsx src/lib/energy-stability.test.ts`
- View demo: http://localhost:3000/energy-stability-demo
- Email: stable@unicrnmafia.com

---

**Developed by**: [60x](https://60x.ai) | Part of [Unicorn Mafia](https://unicornmafia.com) community
