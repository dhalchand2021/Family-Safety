import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const QRScannerScreen = ({ navigation }: any) => {
  const [scanning, setScanning] = useState(true);
  const { token } = useAuthStore();

  const handleBarCodeRead = (result: string) => {
    if (!scanning) return;
    setScanning(false);

    // Expected format: family-safety-pair:deviceId:token:publicKey
    if (result.startsWith('family-safety-pair:')) {
      const [_, deviceId, pairingToken, childPublicKey] = result.split(':');
      pairDevice(deviceId, pairingToken, childPublicKey);
    } else {
      Alert.alert('Invalid QR Code', 'Please scan a valid Family Safety pairing code.');
      setScanning(true);
    }
  };

  const pairDevice = async (deviceId: string, pairingToken: string, childPublicKey: string) => {
    try {
      // In production, the parent would also generate an ECDH key pair
      // and compute the shared secret using childPublicKey
      
      await axios.post('http://localhost:5000/api/v1/devices/pair', {
        deviceId,
        pairingToken,
        parentPublicKey: 'MOCK_PARENT_PUBLIC_KEY' // Send to child to complete ECDH
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Success', 'Device paired successfully!');
      navigation.navigate('Dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Pairing failed';
      Alert.alert('Pairing Failed', message);
      setScanning(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.cameraContainer}>
        <Text style={styles.instruction}>Point your camera at the child's device</Text>
        <View style={styles.scannerPlaceholder}>
           <Text style={styles.mockText}>[ CAMERA VIEW ]</Text>
           {/* Simulate a successful scan for demonstration */}
           <TouchableOpacity 
             style={styles.simulateBtn}
             onPress={() => handleBarCodeRead('family-safety-pair:mock-device-123:456789')}
           >
             <Text style={styles.simulateBtnText}>Simulate Scan</Text>
           </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backText: {
    color: '#FFF',
    fontSize: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 30,
  },
  scannerPlaceholder: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  mockText: {
    color: '#FFF',
    marginBottom: 20,
  },
  simulateBtn: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
  },
  simulateBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});

export default QRScannerScreen;
