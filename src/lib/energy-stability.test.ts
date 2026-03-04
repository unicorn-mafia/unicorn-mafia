/**
 * Energy Stability Algorithm - Tests and Examples
 * 
 * This file contains tests and usage examples for the energy stability algorithm.
 * Run with: npx ts-node src/lib/energy-stability.test.ts
 */

import {
  EnergyStabilityCalculator,
  HealthMetrics,
  generateSampleData,
  exportToCSV,
  DEFAULT_CONFIG,
} from './energy-stability';

// ============================================================================
// Test Utilities
// ============================================================================

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(
      `Assertion failed: ${message}\nExpected: ${expected}\nActual: ${actual}`
    );
  }
}

function assertRange(value: number, min: number, max: number, message: string): void {
  if (value < min || value > max) {
    throw new Error(
      `Assertion failed: ${message}\nValue ${value} is not in range [${min}, ${max}]`
    );
  }
}

// ============================================================================
// Unit Tests
// ============================================================================

function testBasicCalculation(): void {
  console.log("\n📊 Test: Basic Score Calculation");
  
  const calculator = new EnergyStabilityCalculator();
  
  // Add calibration data
  const calibrationData: HealthMetrics[] = [
    { date: new Date('2024-01-01'), hrv: 60, restingHR: 55 },
    { date: new Date('2024-01-02'), hrv: 62, restingHR: 54 },
    { date: new Date('2024-01-03'), hrv: 58, restingHR: 56 },
    { date: new Date('2024-01-04'), hrv: 61, restingHR: 55 },
    { date: new Date('2024-01-05'), hrv: 59, restingHR: 57 },
    { date: new Date('2024-01-06'), hrv: 63, restingHR: 53 },
    { date: new Date('2024-01-07'), hrv: 60, restingHR: 55 },
  ];
  
  calibrationData.forEach(data => calculator.addDataPoint(data));
  
  // Test score calculation
  const testMetrics: HealthMetrics = {
    date: new Date('2024-01-08'),
    hrv: 65, // Higher than baseline (good)
    restingHR: 52, // Lower than baseline (good)
  };
  
  const score = calculator.calculateScore(testMetrics);
  
  assert(score.score >= 0 && score.score <= 100, "Score should be in range 0-100");
  assert(score.score > 50, "Good metrics should yield score > 50");
  assert(score.hrvComponent >= 0 && score.hrvComponent <= 50, "HRV component should be in range 0-50");
  assert(score.hrComponent >= 0 && score.hrComponent <= 50, "HR component should be in range 0-50");
  assert(score.confidence > 0 && score.confidence <= 1, "Confidence should be in range 0-1");
  
  console.log(`✅ Score: ${score.score}`);
  console.log(`   HRV Component: ${score.hrvComponent}`);
  console.log(`   HR Component: ${score.hrComponent}`);
  console.log(`   Trend: ${score.trend}`);
  console.log(`   Confidence: ${score.confidence.toFixed(2)}`);
}

function testBaselineCalibration(): void {
  console.log("\n📊 Test: Baseline Calibration");
  
  const calculator = new EnergyStabilityCalculator({
    calibrationPeriod: 5,
  });
  
  const data: HealthMetrics[] = [
    { date: new Date('2024-01-01'), hrv: 50, restingHR: 60 },
    { date: new Date('2024-01-02'), hrv: 52, restingHR: 59 },
    { date: new Date('2024-01-03'), hrv: 51, restingHR: 61 },
    { date: new Date('2024-01-04'), hrv: 53, restingHR: 58 },
    { date: new Date('2024-01-05'), hrv: 50, restingHR: 60 },
  ];
  
  data.forEach(d => calculator.addDataPoint(d));
  
  const baseline = calculator.getBaseline();
  
  assert(baseline !== null, "Baseline should be calculated");
  assert(baseline!.hrvBaseline > 0, "HRV baseline should be positive");
  assert(baseline!.hrBaseline > 0, "HR baseline should be positive");
  assert(baseline!.calibrationDays === 5, "Calibration days should match data points");
  
  console.log(`✅ Baseline HRV: ${baseline!.hrvBaseline.toFixed(1)} ms`);
  console.log(`   Baseline HR: ${baseline!.hrBaseline.toFixed(1)} bpm`);
  console.log(`   HRV Std Dev: ${baseline!.hrvStdDev.toFixed(1)}`);
  console.log(`   HR Std Dev: ${baseline!.hrStdDev.toFixed(1)}`);
}

