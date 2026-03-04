import { NextRequest } from 'next/server';
import { hrDataStore } from '@/app/_lib/wearable-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deviceId = searchParams.get('deviceId');

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      sendEvent({ type: 'connected', timestamp: Date.now() });

      const intervalId = setInterval(async () => {
        try {
          const readings = await hrDataStore.getReadings({
            deviceId: deviceId || undefined,
            since: Date.now() - 10000,
            limit: 10,
          });

          if (readings.length > 0) {
            sendEvent({
              type: 'heartrate',
              readings,
              timestamp: Date.now(),
            });
          }

          if (deviceId) {
            const syncStatus = await hrDataStore.getSyncStatus(deviceId);
            if (syncStatus) {
              sendEvent({
                type: 'sync_status',
                status: syncStatus,
                timestamp: Date.now(),
              });
            }
          }
        } catch (error) {
          sendEvent({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: Date.now(),
          });
        }
      }, 2000);

      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
