# Family Safety Platform - Setup Guide

## 1. Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Configure `.env` with your Firebase and MongoDB credentials.
4. **Production Run (PM2)**:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "family-safety-api"
   ```
5. **Development Run**: `npm run dev`

## 2. Parent App Setup (React Native)
1. Navigate to `parent-app/`
2. Install dependencies: `npm install`
3. Link native modules: `npx react-native link` (if required, though auto-linking should work)
4. Setup Firebase:
   - Add `google-services.json` to `android/app/`
   - Add `GoogleService-Info.plist` to `ios/`
5. Run on Android: `npm run android`
6. Run on iOS: `npm run ios`

## 3. Child App Setup (Kotlin)
1. Open `child-app/` in Android Studio.
2. Setup Firebase:
   - Add `google-services.json` to `app/`
3. Build and install on a physical Android device (emulators may not support all monitoring features).
4. Grant all requested permissions on first launch.

## 4. Firebase Services
- **Realtime Database**: Apply `infrastructure/firebase-rules.json`.
- **Cloud Messaging (FCM)**:
  - Download `google-services.json` and add it to `child-app/app/` and `parent-app/android/app/`.
  - The `FamilySafetyMessagingService.kt` in the Child app is already set up to handle incoming FCM commands.
- **Authentication**: Enable Email/Password provider in the Firebase Console.
 
 ## 5. Infrastructure & Deployment
- Use the provided `docker-compose.yml` in `infrastructure/` to deploy the backend and MongoDB.
- Configure NGINX using `infrastructure/nginx.conf` as a reverse proxy for the Node.js server.
- The `infrastructure/deploy.sh` script can be used for automated backend deployments.

 ## 6. Build Instructions

### Android (Child App)
1. **Debug Build**:
   ```bash
   ./gradlew assembleDebug
   ```
2. **Release Build**:
   - Create a keystore file: `keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`
   - Configure `signingConfigs` in `app/build.gradle`.
   - Run: `./gradlew assembleRelease`
3. **ProGuard/R8**:
   - Ensure `minifyEnabled true` is set in `build.gradle` for production builds to obfuscate code and reduce APK size.

### React Native (Parent App)
1. **Android**:
   ```bash
   cd android && ./gradlew assembleRelease
   ```
2. **iOS**:
   - Open `ios/FamilySafetyParent.xcworkspace` in Xcode.
   - Select "Generic iOS Device".
   - Go to Product -> Archive.
3. **Hermes**:
   - Enabled by default in `app/build.gradle` for improved performance.

## 6. Advanced Features
- **Geofencing**: Configure geofences in `LocationTrackingScreen.tsx`. The child device will check proximity every 10 seconds and can trigger alerts on entry/exit.
- **Screen Time Analytics**: View detailed app usage distribution and total daily usage in `ScreenTimeScreen.tsx`.
- **Encryption**: All synced logs are encrypted with AES-256-GCM. The shared secret is derived during the ECDH pairing handshake.

## 7. iOS Testing with AltServer
To test the Parent App on an actual iOS device without an Apple Developer Program membership:
1. **Prepare IPA**: You must generate a production IPA of the React Native app (requires a Mac or CI like GitHub Actions).
2. **Install AltServer**: Download and install [AltServer](https://altstore.io/) on your Windows/Mac computer.
3. **Connect Device**: Connect your iPhone to the computer via USB.
4. **Sideload**:
   - Right-click the AltServer icon in the system tray.
   - Select "Install AltStore" -> [Your Device].
   - Once AltStore is on your phone, open it and sign in with your Apple ID.
   - Use a service like `diawi.com` or transfer the generated `.ipa` to your phone.
   - In AltStore, go to "My Apps", tap the "+" icon, and select the `FamilySafetyParent.ipa`.
5. **Trust Certificate**: Go to Settings -> General -> VPN & Device Management on your iPhone and trust your Apple ID certificate.

## 8. Deployment
- The backend is ready for Dockerized deployment.
- Use the `infrastructure/nginx.conf` for reverse proxy setup.
- Ensure STUN/TURN servers are configured in `WebRTCManager` for production use.
