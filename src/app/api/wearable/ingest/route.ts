import { NextRequest, NextResponse } from 'next/server';
import type {
  DataIngestionRequest,
  DataIngestionResponse,
  HeartRateReading,
} from '@/app/_types/wearable';
import { hrDataStore } from '@/app/_lib/wearable-storage';
import { validateHeartRateData } from '@/app/_lib/wearable-utils';

export async function POST(request: NextRequest) {
  try {
    const body: DataIngestionRequest = await request.json();

    if (!body.deviceId || !body.readings || !Array.isArray(body.readings)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: deviceId and readings array required',
        },
        { status: 400 }
      );
    }

    const processedReadings: HeartRateReading[] = [];
    const errors: string[] = [];

    for (const reading of body.readings) {
      try {
        const validation = validateHeartRateData(reading);
        if (!validation.valid) {
          errors.push(
            `Reading at ${reading.timestamp}: ${validation.error}`
          );
          continue;
        }

        const hrReading: HeartRateReading = {
          id: `${body.deviceId}-${reading.timestamp}`,
          ...reading,
        };

        await hrDataStore.addReading(hrReading);
        processedReadings.push(hrReading);
      } catch (error) {
        errors.push(
          `Failed to process reading: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    await hrDataStore.updateDeviceSync(body.deviceId, {
      lastSyncTime: Date.now(),
      status: errors.length === 0 ? 'synced' : 'error',
      errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
    });

    const response: DataIngestionResponse = {
      success: processedReadings.length > 0,
      syncId: body.syncId,
      processedCount: processedReadings.length,
      failedCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      nextSyncTime: Date.now() + 5000,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in HR data ingestion:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deviceId = searchParams.get('deviceId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const since = searchParams.get('since')
      ? parseInt(searchParams.get('since')!)
      : undefined;

    const readings = await hrDataStore.getReadings({
      deviceId: deviceId || undefined,
      since,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: readings.length,
      readings,
    });
  } catch (error) {
    console.error('Error fetching HR data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch readings',
      },
      { status: 500 }
    );
  }
}
