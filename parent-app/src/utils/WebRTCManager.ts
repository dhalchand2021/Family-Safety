import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
import io, { Socket } from 'socket.io-client';

class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null;
  private socket: Socket;
  private targetId: string | null = null;

  private onRemoteStream: ((stream: any) => void) | null = null;

  constructor(socket: Socket, onRemoteStream?: (stream: any) => void) {
    this.socket = socket;
    this.onRemoteStream = onRemoteStream || null;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('answer', async (data) => {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    this.socket.on('ice-candidate', async (data) => {
      if (this.peerConnection && data.candidate) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error('Error adding ice candidate', e);
        }
      }
    });
  }

  async startCall(targetId: string, streamType: 'audio' | 'video' | 'screen') {
    this.targetId = targetId;
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', { target: targetId, candidate: event.candidate });
      }
    };

    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0] && this.onRemoteStream) {
        this.onRemoteStream(event.streams[0]);
      }
    };

    const isVoice = streamType === 'audio';
    const constraints = {
      audio: true,
      video: !isVoice ? {
        facingMode: 'user'
      } : false,
    };

    const stream = await mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach((track) => {
      this.peerConnection?.addTrack(track, stream);
    });

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit('offer', { target: targetId, offer, type: streamType });
    
    return stream;
  }

  toggleMute(stream: any, enabled: boolean) {
    stream.getAudioTracks().forEach((track: any) => {
      track.enabled = enabled;
    });
  }

  async switchCamera(stream: any) {
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      // @ts-ignore
      videoTrack._switchCamera();
    }
  }

  stopCall() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}

export default WebRTCManager;
