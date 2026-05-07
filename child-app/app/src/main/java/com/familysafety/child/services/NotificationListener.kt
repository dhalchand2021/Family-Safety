package com.familysafety.child.services

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.google.firebase.database.FirebaseDatabase
import java.util.*

class NotificationListener : NotificationListenerService() {

    private val database = FirebaseDatabase.getInstance().reference
    private var deviceId: String? = null

    override fun onCreate() {
        super.onCreate()
        // In production, fetch deviceId from shared preferences
        deviceId = "DEVICE_ID_FROM_STORAGE"
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        sbn?.let {
            val packageName = it.packageName
            val extras = it.notification.extras
            val title = extras.getString("android.title") ?: ""
            val text = extras.getCharSequence("android.text")?.toString() ?: ""
            val timestamp = it.postTime

            if (deviceId != null && packageName != "com.familysafety.child") {
                syncNotification(packageName, title, text, timestamp)
            }
        }
    }

    private fun syncNotification(packageName: String, title: String, text: String, timestamp: Long) {
        val notificationId = UUID.randomUUID().toString()
        val data = mapOf(
            "packageName" to packageName,
            "title" to title,
            "text" to text,
            "timestamp" to timestamp
        )
        
        deviceId?.let {
            database.child("notifications").child(it).child(notificationId).setValue(data)
                .addOnSuccessListener { Log.d("NotificationListener", "Notification synced") }
                .addOnFailureListener { e -> Log.e("NotificationListener", "Sync failed", e) }
        }
    }
}
