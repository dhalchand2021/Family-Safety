package com.familysafety.child

import android.graphics.Bitmap
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.familysafety.child.utils.PreferenceHelper
import com.google.zxing.BarcodeFormat
import com.google.zxing.MultiFormatWriter
import com.google.zxing.common.BitMatrix
import java.util.*

class PairingActivity : AppCompatActivity() {

    private lateinit var preferenceHelper: PreferenceHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pairing)

        preferenceHelper = PreferenceHelper(this)

        val qrImageView = findViewById<ImageView>(R.id.qrImageView)
        val tokenText = findViewById<TextView>(R.id.tokenText)

        // Generate a unique pairing token (In production, fetch this from backend)
        val deviceId = preferenceHelper.deviceId ?: UUID.randomUUID().toString()
        val pairingToken = (100000..999999).random().toString()
        
        // Save initial state
        preferenceHelper.deviceId = deviceId
        preferenceHelper.pairingToken = pairingToken
        
        // Generate ECDH Key Pair for secure synchronization
        val keyPairGenerator = java.security.KeyPairGenerator.getInstance("EC")
        keyPairGenerator.initialize(256)
        val keyPair = keyPairGenerator.generateKeyPair()
        val publicKeyBytes = keyPair.public.encoded
        val publicKeyBase64 = Base64.encodeToString(publicKeyBytes, Base64.DEFAULT)

        val pairingData = "family-safety-pair:$deviceId:$pairingToken:$publicKeyBase64"
        tokenText.text = "Pairing Code: $pairingToken"

        try {
            val bitmap = generateQRCode(pairingData)
            qrImageView.setImageBitmap(bitmap)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun generateQRCode(text: String): Bitmap {
        val width = 500
        val height = 500
        val matrix: BitMatrix = MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, width, height)
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565)
        for (x in 0 until width) {
            for (y in 0 until height) {
                bitmap.setPixel(x, y, if (matrix.get(x, y)) -0x1000000 else -0x1)
            }
        }
        return bitmap
    }
}
