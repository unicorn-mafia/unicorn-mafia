/**
 * Energy Stability Algorithm
 * 
 * Derives a daily energy stability score from morning HRV (Heart Rate Variability)
 * and resting heart rate measurements. Includes baseline calibration and smoothing
 * to handle HRV signal noise.
 * 
 * Key Features:
 * - Baseline calibration using rolling averages
 * - Exponential moving average (EMA) smoothing for noise reduction
 * - Daily score calculation (0-100 scale)
 * - Trend analysis and outlier detection
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface HealthMetrics {
  date: Date;
  hrv: number; // Heart Rate Variability in milliseconds (RMSSD or SDNN)
  restingHR: number; // Resting Heart Rate in beats per minute
  sleepQuality?: number; // Optional: 0-100 scale
  dataQuality?: DataQuality; // Quality indicator for the measurement
}

export interface DataQuality {
  isValid: boolean;
  confidence: number; // 0-1 scale
  notes?: string;
}

export interface BaselineMetrics {
  hrvBaseline: number;
  hrBaseline: number;
  hrvStdDev: number;
  hrStdDev: number;
  calibrationDays: number;
  lastUpdated: Date;
}

export interface EnergyScore {
  date: Date;
  score: number; // 0-100 scale
  hrvComponent: number; // Contribution from HRV (0-50)
  hrComponent: number; // Contribution from HR (0-50)
  trend: "improving" | "stable" | "declining";
  confidence: number; // 0-1 scale
  metrics: HealthMetrics;
  smoothedMetrics: {
    hrv: number;
    restingHR: number;
  };
}

export interface EnergyStabilityConfig {
  calibrationPeriod: number; // Days needed for baseline calibration (default: 7)
  smoothingFactor: number; // EMA smoothing factor 0-1 (default: 0.3)
  minDataPoints: number; // Minimum data points required (default: 3)
  outlierThreshold: number; // Standard deviations for outlier detection (default: 3)
  recalibrationInterval: number; // Days between baseline recalibration (default: 30)
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_CONFIG: EnergyStabilityConfig = {
  calibrationPeriod: 7,
  smoothingFactor: 0.3,
  minDataPoints: 3,
  outlierThreshold: 3,
  recalibrationInterval: 30,
};

// ============================================================================
// Energy Stability Calculator
// ============================================================================

export class EnergyStabilityCalculator {
  private config: EnergyStabilityConfig;
  private historicalData: HealthMetrics[] = [];
  private baseline: BaselineMetrics | null = null;
  private smoothedValues: Map<string, { hrv: number; restingHR: number }> = new Map();
  private scoreCache: Map<string, EnergyScore> = new Map();

  constructor(config: Partial<EnergyStabilityConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Add a new health metrics data point
   */
  addDataPoint(metrics: HealthMetrics): void {
    // Validate data
    if (!this.isValidDataPoint(metrics)) {
      throw new Error("Invalid health metrics data");
    }

    this.historicalData.push(metrics);
    this.historicalData.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Check if baseline needs recalibration
    if (this.shouldRecalibrate()) {
      this.calculateBaseline();
    }
  }

  /**
   * Calculate baseline metrics from historical data
   */
  private calculateBaseline(): void {
    const validData = this.getValidDataPoints();
    
    if (validData.length < this.config.minDataPoints) {
      return;
    }

    // Use the most recent calibrationPeriod days for baseline
    const calibrationData = validData.slice(-this.config.calibrationPeriod);
    
    const hrvValues = calibrationData.map(d => d.hrv);
    const hrValues = calibrationData.map(d => d.restingHR);

    this.baseline = {
      hrvBaseline: this.calculateMean(hrvValues),
      hrBaseline: this.calculateMean(hrValues),
      hrvStdDev: this.calculateStdDev(hrvValues),
      hrStdDev: this.calculateStdDev(hrValues),
      calibrationDays: calibrationData.length,
      lastUpdated: new Date(),
    };
  }

  /**
   * Calculate energy stability score for a given date
   */
  calculateScore(metrics: HealthMetrics, useCache: boolean = true): EnergyScore {
    // Check cache first
    const dateKey = metrics.date.toISOString().split('T')[0];
    if (useCache && this.scoreCache.has(dateKey)) {
      return this.scoreCache.get(dateKey)!;
    }

    if (!this.baseline) {
      this.calculateBaseline();
    }

    if (!this.baseline) {
      throw new Error(
        `Insufficient data for baseline calibration. Need at least ${this.config.minDataPoints} data points.`
      );
    }

    // Apply exponential moving average smoothing
    const smoothed = this.applySmoothing(metrics);

    // Calculate HRV component (0-50 scale)
    // Higher HRV is better, so we reward values above baseline
    const hrvDeviation = (smoothed.hrv - this.baseline.hrvBaseline) / this.baseline.hrvStdDev;
    const hrvComponent = this.normalizeToScale(hrvDeviation, 50);

    // Calculate HR component (0-50 scale)
    // Lower resting HR is better, so we reward values below baseline
    const hrDeviation = (this.baseline.hrBaseline - smoothed.restingHR) / this.baseline.hrStdDev;
    const hrComponent = this.normalizeToScale(hrDeviation, 50);

    // Combine components
    const totalScore = Math.max(0, Math.min(100, hrvComponent + hrComponent));

    // Determine trend (use cached scores to avoid recursion)
    const trend = this.calculateTrend(metrics.date, totalScore);

    // Calculate confidence based on data quality and baseline stability
    const confidence = this.calculateConfidence(metrics);

    const score: EnergyScore = {
      date: metrics.date,
      score: Math.round(totalScore * 10) / 10, // Round to 1 decimal
      hrvComponent: Math.round(hrvComponent * 10) / 10,
      hrComponent: Math.round(hrComponent * 10) / 10,
      trend,
      confidence,
      metrics,
      smoothedMetrics: smoothed,
    };

    // Cache the score
    this.scoreCache.set(dateKey, score);

    return score;
  }

  /**
   * Apply exponential moving average smoothing
   */
  private applySmoothing(metrics: HealthMetrics): { hrv: number; restingHR: number } {
    const dateKey = metrics.date.toISOString().split('T')[0];
    const alpha = this.config.smoothingFactor;

    // Get previous smoothed value
    const previousDates = Array.from(this.smoothedValues.keys()).sort();
    const previousDateKey = previousDates[previousDates.length - 1];
    const previous = this.smoothedValues.get(previousDateKey);

    let smoothed: { hrv: number; restingHR: number };

    if (!previous) {
      // First data point - use raw values
      smoothed = {
        hrv: metrics.hrv,
        restingHR: metrics.restingHR,
      };
    } else {
      // Apply EMA: smoothed = alpha * current + (1 - alpha) * previous_smoothed
      smoothed = {
        hrv: alpha * metrics.hrv + (1 - alpha) * previous.hrv,
        restingHR: alpha * metrics.restingHR + (1 - alpha) * previous.restingHR,
      };
    }

    this.smoothedValues.set(dateKey, smoothed);
    return smoothed;
  }

  /**
   * Normalize a z-score deviation to a 0-maxValue scale
   * Uses a sigmoid-like function for smooth scaling
   */
  private normalizeToScale(zScore: number, maxValue: number): number {
    // Cap z-scores at +/- 3 standard deviations
    const cappedZ = Math.max(-3, Math.min(3, zScore));
    
    // Transform to 0-1 scale using a sigmoid-like function
    // This gives: -3σ → 0, 0σ → 0.5, +3σ → 1
    const normalized = (cappedZ + 3) / 6;
    
    return normalized * maxValue;
  }

  /**
   * Calculate trend based on recent scores
   */
  private calculateTrend(currentDate: Date, currentScore: number): "improving" | "stable" | "declining" {
    // Get cached scores from the last 3-7 days
    const recentDays = 5;
    const recentScores: number[] = [];
    
    // Look for cached scores in recent days
    for (let i = 1; i <= recentDays; i++) {
      const pastDate = new Date(currentDate);
      pastDate.setDate(pastDate.getDate() - i);
      const dateKey = pastDate.toISOString().split('T')[0];
      
      const cachedScore = this.scoreCache.get(dateKey);
      if (cachedScore) {
        recentScores.push(cachedScore.score);
      }
    }

    if (recentScores.length < 2) {
      return "stable";
    }

    // Calculate average of recent scores
    const recentAvg = this.calculateMean(recentScores);
    const scoreDiff = currentScore - recentAvg;

    // Use a threshold of 5 points for trend detection
    if (scoreDiff > 5) {
      return "improving";
    } else if (scoreDiff < -5) {
      return "declining";
    } else {
      return "stable";
    }
  }

  /**
   * Calculate confidence score based on data quality and baseline stability
   */
  private calculateConfidence(metrics: HealthMetrics): number {
    let confidence = 1.0;

    // Factor 1: Data quality
    if (metrics.dataQuality) {
      confidence *= metrics.dataQuality.confidence;
    }

    // Factor 2: Baseline stability (more data = higher confidence)
    if (this.baseline) {
      const stabilityFactor = Math.min(
        1.0,
        this.baseline.calibrationDays / this.config.calibrationPeriod
      );
      confidence *= stabilityFactor;
    }

    // Factor 3: Outlier detection
    if (this.baseline) {
      const hrvZScore = Math.abs(
        (metrics.hrv - this.baseline.hrvBaseline) / this.baseline.hrvStdDev
      );
      const hrZScore = Math.abs(
        (metrics.restingHR - this.baseline.hrBaseline) / this.baseline.hrStdDev
      );

      const maxZScore = Math.max(hrvZScore, hrZScore);
      
      if (maxZScore > this.config.outlierThreshold) {
        confidence *= 0.5; // Reduce confidence for outliers
      }
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Get baseline metrics
   */
  getBaseline(): BaselineMetrics | null {
    return this.baseline;
  }

  /**
   * Get all historical data
   */
  getHistoricalData(): HealthMetrics[] {
    return [...this.historicalData];
  }

  /**
   * Get historical scores
   */
  getHistoricalScores(): EnergyScore[] {
    const validData = this.getValidDataPoints();
    const scores: EnergyScore[] = [];

    for (const metrics of validData) {
      try {
        scores.push(this.calculateScore(metrics));
      } catch {
        // Skip data points that can't be scored
        continue;
      }
    }

    return scores;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private isValidDataPoint(metrics: HealthMetrics): boolean {
    // Basic validation
    if (!metrics.date || isNaN(metrics.date.getTime())) {
      return false;
    }

    // HRV should be positive (typical range: 20-200ms for RMSSD)
    if (metrics.hrv <= 0 || metrics.hrv > 500) {
      return false;
    }

    // Resting HR should be in reasonable range (typical: 40-100 bpm)
    if (metrics.restingHR < 30 || metrics.restingHR > 150) {
      return false;
    }

    return true;
  }

  private getValidDataPoints(): HealthMetrics[] {
    return this.historicalData.filter(m => 
      !m.dataQuality || m.dataQuality.isValid
    );
  }

  private shouldRecalibrate(): boolean {
    if (!this.baseline) {
      return true;
    }

    // Continue updating baseline during initial calibration period
    if (this.baseline.calibrationDays < this.config.calibrationPeriod) {
      const validData = this.getValidDataPoints();
      if (validData.length > this.baseline.calibrationDays) {
        return true;
      }
    }

    const daysSinceCalibration = this.daysBetween(
      this.baseline.lastUpdated,
      new Date()
    );

    return daysSinceCalibration >= this.config.recalibrationInterval;
  }

  private calculateMean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateStdDev(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = this.calculateMean(squaredDiffs);
    
    return Math.sqrt(variance);
  }

  private daysBetween(date1: Date, date2: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    
    return Math.floor((utc2 - utc1) / msPerDay);
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a sample dataset for testing
 */
export function generateSampleData(days: number = 30): HealthMetrics[] {
  const data: HealthMetrics[] = [];
  const baseHRV = 60; // Base HRV in ms
  const baseHR = 55; // Base resting HR in bpm
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    // Add some variation and trend
    const trend = Math.sin(i / 10) * 10; // Cyclical variation
    const noise = (Math.random() - 0.5) * 15; // Random noise
    
    data.push({
      date,
      hrv: Math.max(20, baseHRV + trend + noise),
      restingHR: Math.max(40, baseHR - trend/2 + noise/2),
      dataQuality: {
        isValid: true,
        confidence: 0.8 + Math.random() * 0.2,
      },
    });
  }
  
  return data;
}

/**
 * Export data to CSV format
 */
export function exportToCSV(scores: EnergyScore[]): string {
  const headers = [
    "Date",
    "Score",
    "HRV Component",
    "HR Component",
    "Trend",
    "Confidence",
    "Raw HRV",
    "Raw HR",
    "Smoothed HRV",
    "Smoothed HR",
  ].join(",");

  const rows = scores.map(s => [
    s.date.toISOString().split('T')[0],
    s.score.toFixed(1),
    s.hrvComponent.toFixed(1),
    s.hrComponent.toFixed(1),
    s.trend,
    s.confidence.toFixed(2),
    s.metrics.hrv.toFixed(1),
    s.metrics.restingHR.toFixed(1),
    s.smoothedMetrics.hrv.toFixed(1),
    s.smoothedMetrics.restingHR.toFixed(1),
  ].join(","));

  return [headers, ...rows].join("\n");
}