function testSmoothing(): void {
  console.log("\n📊 Test: Smoothing Algorithm");
  
  const calculator = new EnergyStabilityCalculator({
    smoothingFactor: 0.5, // Higher smoothing
  });
  
  // Add noisy data
  const data: HealthMetrics[] = [
    { date: new Date('2024-01-01'), hrv: 60, restingHR: 55 },
    { date: new Date('2024-01-02'), hrv: 85, restingHR: 70 }, // Noisy spike
    { date: new Date('2024-01-03'), hrv: 62, restingHR: 56 },
    { date: new Date('2024-01-04'), hrv: 61, restingHR: 55 },
    { date: new Date('2024-01-05'), hrv: 90, restingHR: 75 }, // Noisy spike
    { date: new Date('2024-01-06'), hrv: 63, restingHR: 54 },
    { date: new Date('2024-01-07'), hrv: 60, restingHR: 55 },
  ];
  
  data.forEach(d => calculator.addDataPoint(d));
  
  const scores = calculator.getHistoricalScores();
  
  // Check that smoothed values reduce noise
  scores.forEach((score, idx) => {
    if (idx > 0) {
      const rawDiff = Math.abs(data[idx].hrv - data[idx - 1].hrv);
      const smoothedDiff = Math.abs(
        score.smoothedMetrics.hrv - scores[idx - 1].smoothedMetrics.hrv
      );
      
      // Smoothed changes should generally be smaller (except for first few points)
      if (idx > 2 && rawDiff > 20) {
        assert(
          smoothedDiff < rawDiff,
          `Smoothed diff should be less than raw diff for noisy data`
        );
      }
    }
  });
  
  console.log("✅ Smoothing reduces noise in HRV signal");
  console.log(`   Sample raw HRV spike: ${data[1].hrv} → ${data[2].hrv}`);
  console.log(`   Smoothed values: ${scores[1].smoothedMetrics.hrv.toFixed(1)} → ${scores[2].smoothedMetrics.hrv.toFixed(1)}`);
}

function testTrendDetection(): void {
  console.log("\n📊 Test: Trend Detection");
  
  const calculator = new EnergyStabilityCalculator();
  
  // Create improving trend data
  const improvingData: HealthMetrics[] = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date('2024-01-01');
    date.setDate(date.getDate() + i);
    
    improvingData.push({
      date,
      hrv: 50 + i * 2, // Increasing HRV (good)
      restingHR: 65 - i, // Decreasing HR (good)
    });
  }
  
  improvingData.forEach(d => calculator.addDataPoint(d));
  const scores = calculator.getHistoricalScores();
  
  // Last few scores should show improving trend
  const recentScores = scores.slice(-3);
  const improvingCount = recentScores.filter(s => s.trend === 'improving' || s.trend === 'stable').length;
  
  assert(improvingCount >= 2, "Should detect improving or stable trend");
  
  console.log(`✅ Trend detection working`);
  console.log(`   Last 3 trends: ${recentScores.map(s => s.trend).join(', ')}`);
  console.log(`   Score progression: ${recentScores.map(s => s.score.toFixed(1)).join(' → ')}`);
}

function testDataValidation(): void {
  console.log("\n📊 Test: Data Validation");
  
  const calculator = new EnergyStabilityCalculator();
  
  // Test invalid data
  const invalidData: HealthMetrics[] = [
    { date: new Date(), hrv: -10, restingHR: 60 }, // Negative HRV
    { date: new Date(), hrv: 60, restingHR: 200 }, // Unrealistic HR
    { date: new Date(), hrv: 1000, restingHR: 60 }, // Unrealistic HRV
  ];
  
  let errorCount = 0;
  invalidData.forEach(data => {
    try {
      calculator.addDataPoint(data);
    } catch (error) {
      errorCount++;
    }
  });
  
  assert(errorCount === invalidData.length, "Should reject all invalid data points");
  
  console.log(`✅ Data validation working - rejected ${errorCount} invalid points`);
}

