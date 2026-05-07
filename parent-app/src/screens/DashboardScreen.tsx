import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

const DashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();
  
  // Mock data for devices
  const devices = [
    { id: '1', name: "Child's Phone", status: 'online', battery: 85 },
    { id: '2', name: "Child's Tablet", status: 'offline', battery: 12 },
  ];

  const renderDeviceCard = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('DeviceDetail', { deviceId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'online' ? '#4CAF50' : '#F44336' }]} />
      </View>
      <Text style={styles.batteryText}>Battery: {item.battery}%</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
            <Text style={styles.alertLink}>Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle}>Your Devices</Text>
      
      <FlatList
        data={devices}
        renderItem={renderDeviceCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertLink: {
    color: '#F44336',
    fontWeight: '600',
    marginRight: 15,
  },
  logoutText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#666',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  batteryText: {
    color: '#888',
  },
});

export default DashboardScreen;
