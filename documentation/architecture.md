# Family Safety Platform - Architecture Documentation

## System Overview
The Family Safety Platform is a cross-platform system designed for parental monitoring and child safety. It consists of three main components: a Parent App (React Native), a Child App (Kotlin Android), and a Node.js Backend Server.

## 1. Parent App (React Native)
- **Role**: Dashboard for parents to monitor child activity, receive alerts, and initiate live streaming.
- **Tech Stack**: TypeScript, React Navigation, Zustand (State Management), React Query (Data Fetching), Socket.IO Client, WebRTC.
- **Key Features**:
  - Authentication & Profile Management.
  - Device Pairing via QR Code scanning.
  - Real-time Telemetry Dashboard (Battery, Network, Online status).
  - Activity History (SMS, Calls, App Usage).
  - Live Monitoring (WebRTC Audio/Video/Screen Share).

## 2. Child App (Kotlin Android)
- **Role**: Background monitoring and real-time data sync from the child's device.
- **Tech Stack**: Kotlin, Android SDK, Foreground Services, WorkManager, Firebase SDK, WebRTC Android SDK, Socket.IO Client.
- **Key Features**:
  - Persistent Foreground Service with visible notification (Compliance).
  - Monitoring Engine (SMS, Call logs, Notifications, App Usage, Location).
  - Telemetry Sync (Battery level, Network type).
  - Command Listener for real-time parent actions.
  - WebRTC Engine for live streaming sessions.

## 3. Backend Server (Node.js/Express)
- **Role**: Authentication, Device orchestration, and WebRTC signaling.
- **Tech Stack**: Node.js, Express.js, MongoDB (via Mongoose), Socket.IO, JWT.
- **Key Features**:
  - RESTful APIs for User/Device management.
  - Socket.IO signaling server for WebRTC handshakes.
  - Secure Command Relay from parent to child.

## 4. Data Flow & Synchronization
- **Metadata & History**: Synced directly from the Child App to **Firebase Realtime Database**.
- **Real-time Commands**: Routed through the **Node.js Socket.IO server**.
- **Live Streams**: Established via **WebRTC Peer-to-Peer** connections (Signaling via Node.js).
- **Authentication**: Managed via **JWT** tokens issued by the Node.js server.

## 5. Security & Privacy
- **Consent-based**: Monitoring requires the Child App to be installed and paired explicitly.
- **Transparency**: A persistent notification is always visible on the child's device when monitoring is active.
- **Encryption**: WebRTC streams are encrypted via DTLS-SRTP. API communication is via HTTPS.
- **Access Control**: Firebase Security Rules ensure parents only see data for their paired devices.
