import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const InstalledAppsScreen = () => {
  // Mock installed apps data
  const apps = [
    { id: '1', name: 'YouTube', packageName: 'com.google.android.youtube' },
    { id: '2', name: 'Instagram', packageName: 'com.instagram.android' },
    { id: '3', name: 'TikTok', packageName: 'com.zhiliaoapp.musically' },
    { id: '4', name: 'Roblox', packageName: 'com.roblox.client' },
    { id: '5', name: 'WhatsApp', packageName: 'com.whatsapp' },
    { id: '6', name: 'Snapchat', packageName: 'com.snapchat.android' },
  ];

  const renderAppItem = ({ item }: any) => (
    <View style={styles.appItem}>
      <View style={styles.appIconPlaceholder}>
        <Text style={styles.appIconText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.appInfo}>
        <Text style={styles.appName}>{item.name}</Text>
        <Text style={styles.appPackage}>{item.packageName}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Installed Apps</Text>
        <Text style={styles.subtitle}>{apps.length} Apps monitored</Text>
      </View>

      <FlatList
        data={apps}
        renderItem={renderAppItem}
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 15,
  },
  appItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
  },
  appIconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  appIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appPackage: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});

export default InstalledAppsScreen;
