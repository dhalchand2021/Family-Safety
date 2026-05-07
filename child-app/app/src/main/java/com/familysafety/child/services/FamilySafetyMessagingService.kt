package com.familysafety.child.services

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class FamilySafetyMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("FCM", "New token generated: $token")
        // In production, sync this token to the backend for this device
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        Log.d("FCM", "Message received from: ${remoteMessage.from}")

        // Handle data messages (e.g., wake up socket, trigger immediate sync)
        remoteMessage.data.let {
            if (it.isNotEmpty()) {
                val command = it["command"]
                Log.d("FCM", "Command received via FCM: $command")
            }
        }
    }
}
