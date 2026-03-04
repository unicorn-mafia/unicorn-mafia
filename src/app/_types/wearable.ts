export interface HeartRateData {
  bpm: number;
  timestamp: number;
  deviceId: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  confidence: number;
}

export interface WearableDevice {
  id: string;
  name: string;
  type: 'band' | 'watch' | 'chest-strap';
  batteryLevel: number;
  isConnected: boolean;
  lastSync: number;
  firmwareVersion: string;
}

export interface HeartRateReading extends HeartRateData {
  id: string;
  userId?: string;
  metadata?: {
    activity?: string;
    location?: string;
    [key: string]: unknown;
  };
}

export interface SyncStatus {
  deviceId: string;
  status: 'syncing' | 'synced' | 'error' | 'disconnected';
  lastSyncTime: number;
  pendingRecords: number;
  errorMessage?: string;
}

export interface DataIngestionRequest {
  deviceId: string;
  readings: HeartRateData[];
  syncId: string;
  timestamp: number;
}

export interface DataIngestionResponse {
  success: boolean;
  syncId: string;
  processedCount: number;
  failedCount: number;
  errors?: string[];
  nextSyncTime?: number;
}

export interface HeartRateAlert {
  id: string;
  type: 'high' | 'low' | 'irregular' | 'exertion';
  bpm: number;
  threshold: number;
  timestamp: number;
  deviceId: string;
  acknowledged: boolean;
}

export interface MonitoringConfig {
  samplingRate: number;
  batchSize: number;
  syncInterval: number;
  thresholds: {
    maxBpm: number;
    minBpm: number;
    exertionThreshold: number;
  };
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
    maxBackoffMs: number;
  };
}
