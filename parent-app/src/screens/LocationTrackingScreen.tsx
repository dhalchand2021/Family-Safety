import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';

const LocationTrackingScreen = ({ route, navigation }: any) => {
  const { deviceId } = route.params;

  // Mock location data
  const location = {
    latitude: 37.78825,
    longitude: -122.4324,
    address: '123 Market St, San Francisco, CA',
    lastUpdated: '5 mins ago'
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Live Location</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mapPlaceholder}>
        {/* 
          In a real app, use:
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          </MapView>
        */}
        <Text style={styles.mapText}>[ INTERACTIVE MAP VIEW ]</Text>
        <View style={styles.markerMock} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.addressLabel}>Current Address</Text>
        <Text style={styles.addressText}>{location.address}</Text>
        <Text style={styles.updateText}>Last updated: {location.lastUpdated}</Text>
        
        <View style={styles.geofenceHeader}>
          <Text style={styles.sectionTitleSmall}>Active Geofences</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.geofenceItem}>
          <View>
            <Text style={styles.geofenceName}>School Zone</Text>
            <Text style={styles.geofenceDetail}>500m radius • Alert on Entry/Exit</Text>
          </View>
          <View style={[styles.statusBadgeSmall, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.statusTextSmall}>INSIDE</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.historyBtn} onPress={() => {}}>
          <Text style={styles.historyBtnText}>View Movement History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  backText: {
    color: '#2196F3',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#888',
    fontWeight: 'bold',
  },
  markerMock: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F44336',
    borderWidth: 2,
    borderColor: '#FFF',
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  addressLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  updateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  geofenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionTitleSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  addBtn: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addBtnText: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 12,
  },
  geofenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  geofenceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  geofenceDetail: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusTextSmall: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  historyBtn: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  historyBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default LocationTrackingScreen;
