import { NextRequest, NextResponse } from 'next/server';
import type { WearableDevice } from '@/app/_types/wearable';
import { hrDataStore } from '@/app/_lib/wearable-storage';

export async function POST(request: NextRequest) {
  try {
    const device: WearableDevice = await request.json();

    if (!device.id || !device.name || !device.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required device fields' },
        { status: 400 }
      );
    }

    await hrDataStore.registerDevice(device);

    return NextResponse.json({
      success: true,
      device,
      message: 'Device registered successfully',
    });
  } catch (error) {
    console.error('Error registering device:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register device' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deviceId = searchParams.get('deviceId');

    if (deviceId) {
      const device = await hrDataStore.getDevice(deviceId);
      const syncStatus = await hrDataStore.getSyncStatus(deviceId);

      if (!device) {
        return NextResponse.json(
          { success: false, error: 'Device not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        device,
        syncStatus,
      });
    }

    const devices = await hrDataStore.getAllDevices();
    return NextResponse.json({
      success: true,
      count: devices.length,
      devices,
    });
  } catch (error) {
    console.error('Error fetching device(s):', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch device data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { deviceId, updates } = await request.json();

    if (!deviceId) {
      return NextResponse.json(
        { success: false, error: 'deviceId required' },
        { status: 400 }
      );
    }

    await hrDataStore.updateDevice(deviceId, updates);

    return NextResponse.json({
      success: true,
      message: 'Device updated successfully',
    });
  } catch (error) {
    console.error('Error updating device:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update device' },
      { status: 500 }
    );
  }
}
