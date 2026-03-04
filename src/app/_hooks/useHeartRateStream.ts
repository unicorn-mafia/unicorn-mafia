'use client';

import { useState, useEffect, useCallback } from 'react';
import type { HeartRateReading, SyncStatus } from '@/app/_types/wearable';

interface StreamEvent {
  type: 'connected' | 'heartrate' | 'sync_status' | 'error';
  readings?: HeartRateReading[];
  status?: SyncStatus;
  error?: string;
  timestamp: number;
}

interface UseHeartRateStreamOptions {
  deviceId?: string;
  autoConnect?: boolean;
}

export function useHeartRateStream(options: UseHeartRateStreamOptions = {}) {
  const [readings, setReadings] = useState<HeartRateReading[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestBpm, setLatestBpm] = useState<number | null>(null);

  const connect = useCallback(() => {
    const url = new URL('/api/wearable/stream', window.location.origin);
    if (options.deviceId) {
      url.searchParams.set('deviceId', options.deviceId);
    }

    const eventSource = new EventSource(url.toString());

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: StreamEvent = JSON.parse(event.data);

        switch (data.type) {
          case 'connected':
            setIsConnected(true);
            break;
          case 'heartrate':
            if (data.readings && data.readings.length > 0) {
              setReadings((prev) => {
                const combined = [...data.readings!, ...prev];
                const unique = Array.from(
                  new Map(combined.map((r) => [r.id, r])).values()
                );
                return unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);
              });
              setLatestBpm(data.readings[0].bpm);
            }
            break;
          case 'sync_status':
            if (data.status) {
              setSyncStatus(data.status);
            }
            break;
          case 'error':
            setError(data.error || 'Unknown error');
            break;
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      setError('Connection lost');
      eventSource.close();
    };

    return eventSource;
  }, [options.deviceId]);

  useEffect(() => {
    if (!options.autoConnect) return;

    const eventSource = connect();
    return () => eventSource.close();
  }, [connect, options.autoConnect]);

  return {
    readings,
    syncStatus,
    isConnected,
    error,
    latestBpm,
    connect,
  };
}
