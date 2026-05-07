import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/useAuthStore';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DeviceDetailScreen from '../screens/DeviceDetailScreen';
import LiveViewScreen from '../screens/LiveViewScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import ScreenTimeScreen from '../screens/ScreenTimeScreen';
import LocationTrackingScreen from '../screens/LocationTrackingScreen';
import AlertsScreen from '../screens/AlertsScreen';
import InstalledAppsScreen from '../screens/InstalledAppsScreen';
import SmsHistoryScreen from '../screens/SmsHistoryScreen';
import CallHistoryScreen from '../screens/CallHistoryScreen';
import NotificationHistoryScreen from '../screens/NotificationHistoryScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { token } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
            <Stack.Screen name="LiveView" component={LiveViewScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen name="ScreenTime" component={ScreenTimeScreen} />
            <Stack.Screen name="LocationTracking" component={LocationTrackingScreen} />
            <Stack.Screen name="Alerts" component={AlertsScreen} />
            <Stack.Screen name="InstalledApps" component={InstalledAppsScreen} />
            <Stack.Screen name="SmsHistory" component={SmsHistoryScreen} />
            <Stack.Screen name="CallHistory" component={CallHistoryScreen} />
            <Stack.Screen name="NotificationHistory" component={NotificationHistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
