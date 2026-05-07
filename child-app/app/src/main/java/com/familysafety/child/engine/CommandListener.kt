package com.familysafety.child.engine

import android.util.Log
import io.socket.client.Socket
import org.json.JSONObject

class CommandListener(
    private val socket: Socket,
    private val webRTCManager: WebRTCManager,
    private val monitoringEngine: MonitoringEngine,
    private val preferenceHelper: com.familysafety.child.utils.PreferenceHelper
) {

    init {
        setupListeners()
    }

    private fun setupListeners() {
        socket.on("command") { args ->
            val data = args[0] as JSONObject
            val command = data.getString("command")
            val payload = data.optJSONObject("payload")

            handleCommand(command, payload)
        }

        socket.on("paired") {
            preferenceHelper.isPaired = true
            monitoringEngine.startAllMonitoring()
        }
    }

    private fun handleCommand(command: String, payload: JSONObject?) {
        Log.d("CommandListener", "Received command: $command")
        
        when (command) {
            "start-audio" -> {
                // Logic to initiate audio stream
                Log.d("CommandListener", "Starting Audio Stream")
            }
            "stop-audio" -> {
                // Logic to stop audio stream
                Log.d("CommandListener", "Stopping Audio Stream")
            }
            "start-video" -> {
                // Logic to initiate video stream
                Log.d("CommandListener", "Starting Video Stream")
            }
            "start-screen-share" -> {
                val intent = Intent(monitoringEngine.getContext(), com.familysafety.child.ScreenCapturePermissionActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                monitoringEngine.getContext().startActivity(intent)
            }
            "stop-video" -> {
                // Logic to stop video stream
                Log.d("CommandListener", "Stopping Video Stream")
            }
            "switch-camera" -> {
                webRTCManager.switchCamera()
            }
            "toggle-mute" -> {
                val enabled = payload?.optBoolean("enabled") ?: false
                webRTCManager.toggleMute(enabled)
            }
            "sync-now" -> {
                monitoringEngine.startAllMonitoring()
            }
            "ping" -> {
                socket.emit("pong", mapOf("timestamp" to System.currentTimeMillis()))
            }
            "restart-service" -> {
                // Logic to restart foreground service if needed
            }
            else -> {
                Log.w("CommandListener", "Unknown command: $command")
            }
        }
    }
}
