'use client';

import { useState, useEffect } from 'react';
import type { WearableDevice } from '@/app/_types/wearable';

export function DeviceManager() {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/wearable/device');
      const data = await response.json();

      if (data.success) {
        setDevices(data.devices);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const registerDevice = async () => {
    const newDevice: WearableDevice = {
      id: `device-${Date.now()}`,
      name: `Wearable Band ${devices.length + 1}`,
      type: 'band',
      batteryLevel: 100,
      isConnected: true,
      lastSync: Date.now(),
      firmwareVersion: '1.0.0',
    };

    try {
      const response = await fetch('/api/wearable/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevice),
      });

      const data = await response.json();
      if (data.success) {
        fetchDevices();
      }
    } catch (err) {
      console.error('Failed to register device:', err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading devices...</div>;
  }

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Device Manager</h2>
        <button
          onClick={registerDevice}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Register Device
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="p-4 border rounded-lg hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{device.name}</h3>
              <div
                className={`w-2 h-2 rounded-full ${
                  device.isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p>Type: <span className="capitalize">{device.type}</span></p>
              <p>Battery: {device.batteryLevel}%</p>
              <p>Firmware: {device.firmwareVersion}</p>
              <p className="text-xs">
                Last sync: {new Date(device.lastSync).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        {devices.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No devices registered. Click &quot;Register Device&quot; to add one.
          </div>
        )}
      </div>
    </div>
  );
}