function testConfidenceScoring(): void {
  console.log("\n📊 Test: Confidence Scoring");
  
  const calculator = new EnergyStabilityCalculator();
  
  // Add baseline data
  for (let i = 0; i < 7; i++) {
    const date = new Date('2024-01-01');
    date.setDate(date.getDate() + i);
    calculator.addDataPoint({
      date,
      hrv: 60,
      restingHR: 55,
      dataQuality: {
        isValid: true,
        confidence: 0.9,
      },
    });
  }
  
  // Test with high quality data
  const highQualityScore = calculator.calculateScore({
    date: new Date('2024-01-08'),
    hrv: 61,
    restingHR: 54,
    dataQuality: {
      isValid: true,
      confidence: 0.95,
    },
  });
  
  // Test with low quality data
  const lowQualityScore = calculator.calculateScore({
    date: new Date('2024-01-09'),
    hrv: 61,
    restingHR: 54,
    dataQuality: {
      isValid: true,
      confidence: 0.5,
    },
  });
  
  assert(
    highQualityScore.confidence > lowQualityScore.confidence,
    "Higher quality data should have higher confidence"
  );
  
  console.log(`✅ Confidence scoring working`);
  console.log(`   High quality confidence: ${highQualityScore.confidence.toFixed(2)}`);
  console.log(`   Low quality confidence: ${lowQualityScore.confidence.toFixed(2)}`);
}

// ============================================================================
// Integration Tests
// ============================================================================

function testFullWorkflow(): void {
  console.log("\n📊 Test: Full Workflow");
  
  const calculator = new EnergyStabilityCalculator({
    calibrationPeriod: 7,
    smoothingFactor: 0.3,
  });
  
  // Generate 30 days of sample data
  const sampleData = generateSampleData(30);
  
  // Add all data points
  sampleData.forEach(data => calculator.addDataPoint(data));
  
  // Get baseline
  const baseline = calculator.getBaseline();
  assert(baseline !== null, "Baseline should be calculated");
  
  // Get all scores
  const scores = calculator.getHistoricalScores();
  assert(scores.length > 0, "Should have calculated scores");
  
  // Verify all scores are valid
  scores.forEach(score => {
    assertRange(score.score, 0, 100, "Score should be in valid range");
    assertRange(score.confidence, 0, 1, "Confidence should be in valid range");
    assert(['improving', 'stable', 'declining'].includes(score.trend), "Trend should be valid");
  });
  
  console.log(`✅ Full workflow completed successfully`);
  console.log(`   Processed ${sampleData.length} days of data`);
  console.log(`   Generated ${scores.length} scores`);
  console.log(`   Average score: ${(scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1)}`);
}

function testCSVExport(): void {
  console.log("\n📊 Test: CSV Export");
  
  const calculator = new EnergyStabilityCalculator();
  const sampleData = generateSampleData(10);
  
  sampleData.forEach(data => calculator.addDataPoint(data));
  const scores = calculator.getHistoricalScores();
  
  const csv = exportToCSV(scores);
  
  assert(csv.includes('Date,Score'), "CSV should have headers");
  assert(csv.split('\n').length === scores.length + 1, "CSV should have correct number of rows");
  
  console.log(`✅ CSV export working`);
  console.log(`   Exported ${scores.length} scores`);
}

// ============================================================================
// Example Usage Scenarios
// ============================================================================

function exampleBasicUsage(): void {
  console.log("\n\n🎯 Example 1: Basic Usage");
  console.log("=" .repeat(60));
  
  const calculator = new EnergyStabilityCalculator();
  
  // Simulate a week of morning HRV/HR measurements
  const weekData: HealthMetrics[] = [
    { date: new Date('2024-03-01'), hrv: 62, restingHR: 56 },
    { date: new Date('2024-03-02'), hrv: 58, restingHR: 59 },
    { date: new Date('2024-03-03'), hrv: 65, restingHR: 54 },
    { date: new Date('2024-03-04'), hrv: 61, restingHR: 57 },
    { date: new Date('2024-03-05'), hrv: 63, restingHR: 55 },
    { date: new Date('2024-03-06'), hrv: 59, restingHR: 58 },
    { date: new Date('2024-03-07'), hrv: 66, restingHR: 53 },
  ];
  
  console.log("\nAdding daily measurements...");
  weekData.forEach(data => {
    calculator.addDataPoint(data);
    console.log(`  ${data.date.toISOString().split('T')[0]}: HRV=${data.hrv}ms, HR=${data.restingHR}bpm`);
  });
  
  console.log("\nBaseline established:");
  const baseline = calculator.getBaseline();
  if (baseline) {
    console.log(`  HRV Baseline: ${baseline.hrvBaseline.toFixed(1)} ± ${baseline.hrvStdDev.toFixed(1)} ms`);
    console.log(`  HR Baseline: ${baseline.hrBaseline.toFixed(1)} ± ${baseline.hrStdDev.toFixed(1)} bpm`);
  }
  
  // Calculate today's score
  console.log("\nToday's measurements:");
  const todayMetrics: HealthMetrics = {
    date: new Date('2024-03-08'),
    hrv: 68,
    restingHR: 52,
  };
  
  const score = calculator.calculateScore(todayMetrics);
  console.log(`  Energy Stability Score: ${score.score}/100`);
  console.log(`  Trend: ${score.trend}`);
  console.log(`  Confidence: ${(score.confidence * 100).toFixed(0)}%`);
}

