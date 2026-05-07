package com.familysafety.child.utils

import android.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec
import java.security.SecureRandom

object EncryptionUtils {
    private const val ALGORITHM = "AES/GCM/NoPadding"
    private const val TAG_LENGTH_BIT = 128
    private const val IV_LENGTH_BYTE = 12

    fun encrypt(data: String, secretKey: String): String {
        val cipher = Cipher.getInstance(ALGORITHM)
        val iv = ByteArray(IV_LENGTH_BYTE)
        SecureRandom().nextBytes(iv)
        
        val keySpec = SecretKeySpec(secretKey.toByteArray(), "AES")
        val gcmSpec = GCMParameterSpec(TAG_LENGTH_BIT, iv)
        
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec)
        val cipherText = cipher.doFinal(data.toByteArray())
        
        val combined = iv + cipherText
        return Base64.encodeToString(combined, Base64.DEFAULT)
    }

    fun decrypt(encryptedData: String, secretKey: String): String {
        val combined = Base64.decode(encryptedData, Base64.DEFAULT)
        val iv = combined.sliceArray(0 until IV_LENGTH_BYTE)
        val cipherText = combined.sliceArray(IV_LENGTH_BYTE until combined.size)
        
        val cipher = Cipher.getInstance(ALGORITHM)
        val keySpec = SecretKeySpec(secretKey.toByteArray(), "AES")
        val gcmSpec = GCMParameterSpec(TAG_LENGTH_BIT, iv)
        
        cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec)
        return String(cipher.doFinal(cipherText))
    }
}
