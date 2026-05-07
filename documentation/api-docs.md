# Family Safety Platform - API Documentation

## Authentication APIs

### Register User
- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "parent"
  }
  ```
- **Success Response**: `200 OK` with JWT token and user info.

### Login User
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response**: `200 OK` with JWT token and user info.

---

## Device APIs

### Register Device (Parent)
- **URL**: `/api/v1/devices/register`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "deviceId": "unique-hw-id",
    "name": "Child's Phone"
  }
  ```
- **Success Response**: `201 Created` with pairing token.

### Pair Device (Child)
- **URL**: `/api/v1/devices/pair`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "deviceId": "unique-hw-id",
    "pairingToken": "ABC123"
  }
  ```
- **Success Response**: `200 OK`.

### Get Devices (Parent)
- **URL**: `/api/v1/devices`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**: `200 OK` with list of devices.

---

## Real-time Signaling (Socket.IO)

### Events
- `join`: Join a room (`deviceId`).
- `offer`: Send WebRTC offer.
- `answer`: Send WebRTC answer.
- `ice-candidate`: Send ICE candidates.
- `command`: Send commands to child device (`start-audio`, `stop-audio`, `start-video`, `stop-video`, `sync-now`).

---

## Firebase Data Structure (Realtime Database)

- `telemetry/{deviceId}`: Real-time status (battery, network, lastSync).
- `usage/{deviceId}`: App usage stats.
- `sms/{deviceId}/{logId}`: SMS logs.
- `calls/{deviceId}/{logId}`: Call logs.
- `location/{deviceId}/{logId}`: Location history.
