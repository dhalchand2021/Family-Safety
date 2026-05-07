import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import WebRTCManager from '../utils/WebRTCManager';
import io from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

const LiveViewScreen = ({ route, navigation }: any) => {
  const { deviceId, type } = route.params;
  const { token } = useAuthStore();
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [localStream, setLocalStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const webrtcManager = useRef<WebRTCManager | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:5000', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    webrtcManager.current = new WebRTCManager(socket, (stream) => {
      setRemoteStream(stream);
      setLoading(false);
    });

    const startSession = async () => {
      try {
        const stream = await webrtcManager.current?.startCall(deviceId, type);
        setLocalStream(stream);
      } catch (error) {
        console.error('Failed to start WebRTC session', error);
        navigation.goBack();
      }
    };

    startSession();

    return () => {
      webrtcManager.current?.stopCall();
      socket.disconnect();
    };
  }, [deviceId, type]);

  const toggleMute = () => {
    if (localStream && webrtcManager.current) {
      const newMuteState = !isMuted;
      webrtcManager.current.toggleMute(localStream, !newMuteState);
      setIsMuted(newMuteState);
    }
  };

  const switchCamera = () => {
    if (localStream && webrtcManager.current) {
      webrtcManager.current.switchCamera(localStream);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Live {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.streamContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : type === 'video' || type === 'screen' ? (
          remoteStream ? (
            <RTCView
              streamURL={remoteStream.toURL()}
              style={styles.rtcView}
              objectFit="cover"
            />
          ) : (
            <Text style={styles.infoText}>Waiting for video stream...</Text>
          )
        ) : (
          <View style={styles.audioView}>
            <Text style={styles.infoText}>Listening to live audio...</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          <Text style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>
        {type === 'video' && (
          <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
            <Text style={styles.controlText}>Switch Camera</Text>
          </TouchableOpacity>
        )}
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
  streamContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rtcView: {
    width: '100%',
    height: '100%',
  },
  audioView: {
    alignItems: 'center',
  },
  infoText: {
    color: '#FFF',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controlButton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    minWidth: 100,
    alignItems: 'center',
  },
  controlText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default LiveViewScreen;
