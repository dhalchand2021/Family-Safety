package com.familysafety.child.engine

import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjection
import android.util.Log
import io.socket.client.Socket
import org.webrtc.*

class WebRTCManager(private val socket: Socket, private val context: Context) {
    private var peerConnection: PeerConnection? = null
    private val factory: PeerConnectionFactory
    private var screenCapturer: VideoCapturer? = null
    private var videoCapturer: VideoCapturer? = null
    private var videoTrack: VideoTrack? = null
    private var audioTrack: AudioTrack? = null

    init {
        PeerConnectionFactory.initialize(
            PeerConnectionFactory.InitializationOptions.builder(context)
                .createInitializationOptions()
        )
        factory = PeerConnectionFactory.builder().createPeerConnectionFactory()
    }

    fun switchCamera() {
        (videoCapturer as? CameraVideoCapturer)?.switchCamera(null)
    }

    fun toggleMute(enabled: Boolean) {
        audioTrack?.setEnabled(enabled)
    }

    fun startScreenShare(sender: String, resultData: Intent) {
        val rtcConfig = PeerConnection.RTCConfiguration(listOf(
            PeerConnection.IceServer.builder("stun:stun.l.google.com:19302").createIceServer()
        ))
        
        peerConnection = factory.createPeerConnection(rtcConfig, object : PeerConnection.Observer {
            override fun onIceCandidate(candidate: IceCandidate) {
                socket.emit("ice-candidate", mapOf("target" to sender, "candidate" to candidate.sdp))
            }
            override fun onDataChannel(p0: DataChannel?) {}
            override fun onIceConnectionChange(p0: PeerConnection.IceConnectionState?) {}
            override fun onIceConnectionReceivingChange(p0: Boolean) {}
            override fun onIceGatheringChange(p0: PeerConnection.IceGatheringState?) {}
            override fun onAddStream(p0: MediaStream?) {}
            override fun onRemoveStream(p0: MediaStream?) {}
            override fun onSignalingChange(p0: PeerConnection.SignalingState?) {}
            override fun onIceCandidatesRemoved(p0: Array<out IceCandidate>?) {}
            override fun onRenegotiationNeeded() {}
            override fun onAddTrack(p0: RtpReceiver?, p1: Array<out MediaStream>?) {}
        })

        screenCapturer = ScreenCapturerAndroid(resultData, object : MediaProjection.Callback() {
            override fun onStop() {
                Log.d("WebRTCManager", "Screen capture stopped")
            }
        })

        val videoSource = factory.createVideoSource(true)
        screenCapturer?.initialize(SurfaceTextureHelper.create("ScreenCaptureThread", EglBase.create().eglBaseContext), context, videoSource.capturerObserver)
        screenCapturer?.startCapture(1280, 720, 30)

        val videoTrack = factory.createVideoTrack("SCREEN_TRACK", videoSource)
        peerConnection?.addTrack(videoTrack)

        peerConnection?.createOffer(object : SdpObserver {
            override fun onCreateSuccess(desc: SessionDescription?) {
                peerConnection?.setLocalDescription(this, desc)
                socket.emit("offer", mapOf("target" to sender, "offer" to desc?.description))
            }
            override fun onSetSuccess() {}
            override fun onCreateFailure(p0: String?) {}
            override fun onSetFailure(p0: String?) {}
        }, MediaConstraints())
    }

    fun addIceCandidate(candidate: IceCandidate) {
        peerConnection?.addIceCandidate(candidate)
    }

    fun handleOffer(sender: String, offerSdp: String, type: String) {
        val rtcConfig = PeerConnection.RTCConfiguration(listOf(
            PeerConnection.IceServer.builder("stun:stun.l.google.com:19302").createIceServer()
        ))
        
        peerConnection = factory.createPeerConnection(rtcConfig, object : PeerConnection.Observer {
            override fun onIceCandidate(candidate: IceCandidate) {
                val data = mapOf(
                    "target" to sender,
                    "candidate" to mapOf(
                        "sdp" to candidate.sdp,
                        "sdpMLineIndex" to candidate.sdpMLineIndex,
                        "sdpMid" to candidate.sdpMid
                    )
                )
                socket.emit("ice-candidate", data)
            }
            override fun onDataChannel(p0: DataChannel?) {}
            override fun onIceConnectionChange(p0: PeerConnection.IceConnectionState?) {}
            override fun onIceConnectionReceivingChange(p0: Boolean) {}
            override fun onIceGatheringChange(p0: PeerConnection.IceGatheringState?) {}
            override fun onAddStream(p0: MediaStream?) {}
            override fun onRemoveStream(p0: MediaStream?) {}
            override fun onSignalingChange(p0: PeerConnection.SignalingState?) {}
            override fun onIceCandidatesRemoved(p0: Array<out IceCandidate>?) {}
            override fun onRenegotiationNeeded() {}
            override fun onAddTrack(p0: RtpReceiver?, p1: Array<out MediaStream>?) {}
        })

        val stream = factory.createLocalMediaStream("ARDAMS")

        // Add Audio
        val audioSource = factory.createAudioSource(MediaConstraints())
        audioTrack = factory.createAudioTrack("ARDAMSa0", audioSource)
        stream.addTrack(audioTrack)

        // Add Video if requested (camera or screen)
        if (type == "video" || type == "screen") {
            setupVideoCapturer(type)
            val videoSource = factory.createVideoSource(type == "screen")
            videoCapturer?.initialize(SurfaceTextureHelper.create("CaptureThread", EglBase.create().eglBaseContext), context, videoSource.capturerObserver)
            videoCapturer?.startCapture(1280, 720, 30)
            videoTrack = factory.createVideoTrack("ARDAMSv0", videoSource)
            stream.addTrack(videoTrack)
        }

        peerConnection?.addStream(stream)

        peerConnection?.setRemoteDescription(object : SdpObserver {
            override fun onCreateSuccess(p0: SessionDescription?) {}
            override fun onSetSuccess() {
                peerConnection?.createAnswer(object : SdpObserver {
                    override fun onCreateSuccess(desc: SessionDescription?) {
                        peerConnection?.setLocalDescription(this, desc)
                        socket.emit("answer", mapOf("target" to sender, "answer" to mapOf("type" to "answer", "sdp" to desc?.description)))
                    }
                    override fun onSetSuccess() {}
                    override fun onCreateFailure(p0: String?) {}
                    override fun onSetFailure(p0: String?) {}
                }, MediaConstraints())
            }
            override fun onCreateFailure(p0: String?) {}
            override fun onSetFailure(p0: String?) {}
        }, SessionDescription(SessionDescription.Type.OFFER, offerSdp))
    }

    private fun setupVideoCapturer(type: String) {
        if (type == "video") {
            val cameraEnumerator = Camera2Enumerator(context)
            val deviceName = cameraEnumerator.deviceNames.firstOrNull { cameraEnumerator.isFrontFacing(it) }
                ?: cameraEnumerator.deviceNames.firstOrNull()
            
            if (deviceName != null) {
                videoCapturer = cameraEnumerator.createCapturer(deviceName, null)
            }
        }
        // Screen capture is handled by startScreenShare method with resultData
    }
}
