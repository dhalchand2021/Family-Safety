package com.familysafety.child.utils

import android.content.Context
import android.content.SharedPreferences

class PreferenceHelper(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("FamilySafetyPrefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_DEVICE_ID = "device_id"
        private const val KEY_IS_PAIRED = "is_paired"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_PAIRING_TOKEN = "pairing_token"
    }

    var deviceId: String?
        get() = prefs.getString(KEY_DEVICE_ID, null)
        set(value) = prefs.edit().putString(KEY_DEVICE_ID, value).apply()

    var isPaired: Boolean
        get() = prefs.getBoolean(KEY_IS_PAIRED, false)
        set(value) = prefs.edit().putBoolean(KEY_IS_PAIRED, value).apply()

    var userId: String?
        get() = prefs.getString(KEY_USER_ID, null)
        set(value) = prefs.edit().putString(KEY_USER_ID, value).apply()

    var pairingToken: String?
        get() = prefs.getString(KEY_PAIRING_TOKEN, null)
        set(value) = prefs.edit().putString(KEY_PAIRING_TOKEN, value).apply()

    fun clear() {
        prefs.edit().clear().apply()
    }
}
