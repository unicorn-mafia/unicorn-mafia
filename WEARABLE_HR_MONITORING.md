# Wearable Heart Rate Monitoring Pipeline

## Overview

This implementation provides a complete real-time heart rate monitoring pipeline for wearable devices, featuring continuous data sync, reliable ingestion, and exertion alerts.

## Features

### 1. Real-time Data Sync
- **Server-Sent Events (SSE)**: Continuous streaming of heart rate data from server to client
- **Live Updates**: Real-time BPM display with automatic refresh every 2 seconds
- **Device Status**: Continuous sync status monitoring with connection state tracking

### 2. Reliable Data Ingestion
- **Batch Processing**: Support for bulk ingestion of heart rate readings
- **Data Validation**: Comprehensive validation of BPM values, timestamps, and device IDs
- **Error Handling**: Retry logic with exponential backoff for failed requests
- **Quality Metrics**: Tracking of signal quality and confidence levels

### 3. Exertion Alerts
- **Threshold Detection**: Automatic alerts when BPM exceeds configurable thresholds
  - High BPM: > 180
  - Low BPM: < 40
  - Exertion: ≥ 150
  - Irregular: Sudden changes > 30 BPM
- **Real-time Notifications**: Immediate display of alerts in the UI
- **Alert History**: Persistent tracking of all alert events

### 4. Device Management
- **Multi-device Support**: Register and monitor multiple wearable devices
- **Device Status**: Battery level, firmware version, connection state
- **Sync Monitoring**: Last sync time and pending records count

## Architecture

### API Routes

#### `/api/wearable/ingest` (POST)
Ingests heart rate data from wearable devices.

**Request:**
```json
{
  "deviceId": "device-123",
  "readings": [
    {
      "bpm": 72,
      "timestamp": 1772660493000,
      "deviceId": "device-123",
      "quality": "excellent",
      "confidence": 0.95
    }
  ],
  "syncId": "sync-123",
  "timestamp": 1772660493000
}
```

**Response:**
```json
{
  "success": true,
  "syncId": "sync-123",
  "processedCount": 1,
  "failedCount": 0,
  "nextSyncTime": 1772660498000
}
```

#### `/api/wearable/ingest` (GET)
Retrieves heart rate readings.

**Query Parameters:**
- `deviceId` (optional): Filter by device
- `limit` (optional): Maximum number of readings (default: 100)
- `since` (optional): Timestamp to filter readings after

#### `/api/wearable/device` (POST)
Registers a new wearable device.

#### `/api/wearable/device` (GET)
Retrieves device information and sync status.

#### `/api/wearable/stream` (GET)
Opens a Server-Sent Events stream for real-time updates.

### Data Flow

1. **Wearable Device** → generates heart rate readings
2. **Data Ingestion** → POST to `/api/wearable/ingest`
3. **Validation** → checks BPM range, timestamp validity, device ID
4. **Storage** → in-memory store (scalable to persistent DB)
5. **Processing** → anomaly detection, alert generation
6. **Streaming** → SSE pushes to connected clients
7. **UI Update** → real-time display refresh

### Components

#### `/app/_types/wearable.ts`
TypeScript interfaces for all data structures:
- `HeartRateData`: Core HR measurement
- `WearableDevice`: Device metadata
- `HeartRateReading`: Extended reading with ID
- `SyncStatus`: Device sync state
- `HeartRateAlert`: Alert event
- `MonitoringConfig`: Pipeline configuration

#### `/app/_lib/wearable-storage.ts`
In-memory data store with methods for:
- Adding/retrieving readings
- Device registration and updates
- Sync status management
- Automatic cleanup of old data (keeps last 10,000 readings)

#### `/app/_lib/wearable-utils.ts`
Utility functions:
- `validateHeartRateData()`: Data validation
- `detectAnomalies()`: Alert detection
- `calculateAverageBpm()`: Statistics
- `calculateBpmTrend()`: Trend analysis
- `retryWithBackoff()`: Resilient API calls
- `createSyncId()`: Unique ID generation

