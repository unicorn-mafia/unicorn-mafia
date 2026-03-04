import type {
  HeartRateReading,
  WearableDevice,
  SyncStatus,
} from '@/app/_types/wearable';

class HeartRateDataStore {
  private readings: Map<string, HeartRateReading> = new Map();
  private devices: Map<string, WearableDevice> = new Map();
  private syncStatuses: Map<string, SyncStatus> = new Map();
  private readingsIndex: HeartRateReading[] = [];

  async addReading(reading: HeartRateReading): Promise<void> {
    this.readings.set(reading.id, reading);
    this.readingsIndex.push(reading);

    this.readingsIndex.sort((a, b) => b.timestamp - a.timestamp);

    if (this.readingsIndex.length > 10000) {
      const toRemove = this.readingsIndex.slice(10000);
      toRemove.forEach((r) => this.readings.delete(r.id));
      this.readingsIndex = this.readingsIndex.slice(0, 10000);
    }
  }

  async getReadings(filters?: {
    deviceId?: string;
    since?: number;
    limit?: number;
  }): Promise<HeartRateReading[]> {
    let filtered = this.readingsIndex;

    if (filters?.deviceId) {
      filtered = filtered.filter((r) => r.deviceId === filters.deviceId);
    }

    if (filters?.since) {
      filtered = filtered.filter((r) => r.timestamp >= filters.since!);
    }

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  async registerDevice(device: WearableDevice): Promise<void> {
    this.devices.set(device.id, device);

    if (!this.syncStatuses.has(device.id)) {
      this.syncStatuses.set(device.id, {
        deviceId: device.id,
        status: device.isConnected ? 'synced' : 'disconnected',
        lastSyncTime: device.lastSync,
        pendingRecords: 0,
      });
    }
  }

  async getDevice(deviceId: string): Promise<WearableDevice | null> {
    return this.devices.get(deviceId) || null;
  }

  async getAllDevices(): Promise<WearableDevice[]> {
    return Array.from(this.devices.values());
  }

  async updateDevice(
    deviceId: string,
    updates: Partial<WearableDevice>
  ): Promise<void> {
    const device = this.devices.get(deviceId);
    if (device) {
      this.devices.set(deviceId, { ...device, ...updates });
    }
  }

  async getSyncStatus(deviceId: string): Promise<SyncStatus | null> {
    return this.syncStatuses.get(deviceId) || null;
  }

  async updateDeviceSync(
    deviceId: string,
    updates: Partial<SyncStatus>
  ): Promise<void> {
    const currentStatus = this.syncStatuses.get(deviceId);
    if (currentStatus) {
      this.syncStatuses.set(deviceId, { ...currentStatus, ...updates });
    } else {
      this.syncStatuses.set(deviceId, {
        deviceId,
        status: 'synced',
        lastSyncTime: Date.now(),
        pendingRecords: 0,
        ...updates,
      });
    }

    const device = this.devices.get(deviceId);
    if (device && updates.lastSyncTime) {
      await this.updateDevice(deviceId, {
        lastSync: updates.lastSyncTime,
        isConnected: updates.status !== 'disconnected',
      });
    }
  }

  async clearOldReadings(olderThan: number): Promise<number> {
    const before = this.readings.size;
    this.readingsIndex = this.readingsIndex.filter(
      (r) => r.timestamp >= olderThan
    );
    this.readings.clear();
    this.readingsIndex.forEach((r) => this.readings.set(r.id, r));
    return before - this.readings.size;
  }

  async getStats() {
    return {
      totalReadings: this.readings.size,
      totalDevices: this.devices.size,
      activeDevices: Array.from(this.devices.values()).filter(
        (d) => d.isConnected
      ).length,
    };
  }
}

export const hrDataStore = new HeartRateDataStore();
