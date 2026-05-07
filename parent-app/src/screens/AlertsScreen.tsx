import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const AlertsScreen = () => {
  // Mock alerts data
  const alerts = [
    { id: '1', type: 'low_battery', message: "Child's Phone battery is below 15%", timestamp: Date.now() - 1000 * 60 * 30, isRead: false },
    { id: '2', type: 'offline', message: "Child's Tablet went offline", timestamp: Date.now() - 1000 * 60 * 60 * 2, isRead: true },
    { id: '3', type: 'permission_disabled', message: "Location permission disabled on Child's Phone", timestamp: Date.now() - 1000 * 60 * 60 * 24, isRead: true },
  ];

  const renderAlertItem = ({ item }: any) => (
    <View style={[styles.alertItem, { borderLeftColor: item.type === 'low_battery' ? '#FF9800' : item.type === 'offline' ? '#F44336' : '#9C27B0' }]}>
      <View style={styles.alertHeader}>
        <Text style={styles.alertMessage}>{item.message}</Text>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.alertTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Alerts</Text>
      </View>

      <FlatList
        data={alerts}
        renderItem={renderAlertItem}
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
  },
  header: {
    padding: 25,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    padding: 15,
  },
  alertItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    elevation: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginLeft: 10,
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default AlertsScreen;
