import { HeartRateMonitor } from '@/app/_components/wearable/HeartRateMonitor';
import { DeviceManager } from '@/app/_components/wearable/DeviceManager';
import { TestControls } from '@/app/_components/wearable/TestControls';

export default function WearablePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Wearable Heart Rate Monitoring
          </h1>
          <p className="text-gray-600">
            Real-time heart rate monitoring pipeline with continuous data sync and exertion alerts
          </p>
        </div>

        <TestControls />

        <DeviceManager />

        <HeartRateMonitor />
      </div>
    </div>
  );
}
