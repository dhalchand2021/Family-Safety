package com.familysafety.child

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.familysafety.child.services.MonitoringService
import com.familysafety.child.utils.PermissionManager
import android.widget.Button
import android.widget.TextView
import android.widget.Toast

class MainActivity : AppCompatActivity() {

    private lateinit var permissionManager: PermissionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        permissionManager = PermissionManager(this)
        
        val statusText = findViewById<TextView>(R.id.statusText)
        val pairButton = findViewById<Button>(R.id.pairButton)

        pairButton.setOnClickListener {
            if (permissionManager.isBatteryOptimizationIgnored()) {
                val intent = Intent(this, PairingActivity::class.java)
                startActivity(intent)
            } else {
                Toast.makeText(this, "Please disable battery optimization first", Toast.LENGTH_LONG).show()
                permissionManager.requestIgnoreBatteryOptimization()
            }
        }

        permissionManager.checkAndRequestPermissions()
        startMonitoringService()
    }

    private fun startMonitoringService() {
        val serviceIntent = Intent(this, MonitoringService::class.java)
        startService(serviceIntent)
    }
}
