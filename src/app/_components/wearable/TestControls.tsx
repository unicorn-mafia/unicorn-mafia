'use client';

import { useState, useEffect } from 'react';
import { WearableSimulator } from '@/app/_lib/wearable-test-simulator';

let simulator: WearableSimulator | null = null;
let stopSync: (() => void) | null = null;

export function TestControls() {
  const [deviceId, setDeviceId] = useState('test-device-1');
  const [isSimulating, setIsSimulating] = useState(false);
  const [bpm, setBpm] = useState(70);

  useEffect(() => {
    return () => {
      if (stopSync) {
        stopSync();
      }
    };
  }, []);

  const startSimulation = async () => {
    if (!simulator) {
      simulator = new WearableSimulator(deviceId);
    }

    stopSync = await simulator.startContinuousSync(3000);
    setIsSimulating(true);
  };

  const stopSimulation = () => {
    if (stopSync) {
      stopSync();
      stopSync = null;
    }
    setIsSimulating(false);
  };

  const triggerExertion = () => {
    if (simulator) {
      simulator.simulateExertion();
    }
  };

  const updateBpm = (newBpm: number) => {
    setBpm(newBpm);
    if (simulator) {
      simulator.setBpm(newBpm);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg border-2 border-dashed border-blue-300">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        <h2 className="text-2xl font-bold">Test Controls</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Device ID
          </label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            disabled={isSimulating}
            className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Baseline BPM: {bpm}
          </label>
          <input
            type="range"
            min="50"
            max="180"
            value={bpm}
            onChange={(e) => updateBpm(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          {!isSimulating ? (
            <button
              onClick={startSimulation}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Start Simulation
            </button>
          ) : (
            <button
              onClick={stopSimulation}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Stop Simulation
            </button>
          )}

          <button
            onClick={triggerExertion}
            disabled={!isSimulating}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition disabled:bg-gray-400"
          >
            Simulate Exertion
          </button>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-md text-sm">
        <p className="font-semibold mb-2">📝 Test Instructions:</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>Click &quot;Start Simulation&quot; to begin sending HR data</li>
          <li>Adjust the BPM slider to change heart rate</li>
          <li>Click &quot;Simulate Exertion&quot; to trigger alerts</li>
          <li>Monitor the real-time updates below</li>
        </ol>
      </div>
    </div>
  );
}
