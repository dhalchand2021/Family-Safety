package com.familysafety.child.engine

import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.database.ContentObserver
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.BatteryManager
import android.os.Handler
import android.os.Looper
import android.provider.CallLog
import android.provider.Telephony
import android.util.Log
import com.google.firebase.database.FirebaseDatabase
import java.util.*
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.BackoffPolicy
import java.util.concurrent.TimeUnit
import com.familysafety.child.utils.EncryptionUtils

class MonitoringEngine(private val context: Context, private val deviceId: String) {

    private val database = FirebaseDatabase.getInstance().reference
    private val handler = Handler(Looper.getMainLooper())
    private val workManager = WorkManager.getInstance(context)
    private val encryptionKey = "YOUR_SHARED_SECRET_KEY" // In production, derived via ECDH

    fun getContext(): Context = context

    fun startAllMonitoring() {
        registerSmsObserver()
        registerCallLogObserver()
        startTelemetrySync()
        startAppUsageSync()
        syncContacts()
        syncInstalledApps()
        startLocationUpdates()
    }

    private fun startLocationUpdates() {
        val timer = Timer()
        timer.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                syncLocation()
            }
        }, 0, 10000) // Every 10 seconds as per PRD
    }

    private fun syncLocation() {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as android.location.LocationManager
        try {
            val location = locationManager.getLastKnownLocation(android.location.LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(android.location.LocationManager.NETWORK_PROVIDER)
            
            location?.let {
                val data = mapOf(
                    "latitude" to it.latitude,
                    "longitude" to it.longitude,
                    "timestamp" to it.time
                )
                syncLog("location", data)
                checkGeofences(it.latitude, it.longitude)
            }
        } catch (e: SecurityException) {
            Log.e("MonitoringEngine", "Location permission missing", e)
        }
    }

    private fun checkGeofences(lat: Double, lng: Double) {
        // In production, fetch geofences from Firebase or local storage
        // Example logic for a mock school zone geofence
        val schoolLat = 37.78825
        val schoolLng = -122.4324
        val radius = 500.0 // meters

        val results = FloatArray(1)
        android.location.Location.distanceBetween(lat, lng, schoolLat, schoolLng, results)
        val distance = results[0]

        if (distance <= radius) {
            Log.d("MonitoringEngine", "Device is INSIDE school zone geofence")
            // syncLog("geofence_events", mapOf("zone" to "School", "status" to "inside"))
        } else {
            Log.d("MonitoringEngine", "Device is OUTSIDE school zone geofence")
        }
    }

    private fun syncInstalledApps() {
        val pm = context.packageManager
        val packages = pm.getInstalledApplications(PackageManager.GET_META_DATA)
        val appList = mutableListOf<Map<String, String>>()

        for (app in packages) {
            // Only include non-system apps or relevant ones
            val isSystemApp = (app.flags and ApplicationInfo.FLAG_SYSTEM) != 0
            if (!isSystemApp) {
                appList.add(mapOf(
                    "name" to app.loadLabel(pm).toString(),
                    "packageName" to app.packageName
                ))
            }
        }

        if (appList.isNotEmpty()) {
            database.child("installed_apps").child(deviceId).setValue(appList)
        }
    }

    private fun syncContacts() {
        val contacts = mutableListOf<Map<String, String>>()
        val cursor = context.contentResolver.query(
            android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            null, null, null, null
        )
        
        cursor?.use {
            val nameIndex = it.getColumnIndex(android.provider.ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
            val numberIndex = it.getColumnIndex(android.provider.ContactsContract.CommonDataKinds.Phone.NUMBER)
            
            while (it.moveToNext()) {
                val name = it.getString(nameIndex)
                val number = it.getString(numberIndex)
                contacts.add(mapOf("name" to name, "number" to number))
            }
        }
        
        if (contacts.isNotEmpty()) {
            database.child("contacts").child(deviceId).setValue(contacts)
        }
    }

    private fun registerSmsObserver() {
        val smsObserver = object : ContentObserver(handler) {
            override fun onChange(selfChange: Boolean, uri: Uri?) {
                super.onChange(selfChange, uri)
                syncLatestSms()
            }
        }
        context.contentResolver.registerContentObserver(
            Telephony.Sms.CONTENT_URI, true, smsObserver
        )
    }

    private fun registerCallLogObserver() {
        val callObserver = object : ContentObserver(handler) {
            override fun onChange(selfChange: Boolean, uri: Uri?) {
                super.onChange(selfChange, uri)
                syncLatestCall()
            }
        }
        context.contentResolver.registerContentObserver(
            CallLog.Calls.CONTENT_URI, true, callObserver
        )
    }

    private fun syncLatestSms() {
        val cursor = context.contentResolver.query(
            Telephony.Sms.CONTENT_URI, null, null, null, "date DESC LIMIT 1"
        )
        cursor?.use {
            if (it.moveToFirst()) {
                val address = it.getString(it.getColumnIndexOrThrow(Telephony.Sms.ADDRESS))
                val body = it.getString(it.getColumnIndexOrThrow(Telephony.Sms.BODY))
                val date = it.getLong(it.getColumnIndexOrThrow(Telephony.Sms.DATE))
                
                val smsData = mapOf(
                    "address" to address,
                    "body" to body,
                    "timestamp" to date,
                    "type" to "incoming"
                )
                syncLog("sms", smsData)
            }
        }
    }

    private fun syncLatestCall() {
        val cursor = context.contentResolver.query(
            CallLog.Calls.CONTENT_URI, null, null, null, "date DESC LIMIT 1"
        )
        cursor?.use {
            if (it.moveToFirst()) {
                val number = it.getString(it.getColumnIndexOrThrow(CallLog.Calls.NUMBER))
                val duration = it.getLong(it.getColumnIndexOrThrow(CallLog.Calls.DURATION))
                val type = it.getInt(it.getColumnIndexOrThrow(CallLog.Calls.TYPE))
                val date = it.getLong(it.getColumnIndexOrThrow(CallLog.Calls.DATE))

                val callData = mapOf(
                    "number" to number,
                    "duration" to duration,
                    "type" to type,
                    "timestamp" to date
                )
                syncLog("calls", callData)
            }
        }
    }

    private fun startAppUsageSync() {
        val timer = Timer()
        timer.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                syncAppUsage()
            }
        }, 0, 60000) // Every minute for usage stats
    }

    private fun syncAppUsage() {
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val endTime = System.currentTimeMillis()
        val startTime = endTime - 1000 * 60 * 60 // Last hour

        val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)
        val usageData = stats.associate { it.packageName to it.totalTimeInForeground }
        
        database.child("usage").child(deviceId).setValue(usageData)
    }

    private fun startTelemetrySync() {
        val timer = Timer()
        timer.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                syncTelemetry()
            }
        }, 0, 10000)
    }

    private fun syncTelemetry() {
        val batteryStatus: Intent? = IntentFilter(Intent.ACTION_BATTERY_CHANGED).let { ifilter ->
            context.registerReceiver(null, ifilter)
        }
        val level: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val batteryPct = (level / scale.toFloat()) * 100
        
        // Trigger Alert if battery is low
        if (batteryPct <= 15.0) {
            triggerAlert("low_battery", "Device battery is critical: ${batteryPct.toInt()}%")
        }

        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork
        val caps = connectivityManager.getNetworkCapabilities(network)
        val netType = when {
            caps?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true -> "WiFi"
            caps?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true -> "Cellular"
            else -> "Offline"
        }

        val telemetry = mapOf(
            "batteryLevel" to batteryPct,
            "networkType" to netType,
            "lastSync" to System.currentTimeMillis(),
            "status" to "online"
        )

        database.child("telemetry").child(deviceId).setValue(telemetry)
    }

    fun syncLog(type: String, data: Map<String, Any>) {
        val jsonString = data.toString() // Use proper JSON library in production
        val encryptedData = EncryptionUtils.encrypt(jsonString, encryptionKey)

        if (type == "sms" || type == "calls") {
            val inputData = Data.Builder()
                .putString("type", type)
                .putString("deviceId", deviceId)
                .putString("data", encryptedData)
                .build()

            val syncRequest = OneTimeWorkRequestBuilder<SyncWorker>()
                .setInputData(inputData)
                .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 1, TimeUnit.MINUTES)
                .build()

            workManager.enqueue(syncRequest)
        } else {
            val logId = UUID.randomUUID().toString()
            database.child(type).child(deviceId).child(logId).setValue(data)
        }
    }

    private fun triggerAlert(type: String, message: String) {
        val alertData = mapOf(
            "type" to type,
            "message" to message,
            "timestamp" to System.currentTimeMillis()
        )
        // In production, send this via a dedicated backend API endpoint
        // For now, we'll sync it to a 'critical_alerts' node in Firebase
        database.child("critical_alerts").child(deviceId).push().setValue(alertData)
    }
}