#### `/app/_hooks/useHeartRateStream.ts`
React hook for SSE consumption:
- Auto-reconnect on disconnect
- State management for readings and alerts
- Connection status tracking

#### `/app/_components/wearable/HeartRateMonitor.tsx`
Main monitoring dashboard:
- Real-time BPM display
- Sync status indicators
- Alert notifications
- Recent readings table

#### `/app/_components/wearable/DeviceManager.tsx`
Device management interface:
- Device registration
- Status monitoring
- Battery and connection tracking

#### `/app/_components/wearable/TestControls.tsx`
Testing utilities:
- Simulated wearable data generation
- Adjustable BPM baseline
- Exertion simulation

## Configuration

Default configuration in `wearable-utils.ts`:

```typescript
{
  samplingRate: 1000,        // 1 reading per second
  batchSize: 10,             // 10 readings per batch
  syncInterval: 5000,        // Sync every 5 seconds
  thresholds: {
    maxBpm: 180,             // High alert threshold
    minBpm: 40,              // Low alert threshold
    exertionThreshold: 150   // Exertion alert threshold
  },
  retryPolicy: {
    maxRetries: 3,           // Retry failed requests 3 times
    backoffMs: 1000,         // Initial backoff 1 second
    maxBackoffMs: 10000      // Max backoff 10 seconds
  }
}
```

## Testing

### Manual Testing

1. Navigate to `/wearable` page
2. Click "Start Simulation" to begin generating test data
3. Observe real-time updates in the Heart Rate Monitor
4. Adjust BPM slider to test different heart rates
5. Set BPM to 160+ to trigger exertion alerts
6. Click "Simulate Exertion" for automatic high BPM simulation

### API Testing

```bash
# Register a device
curl -X POST http://localhost:3000/api/wearable/device \
  -H "Content-Type: application/json" \
  -d '{
    "id": "device-1",
    "name": "Test Band",
    "type": "band",
    "batteryLevel": 85,
    "isConnected": true,
    "lastSync": 1772660493000,
    "firmwareVersion": "1.0.0"
  }'

# Ingest data
curl -X POST http://localhost:3000/api/wearable/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "device-1",
    "readings": [
      {
        "bpm": 72,
        "timestamp": 1772660493000,
        "deviceId": "device-1",
        "quality": "excellent",
        "confidence": 0.95
      }
    ],
    "syncId": "sync-1",
    "timestamp": 1772660493000
  }'

# Retrieve data
curl http://localhost:3000/api/wearable/ingest?deviceId=device-1&limit=10

# Stream real-time updates
curl -N http://localhost:3000/api/wearable/stream?deviceId=device-1
```

### Test Results

✅ All API endpoints functional
✅ Real-time streaming working
✅ Data validation successful
✅ Alert detection accurate
✅ UI updates in real-time
✅ Device sync status tracked
✅ Error handling and retry logic working

## Production Considerations

### Scalability
- Replace in-memory storage with persistent database (PostgreSQL, MongoDB)
- Use Redis for real-time data caching
- Implement WebSocket clusters for horizontal scaling
- Add message queue (RabbitMQ, Kafka) for reliable ingestion

### Security
- Add authentication/authorization for device registration
- Implement API rate limiting
- Encrypt sensitive health data
- Add HTTPS for all endpoints
- Validate device credentials

### Monitoring
- Add application performance monitoring (APM)
- Track ingestion rates and latency
- Monitor SSE connection health
- Set up alerts for pipeline failures

### Data Retention
- Implement configurable data retention policies
- Archive old readings to cold storage
- Add data export functionality
- Implement GDPR-compliant data deletion

## Dependencies

All required dependencies are already in the project:
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS

No additional packages needed for the core pipeline.

## Future Enhancements

- [ ] Persistent database integration
- [ ] WebSocket support alongside SSE
- [ ] Advanced analytics and trends
- [ ] Historical data visualization (charts)
- [ ] Multi-user support with authentication
- [ ] Mobile app integration
- [ ] Machine learning for anomaly prediction
- [ ] Export to health data formats (Apple Health, Google Fit)
- [ ] Configurable alert thresholds per user
- [ ] Integration with external health APIs
