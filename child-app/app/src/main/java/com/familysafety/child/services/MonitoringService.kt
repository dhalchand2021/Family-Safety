package com.familysafety.child.services

import android.app.*
import android.content.Intent
import android.os.IBinder
import android.os.Build
import androidx.core.app.NotificationCompat
import com.familysafety.child.R
import com.familysafety.child.MainActivity

import com.familysafety.child.engine.MonitoringEngine
import com.familysafety.child.engine.CommandListener
import com.familysafety.child.engine.WebRTCManager
import com.familysafety.child.utils.PreferenceHelper
import io.socket.client.IO
import io.socket.client.Socket

class MonitoringService : Service() {

    private val CHANNEL_ID = "MonitoringServiceChannel"
    private var socket: Socket? = null
    private var monitoringEngine: MonitoringEngine? = null
    private var commandListener: CommandListener? = null
    private var webRTCManager: WebRTCManager? = null
    private lateinit var preferenceHelper: PreferenceHelper

    override fun onCreate() {
        super.onCreate()
        preferenceHelper = PreferenceHelper(this)
        createNotificationChannel()
        if (preferenceHelper.isPaired) {
            setupSocket()
        }
    }

    private fun setupSocket() {
        try {
            val deviceId = preferenceHelper.deviceId ?: return
            val token = preferenceHelper.pairingToken ?: ""
            
            val opts = IO.Options()
            opts.auth = mapOf("token" to token, "deviceId" to deviceId)
            opts.reconnection = true
            opts.reconnectionAttempts = 50
            opts.reconnectionDelay = 3000
            
            socket = IO.socket("http://localhost:5000", opts)
            
            socket?.on(Socket.EVENT_CONNECT) {
                Log.d("MonitoringService", "Socket Connected")
            }

            socket?.on(Socket.EVENT_DISCONNECT) {
                Log.d("MonitoringService", "Socket Disconnected")
            }

            socket?.on(Socket.EVENT_CONNECT_ERROR) { args ->
                Log.e("MonitoringService", "Socket Connect Error: ${args[0]}")
            }

            socket?.connect()

            monitoringEngine = MonitoringEngine(this, deviceId)
            webRTCManager = WebRTCManager(socket!!, this)
            commandListener = CommandListener(socket!!, webRTCManager!!, monitoringEngine!!, preferenceHelper)

            socket?.on("offer") { args ->
                val data = args[0] as JSONObject
                val sender = data.getString("sender")
                val offer = data.getString("offer")
                val type = data.optString("type", "audio")
                webRTCManager?.handleOffer(sender, offer, type)
            }

            socket?.on("ice-candidate") { args ->
                val data = args[0] as JSONObject
                val candidateObj = data.getJSONObject("candidate")
                val sdp = candidateObj.getString("sdp")
                val sdpMid = candidateObj.getString("sdpMid")
                val sdpMLineIndex = candidateObj.getInt("sdpMLineIndex")
                
                webRTCManager?.addIceCandidate(IceCandidate(sdpMid, sdpMLineIndex, sdp))
            }

            monitoringEngine?.startAllMonitoring()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
        )

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Family Safety Active")
            .setContentText("Your device is protected and monitored by Family Safety.")
            .setSmallIcon(R.drawable.ic_notification)
            .setContentIntent(pendingIntent)
            .build()

        startForeground(1, notification)

        // Initialize monitoring engines here
        startMonitoring()

        return START_STICKY
    }

    private fun startMonitoring() {
        // Logic to start SMS, Call, Location tracking
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Monitoring Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }
}
