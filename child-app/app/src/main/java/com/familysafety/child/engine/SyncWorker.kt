package com.familysafety.child.engine

import android.content.Context
import java.util.UUID
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.google.firebase.database.FirebaseDatabase
import kotlinx.coroutines.tasks.await

class SyncWorker(appContext: Context, workerParams: WorkerParameters) :
    CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val type = inputData.getString("type") ?: return Result.failure()
        val deviceId = inputData.getString("deviceId") ?: return Result.failure()
        val dataJson = inputData.getString("data") ?: return Result.failure()

        return try {
            val database = FirebaseDatabase.getInstance().reference
            val logId = inputData.getString("logId") ?: UUID.randomUUID().toString()
            
            // In a real app, parse dataJson back to a Map
            // For now, we'll assume the data is small enough or handled as string
            database.child(type).child(deviceId).child(logId).setValue(dataJson).await()
            
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) {
                Result.retry()
            } else {
                Result.failure()
            }
        }
    }
}
