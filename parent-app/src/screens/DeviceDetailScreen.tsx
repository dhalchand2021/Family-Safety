import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DeviceDetailScreen = ({ route, navigation }: any) => {
  const { deviceId } = route.params;

  // Mock telemetry data
  const telemetry = {
    battery: 85,
    network: 'WiFi',
    lastSync: '2 mins ago',
    status: 'online'
  };

  const ActionButton = ({ title, icon, onPress, color = '#2196F3' }: any) => (
    <TouchableOpacity 
      style={[styles.actionButton, { backgroundColor: color }]} 
      onPress={onPress}
    >
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.deviceName}>Child's Phone</Text>
        <View style={[styles.statusBadge, { backgroundColor: telemetry.status === 'online' ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.statusText}>{telemetry.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.telemetryCard}>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>Battery</Text>
          <Text style={styles.telemetryValue}>{telemetry.battery}%</Text>
        </View>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>Network</Text>
          <Text style={styles.telemetryValue}>{telemetry.network}</Text>
        </View>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>Last Sync</Text>
          <Text style={styles.telemetryValue}>{telemetry.lastSync}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Real-time Monitoring</Text>
      <View style={styles.actionGrid}>
        <ActionButton 
          title="Live Audio" 
          onPress={() => navigation.navigate('LiveView', { deviceId, type: 'audio' })} 
          color="#FF9800"
        />
        <ActionButton 
          title="Live Video" 
          onPress={() => navigation.navigate('LiveView', { deviceId, type: 'video' })} 
          color="#E91E63"
        />
        <ActionButton 
          title="Screen Share" 
          onPress={() => navigation.navigate('LiveView', { deviceId, type: 'screen' })} 
          color="#9C27B0"
        />
      </View>

      <Text style={styles.sectionTitle}>Activity History</Text>
      <View style={styles.historyLinks}>
        <TouchableOpacity style={styles.historyLink} onPress={() => navigation.navigate('SmsHistory', { deviceId })}>
          <Text style={styles.historyLinkText}>SMS Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyLink} onPress={() => navigation.navigate('CallHistory', { deviceId })}>
          <Text style={styles.historyLinkText}>Call History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyLink} onPress={() => navigation.navigate('NotificationHistory', { deviceId })}>
          <Text style={styles.historyLinkText}>App Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyLink} onPress={() => navigation.navigate('ScreenTime', { deviceId })}>
          <Text style={styles.historyLinkText}>App Usage & Screen Time</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyLink} onPress={() => navigation.navigate('InstalledApps', { deviceId })}>
          <Text style={styles.historyLinkText}>Installed Apps List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyLink} onPress={() => navigation.navigate('LocationTracking', { deviceId })}>
          <Text style={styles.historyLinkText}>Location History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 25,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  telemetryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 1,
  },
  telemetryItem: {
    alignItems: 'center',
  },
  telemetryLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  telemetryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
    color: '#444',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  historyLinks: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  historyLink: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyLinkText: {
    fontSize: 16,
    color: '#333',
  },
});

export default DeviceDetailScreen;
