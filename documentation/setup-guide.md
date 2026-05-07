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

## 7. iOS Testing with AltServer & GitHub Actions
To test the Parent App on an actual iOS device without an Apple Developer Program membership:

### Option A: Build via GitHub Actions (Recommended)
1. **Push to GitHub**: The project includes a GitHub Actions workflow in `.github/workflows/ios-build.yml`.
2. **Missing Native Folders**: If your repository is missing the `ios/` folder, run the following in `parent-app/` on a local machine first:
   ```bash
   npx react-native-asset
   # Or if starting fresh:
   npx react-native init FamilySafetyParent --directory .
   ```
3. **Trigger Build**: Go to your GitHub repository -> **Actions** -> **iOS IPA Build** -> **Run workflow**.
4. **Download IPA**: Once complete, download the artifact from the build summary.

### Option B: Build Manually (Requires a Mac)
1. Navigate to `parent-app/` and run `npm install`.
2. Generate the iOS bundle:
   ```bash
   npx react-native bundle --dev false --platform ios --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios
   ```
3. Open the project in Xcode (`ios/FamilySafetyParent.xcworkspace`).
4. Set the build destination to **Any iOS Device (arm64)**.
5. Go to **Product > Archive**.
6. Once the archive is created, select **Distribute App > Ad Hoc** or **Development**.
7. Export the `.ipa` file.

### 2. Sideloading via AltServer (Windows/Mac)
1. **Download AltServer**: Get it from [altstore.io](https://altstore.io/).
2. **Installation**:
   - On Windows: Install iCloud and iTunes (not from Microsoft Store, use the direct Apple versions).
   - Run AltServer and connect your iPhone via USB.
3. **Install AltStore**:
   - Right-click AltServer in the system tray -> **Install AltStore** -> **[Your iPhone Name]**.
   - Enter your Apple ID and password (used for signing).
4. **Install the Parent App**:
   - Transfer the `.ipa` file to your iPhone (via AirDrop, iCloud Drive, or Email).
   - Open **AltStore** on your iPhone.
   - Go to the **My Apps** tab and tap the **+** icon at the top left.
   - Select the `FamilySafetyParent.ipa` file.
   - AltStore will sign and install the app.
5. **Trust the App**:
   - Go to **Settings > General > VPN & Device Management**.
   - Tap your Apple ID and select **Trust**.

*Note: Sideloaded apps expire after 7 days. You can refresh them in AltStore while connected to the same Wi-Fi as AltServer.*

## 8. GitHub Repository
The codebase is hosted at: `https://github.com/dhalchand2021/Family-Safety`
To update the repository:
```bash
git add .
git commit -m "Your update message"
git push origin main
```
