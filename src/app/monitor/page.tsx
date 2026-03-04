"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Settings, Activity, AlertTriangle } from "lucide-react";

export default function HeartRateMonitor() {
  const [heartRate, setHeartRate] = useState<number>(72);
  const [threshold, setThreshold] = useState<number>(150);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<
    Array<{ id: number; message: string; timestamp: Date }>
  >([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isExceeded, setIsExceeded] = useState<boolean>(false);

  const triggerVibration = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }, []);

  const addAlert = useCallback(
    (message: string) => {
      const newAlert = {
        id: Date.now(),
        message,
        timestamp: new Date(),
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
      triggerVibration();
    },
    [triggerVibration],
  );

  const simulateHeartRate = useCallback(() => {
    const baseRate = 70;
    const variation = Math.random() * 40;
    const spike = Math.random() > 0.9 ? Math.random() * 60 : 0;
    return Math.round(baseRate + variation + spike);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring) {
      interval = setInterval(() => {
        const newRate = simulateHeartRate();
        setHeartRate(newRate);

        if (newRate > threshold && !isExceeded) {
          setIsExceeded(true);
          addAlert(
            `Heart rate exceeded threshold! Current: ${newRate} BPM, Threshold: ${threshold} BPM`,
          );
        } else if (newRate <= threshold && isExceeded) {
          setIsExceeded(false);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, threshold, isExceeded, addAlert, simulateHeartRate]);

  const clearAlerts = () => {
    setAlerts([]);
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      setIsExceeded(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Heart Rate Monitor
          </h1>
          <p className="text-gray-600">
            Real-time exertion monitoring with alerts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Heart
                    className={`w-8 h-8 ${isMonitoring && heartRate > threshold ? "text-red-500 animate-pulse" : "text-blue-500"}`}
                  />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Current Heart Rate
                  </h2>
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="text-center mb-8">
                <div
                  className={`text-8xl font-bold mb-2 ${
                    isMonitoring
                      ? heartRate > threshold
                        ? "text-red-500"
                        : "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  {heartRate}
                </div>
                <div className="text-xl text-gray-600">BPM</div>
              </div>

              {showSettings && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exertion Threshold: {threshold} BPM
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="200"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>100 BPM</span>
                    <span>200 BPM</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={toggleMonitoring}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all ${
                    isMonitoring
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
                </button>
                <button
                  onClick={clearAlerts}
                  disabled={alerts.length === 0}
                  className="py-4 px-6 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Alerts
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Status:</p>
                    <p>
                      {isMonitoring
                        ? heartRate > threshold
                          ? "⚠️ Exertion threshold exceeded!"
                          : "✅ Heart rate within safe limits"
                        : "🔵 Monitoring paused"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Alert History
                </h2>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No alerts yet. Start monitoring to track exertion levels.
                  </p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 break-words">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Real-time heart rate monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Customizable exertion threshold</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>In-app visual alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Vibration notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Alert history tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
