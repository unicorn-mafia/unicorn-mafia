import type {
  HeartRateData,
  HeartRateAlert,
  MonitoringConfig,
} from '@/app/_types/wearable';

export const DEFAULT_CONFIG: MonitoringConfig = {
  samplingRate: 1000,
  batchSize: 10,
  syncInterval: 5000,
  thresholds: {
    maxBpm: 180,
    minBpm: 40,
    exertionThreshold: 150,
  },
  retryPolicy: {
    maxRetries: 3,
    backoffMs: 1000,
    maxBackoffMs: 10000,
  },
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateHeartRateData(
  data: HeartRateData
): ValidationResult {
  if (!data.bpm || typeof data.bpm !== 'number') {
    return { valid: false, error: 'Invalid BPM value' };
  }

  if (data.bpm < 20 || data.bpm > 250) {
    return {
      valid: false,
      error: `BPM out of physiological range: ${data.bpm}`,
    };
  }

  if (!data.timestamp || typeof data.timestamp !== 'number') {
    return { valid: false, error: 'Invalid timestamp' };
  }

  if (data.timestamp > Date.now() + 60000) {
    return { valid: false, error: 'Timestamp in future' };
  }

  if (data.timestamp < Date.now() - 86400000) {
    return { valid: false, error: 'Timestamp too old (>24h)' };
  }

  if (!data.deviceId || typeof data.deviceId !== 'string') {
    return { valid: false, error: 'Invalid deviceId' };
  }

  if (
    data.confidence !== undefined &&
    (data.confidence < 0 || data.confidence > 1)
  ) {
    return { valid: false, error: 'Confidence must be between 0 and 1' };
  }

  const validQualities = ['excellent', 'good', 'fair', 'poor'];
  if (data.quality && !validQualities.includes(data.quality)) {
    return { valid: false, error: 'Invalid quality value' };
  }

  return { valid: true };
}

export function detectAnomalies(
  readings: HeartRateData[],
  config: MonitoringConfig = DEFAULT_CONFIG
): HeartRateAlert[] {
  const alerts: HeartRateAlert[] = [];

  readings.forEach((reading, index) => {
    if (reading.bpm > config.thresholds.maxBpm) {
      alerts.push({
        id: `alert-${reading.deviceId}-${reading.timestamp}`,
        type: 'high',
        bpm: reading.bpm,
        threshold: config.thresholds.maxBpm,
        timestamp: reading.timestamp,
        deviceId: reading.deviceId,
        acknowledged: false,
      });
    }

    if (reading.bpm < config.thresholds.minBpm) {
      alerts.push({
        id: `alert-${reading.deviceId}-${reading.timestamp}`,
        type: 'low',
        bpm: reading.bpm,
        threshold: config.thresholds.minBpm,
        timestamp: reading.timestamp,
        deviceId: reading.deviceId,
        acknowledged: false,
      });
    }

    if (reading.bpm >= config.thresholds.exertionThreshold) {
      alerts.push({
        id: `alert-${reading.deviceId}-${reading.timestamp}`,
        type: 'exertion',
        bpm: reading.bpm,
        threshold: config.thresholds.exertionThreshold,
        timestamp: reading.timestamp,
        deviceId: reading.deviceId,
        acknowledged: false,
      });
    }

    if (index > 0) {
      const prevReading = readings[index - 1];
      const bpmChange = Math.abs(reading.bpm - prevReading.bpm);
      const timeChange = reading.timestamp - prevReading.timestamp;

      if (bpmChange > 30 && timeChange < 5000) {
        alerts.push({
          id: `alert-${reading.deviceId}-${reading.timestamp}`,
          type: 'irregular',
          bpm: reading.bpm,
          threshold: 30,
          timestamp: reading.timestamp,
          deviceId: reading.deviceId,
          acknowledged: false,
        });
      }
    }
  });

  return alerts;
}

export function calculateAverageBpm(readings: HeartRateData[]): number {
  if (readings.length === 0) return 0;
  const sum = readings.reduce((acc, reading) => acc + reading.bpm, 0);
  return Math.round(sum / readings.length);
}

export function calculateBpmTrend(
  readings: HeartRateData[]
): 'increasing' | 'decreasing' | 'stable' {
  if (readings.length < 2) return 'stable';

  const recentReadings = readings.slice(-10);
  const midpoint = Math.floor(recentReadings.length / 2);
  const firstHalf = recentReadings.slice(0, midpoint);
  const secondHalf = recentReadings.slice(midpoint);

  const firstAvg = calculateAverageBpm(firstHalf);
  const secondAvg = calculateAverageBpm(secondHalf);

  const difference = secondAvg - firstAvg;

  if (difference > 5) return 'increasing';
  if (difference < -5) return 'decreasing';
  return 'stable';
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: MonitoringConfig['retryPolicy'] = DEFAULT_CONFIG.retryPolicy
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < config.maxRetries) {
        const backoff = Math.min(
          config.backoffMs * Math.pow(2, attempt),
          config.maxBackoffMs
        );
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  throw lastError;
}

export function createSyncId(): string {
  return `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isDeviceConnected(lastSync: number, threshold = 30000): boolean {
  return Date.now() - lastSync < threshold;
}
