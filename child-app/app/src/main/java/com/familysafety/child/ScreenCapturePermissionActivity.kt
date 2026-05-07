package com.familysafety.child

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class ScreenCapturePermissionActivity : AppCompatActivity() {

    private lateinit var mediaProjectionManager: MediaProjectionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mediaProjectionManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        startActivityForResult(mediaProjectionManager.createScreenCaptureIntent(), 1000)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 1000) {
            if (resultCode == Activity.RESULT_OK && data != null) {
                // Broadcast the result to the WebRTC manager
                val intent = Intent("com.familysafety.child.SCREEN_CAPTURE_PERMISSION_GRANTED")
                intent.putExtra("resultCode", resultCode)
                intent.putExtra("data", data)
                sendBroadcast(intent)
            }
            finish()
        }
    }
}