function exampleLongTermTracking(): void {
  console.log("\n\n🎯 Example 2: Long-term Tracking (30 days)");
  console.log("=".repeat(60));
  
  const calculator = new EnergyStabilityCalculator({
    calibrationPeriod: 7,
    smoothingFactor: 0.3,
    recalibrationInterval: 14,
  });
  
  // Generate 30 days of data
  const monthData = generateSampleData(30);
  monthData.forEach(data => calculator.addDataPoint(data));
  
  const scores = calculator.getHistoricalScores();
  
  console.log(`\nTracking Summary (${scores.length} days):`);
  console.log(`  Average Score: ${(scores.reduce((s, score) => s + score.score, 0) / scores.length).toFixed(1)}`);
  console.log(`  Best Score: ${Math.max(...scores.map(s => s.score)).toFixed(1)}`);
  console.log(`  Worst Score: ${Math.min(...scores.map(s => s.score)).toFixed(1)}`);
  
  const trendCounts = {
    improving: scores.filter(s => s.trend === 'improving').length,
    stable: scores.filter(s => s.trend === 'stable').length,
    declining: scores.filter(s => s.trend === 'declining').length,
  };
  
  console.log(`\nTrend Distribution:`);
  console.log(`  Improving: ${trendCounts.improving} days`);
  console.log(`  Stable: ${trendCounts.stable} days`);
  console.log(`  Declining: ${trendCounts.declining} days`);
  
  // Show last 5 days
  console.log(`\nLast 5 Days:`);
  scores.slice(-5).forEach(score => {
    const trend = score.trend === 'improving' ? '📈' : score.trend === 'declining' ? '📉' : '➡️';
    console.log(
      `  ${score.date.toISOString().split('T')[0]}: ` +
      `Score=${score.score.toFixed(1)} ${trend} ` +
      `(HRV=${score.smoothedMetrics.hrv.toFixed(1)}, HR=${score.smoothedMetrics.restingHR.toFixed(1)})`
    );
  });
}

function exampleCustomConfiguration(): void {
  console.log("\n\n🎯 Example 3: Custom Configuration");
  console.log("=".repeat(60));
  
  // Create calculator with custom settings
  const calculator = new EnergyStabilityCalculator({
    calibrationPeriod: 14, // 2 weeks for baseline
    smoothingFactor: 0.2, // Less smoothing (more responsive)
    minDataPoints: 5,
    outlierThreshold: 2.5, // More sensitive to outliers
    recalibrationInterval: 21, // 3 weeks
  });
  
  console.log("\nCustom Configuration:");
  console.log(`  Calibration Period: 14 days`);
  console.log(`  Smoothing Factor: 0.2 (lower = more responsive)`);
  console.log(`  Outlier Threshold: 2.5 standard deviations`);
  console.log(`  Recalibration: Every 21 days`);
  
  // Add sample data
  const data = generateSampleData(20);
  data.forEach(d => calculator.addDataPoint(d));
  
  const scores = calculator.getHistoricalScores();
  console.log(`\n✅ Processed ${scores.length} days with custom settings`);
}

// ============================================================================
// Main Test Runner
// ============================================================================

function runAllTests(): void {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 ENERGY STABILITY ALGORITHM - TEST SUITE");
  console.log("=".repeat(60));
  
  try {
    // Unit tests
    testBasicCalculation();
    testBaselineCalibration();
    testSmoothing();
    testTrendDetection();
    testDataValidation();
    testConfidenceScoring();
    
    // Integration tests
    testFullWorkflow();
    testCSVExport();
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL TESTS PASSED");
    console.log("=".repeat(60));
    
    // Run examples
    exampleBasicUsage();
    exampleLongTermTracking();
    exampleCustomConfiguration();
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL EXAMPLES COMPLETED");
    console.log("=".repeat(60));
    
  } catch (error) {
    console.error("\n❌ TEST FAILED:");
    console.error(error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

export { runAllTests };
