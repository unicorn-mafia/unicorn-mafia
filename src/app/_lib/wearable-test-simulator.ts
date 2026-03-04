import type {
  HeartRateData,
  DataIngestionRequest,
} from '@/app/_types/wearable';
import { createSyncId } from './wearable-utils';

export class WearableSimulator {
  private deviceId: string;
  private baselineBpm: number = 70;
  private isRunning: boolean = false;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }

  generateReading(): HeartRateData {
    const variation = Math.random() * 20 - 10;
    const bpm = Math.round(this.baselineBpm + variation);

    const qualities: Array<'excellent' | 'good' | 'fair' | 'poor'> = [
      'excellent',
      'good',
      'fair',
    ];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];

    return {
      bpm: Math.max(50, Math.min(180, bpm)),
      timestamp: Date.now(),
      deviceId: this.deviceId,
      quality,
      confidence: 0.8 + Math.random() * 0.2,
    };
  }

  async sendBatch(readings: HeartRateData[]): Promise<Response> {
    const request: DataIngestionRequest = {
      deviceId: this.deviceId,
      readings,
      syncId: createSyncId(),
      timestamp: Date.now(),
    };

    return fetch('/api/wearable/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  }

  async startContinuousSync(intervalMs: number = 3000): Promise<() => void> {
    this.isRunning = true;

    const intervalId = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(intervalId);
        return;
      }

      const readings = Array.from({ length: 3 }, () =>
        this.generateReading()
      );

      try {
        const response = await this.sendBatch(readings);
        const result = await response.json();
        console.log('Sync result:', result);
      } catch (error) {
        console.error('Sync error:', error);
      }
    }, intervalMs);

    return () => {
      this.isRunning = false;
      clearInterval(intervalId);
    };
  }

  setBpm(bpm: number) {
    this.baselineBpm = bpm;
  }

  simulateExertion() {
    this.baselineBpm = 160;
    setTimeout(() => {
      this.baselineBpm = 70;
    }, 30000);
  }
}
