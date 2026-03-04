# Energy Stability Algorithm

A TypeScript implementation of an energy stability scoring system based on Heart Rate Variability (HRV) and resting heart rate measurements.

## Overview

The Energy Stability Algorithm derives a daily energy score (0-100) from morning HRV and resting heart rate measurements. It includes:

- **Baseline Calibration**: Automatically establishes personal baselines using rolling averages
- **Signal Smoothing**: Exponential moving average (EMA) to handle HRV signal noise
- **Trend Detection**: Identifies improving, stable, or declining energy patterns
- **Confidence Scoring**: Assesses measurement quality and baseline stability

## Features

### 1. Baseline Calibration

The algorithm establishes personalized baselines by analyzing your first 7 days (configurable) of measurements:

- **HRV Baseline**: Mean and standard deviation of HRV measurements
- **HR Baseline**: Mean and standard deviation of resting heart rate
- **Auto-Recalibration**: Baselines update every 30 days (configurable)

### 2. Smoothing Algorithm

HRV measurements can be noisy. The algorithm applies exponential moving average (EMA) smoothing:

```
smoothed_value = α × current_value + (1 - α) × previous_smoothed_value
```

Where α (smoothing factor) defaults to 0.3, providing a balance between responsiveness and noise reduction.

### 3. Score Calculation

The daily score (0-100) combines two components:

- **HRV Component (0-50)**: Higher HRV is better
  - Compares current HRV to baseline
  - Rewards values above baseline
  
- **Heart Rate Component (0-50)**: Lower resting HR is better
  - Compares current HR to baseline
  - Rewards values below baseline

Both components use z-score normalization with a sigmoid-like transformation for smooth scaling.

### 4. Trend Detection

Analyzes the last 5 days to determine if your energy stability is:

- **Improving** 📈: Score increased by >5 points
- **Stable** ➡️: Score within ±5 points
- **Declining** 📉: Score decreased by >5 points

### 5. Confidence Scoring

Confidence (0-1) is calculated based on:

- Data quality indicators
- Baseline stability (more calibration data = higher confidence)
- Outlier detection (extreme values reduce confidence)

## Installation

### Option 1: Copy the Files

Copy these files to your project:

```bash
src/lib/energy-stability.ts          # Main algorithm
src/lib/energy-stability.test.ts     # Tests and examples
```

### Option 2: Direct Import

If integrating into an existing TypeScript project:

```typescript
import { EnergyStabilityCalculator, HealthMetrics } from './lib/energy-stability';
```

## Usage

### Basic Example

```typescript
import { EnergyStabilityCalculator, HealthMetrics } from './lib/energy-stability';

// Create calculator
const calculator = new EnergyStabilityCalculator();

// Add morning measurements
const measurements: HealthMetrics[] = [
  { date: new Date('2024-03-01'), hrv: 62, restingHR: 56 },
  { date: new Date('2024-03-02'), hrv: 58, restingHR: 59 },
  { date: new Date('2024-03-03'), hrv: 65, restingHR: 54 },
  // ... more days
];

measurements.forEach(m => calculator.addDataPoint(m));

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

### Advanced Configuration

```typescript
const calculator = new EnergyStabilityCalculator({
  calibrationPeriod: 14,      // 2 weeks for baseline
  smoothingFactor: 0.2,        // Less smoothing (more responsive)
  minDataPoints: 5,            // Minimum data points needed
  outlierThreshold: 2.5,       // Standard deviations for outliers
  recalibrationInterval: 21,   // Recalibrate every 3 weeks
});
```

### Getting Historical Data

```typescript
// Get baseline metrics
const baseline = calculator.getBaseline();
console.log(`HRV Baseline: ${baseline.hrvBaseline.toFixed(1)} ms`);

// Get all historical scores
const scores = calculator.getHistoricalScores();

