'use client';

import { useEffect, useState } from 'react';
import { useHeartRateStream } from '@/app/_hooks/useHeartRateStream';
import { detectAnomalies } from '@/app/_lib/wearable-utils';
import type { HeartRateAlert } from '@/app/_types/wearable';

interface HeartRateMonitorProps {
  deviceId?: string;
}

export function HeartRateMonitor({ deviceId }: HeartRateMonitorProps) {
  const {
    readings,
    syncStatus,
    isConnected,
    error,
    latestBpm,
  } = useHeartRateStream({
    deviceId,
    autoConnect: true,
  });

  const [alerts, setAlerts] = useState<HeartRateAlert[]>([]);

  useEffect(() => {
    if (readings.length > 0) {
      const newAlerts = detectAnomalies(readings.slice(0, 10));
      setAlerts(newAlerts);
    }
  }, [readings]);

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Heart Rate Monitor</h2>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Current BPM</p>
          <p className="text-4xl font-bold text-blue-900">
            {latestBpm || '--'}
          </p>
        </div>

        {syncStatus && (
          <>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <p className="text-lg font-semibold text-purple-900 capitalize">
                {syncStatus.status}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(syncStatus.lastSyncTime).toLocaleTimeString()}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-4xl font-bold text-green-900">
                {syncStatus.pendingRecords}
              </p>
            </div>
          </>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'high'
                  ? 'bg-red-50 border-red-500'
                  : alert.type === 'low'
                    ? 'bg-yellow-50 border-yellow-500'
                    : alert.type === 'exertion'
                      ? 'bg-orange-50 border-orange-500'
                      : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold capitalize">{alert.type} Heart Rate</p>
                  <p className="text-sm text-gray-600">
                    {alert.bpm} BPM (threshold: {alert.threshold})
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Recent Readings</h3>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">BPM</th>
                <th className="px-4 py-2 text-left">Quality</th>
                <th className="px-4 py-2 text-left">Device</th>
              </tr>
            </thead>
            <tbody>
              {readings.slice(0, 20).map((reading) => (
                <tr key={reading.id} className="border-t">
                  <td className="px-4 py-2">
                    {new Date(reading.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-2 font-semibold">{reading.bpm}</td>
                  <td className="px-4 py-2 capitalize">{reading.quality}</td>
                  <td className="px-4 py-2 text-gray-600 text-xs">
                    {reading.deviceId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