// Export to CSV
import { exportToCSV } from './lib/energy-stability';
const csv = exportToCSV(scores);
```

## API Reference

### `EnergyStabilityCalculator`

#### Constructor

```typescript
constructor(config?: Partial<EnergyStabilityConfig>)
```

#### Methods

- `addDataPoint(metrics: HealthMetrics): void` - Add a new measurement
- `calculateScore(metrics: HealthMetrics): EnergyScore` - Calculate score for given metrics
- `getBaseline(): BaselineMetrics | null` - Get current baseline metrics
- `getHistoricalData(): HealthMetrics[]` - Get all raw measurements
- `getHistoricalScores(): EnergyScore[]` - Get all calculated scores

### Types

#### `HealthMetrics`

```typescript
interface HealthMetrics {
  date: Date;
  hrv: number;              // HRV in milliseconds (RMSSD or SDNN)
  restingHR: number;        // Resting heart rate in bpm
  sleepQuality?: number;    // Optional: 0-100 scale
  dataQuality?: DataQuality;
}
```

#### `EnergyScore`

```typescript
interface EnergyScore {
  date: Date;
  score: number;            // 0-100 scale
  hrvComponent: number;     // 0-50 scale
  hrComponent: number;      // 0-50 scale
  trend: "improving" | "stable" | "declining";
  confidence: number;       // 0-1 scale
  metrics: HealthMetrics;
  smoothedMetrics: {
    hrv: number;
    restingHR: number;
  };
}
```

#### `EnergyStabilityConfig`

```typescript
interface EnergyStabilityConfig {
  calibrationPeriod: number;      // Days for baseline (default: 7)
  smoothingFactor: number;        // EMA factor 0-1 (default: 0.3)
  minDataPoints: number;          // Min data needed (default: 3)
  outlierThreshold: number;       // Std devs for outliers (default: 3)
  recalibrationInterval: number;  // Days between recalibration (default: 30)
}
```

## HRV Measurement Guidelines

### Best Practices

1. **Consistency is Key**
   - Measure at the same time each morning
   - Use the same device/method
   - Measure before getting out of bed

2. **Valid HRV Ranges**
   - Typical RMSSD: 20-200ms
   - Higher values generally indicate better recovery
   - Individual baselines vary significantly

3. **Resting Heart Rate**
   - Typical range: 40-100 bpm
   - Athletes often have lower values (40-60 bpm)
   - Lower values generally indicate better fitness

4. **Data Quality**
   - Ensure proper sensor contact
   - Take measurements when calm and relaxed
   - Avoid measurements after stimulants (caffeine)

### Measurement Devices

Compatible with HRV data from:

- Chest strap HR monitors (most accurate)
- Smart watches with HRV tracking
- Finger pulse oximeters
- PPG-based wearables

**Note**: Ensure your device provides RMSSD or SDNN values in milliseconds.

## Testing

Run the test suite:

```bash
npx ts-node src/lib/energy-stability.test.ts
```

The test suite includes:

- Unit tests for all core functionality
- Integration tests for full workflows
- Example usage scenarios
- Data validation tests
- Smoothing and trend detection tests

## Algorithm Details

### Z-Score Normalization

```
z = (value - baseline_mean) / baseline_std_dev
```

### Sigmoid-like Scaling

```
normalized = (capped_z + 3) / 6
score_component = normalized × max_value
```

This provides smooth scaling where:
- -3σ → 0 points
- 0σ → 50% of max points
- +3σ → max points

### Exponential Moving Average

```
EMA_t = α × X_t + (1 - α) × EMA_{t-1}
```

Where:
- `α` = smoothing factor (default: 0.3)
- `X_t` = current measurement
- `EMA_{t-1}` = previous smoothed value

## Performance Considerations

- **Memory**: Stores all historical data points in memory
- **Computation**: O(n) for score calculation with n data points
- **Smoothing**: O(1) per data point
- **Baseline**: O(n) where n = calibrationPeriod

For production use with large datasets, consider:
- Implementing data persistence (database)
- Limiting historical data retention
- Caching baseline calculations

## Use Cases

### Personal Health Tracking

Track daily energy levels to:
- Optimize training schedules
- Identify stress patterns
- Monitor recovery
- Guide rest day decisions

### Clinical Applications

Potential uses in:
- Cardiac rehabilitation monitoring
- Stress management programs
- Sleep disorder assessment
- Athletic performance optimization

### Integration Examples

- **Fitness Apps**: Daily readiness scores
- **Wearable Devices**: Real-time energy monitoring
- **Health Dashboards**: Long-term trend visualization
- **Coaching Platforms**: Athlete monitoring systems

## Limitations

1. **Individual Variation**: Baselines vary significantly between individuals
2. **Measurement Quality**: Accuracy depends on device and measurement conditions
3. **Context Matters**: Scores should be interpreted with lifestyle context
4. **Not Medical Advice**: This algorithm is for informational purposes only

## Contributing

Contributions are welcome! Areas for improvement:

- Additional smoothing algorithms
- Machine learning-based trend prediction
- Integration with popular health APIs
- Mobile app implementations
- Visualization components

## References

### Scientific Background

1. Heart rate variability: Standards of measurement, physiological interpretation, and clinical use (Task Force, 1996)
2. Heart rate variability as a marker of training load (Buchheit, 2014)
3. HRV4Training methodology and validation studies

### Related Resources

- [HRV4Training](https://www.hrv4training.com/)
- [Elite HRV](https://elitehrv.com/)
- [Kubios HRV](https://www.kubios.com/)

## License

This implementation is provided as-is for educational and commercial use.

## Support

For questions or issues:
- Open an issue in the repository
- Contact: stable@unicrnmafia.com

---

**Version**: 1.0.0  
**Last Updated**: March 4, 2026  
**Developed by**: Unicorn Mafia / 60x Team
