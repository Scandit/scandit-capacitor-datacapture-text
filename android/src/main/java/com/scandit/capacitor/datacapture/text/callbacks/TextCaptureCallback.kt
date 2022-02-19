/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2021- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.text.callbacks

import com.getcapacitor.JSObject
import com.scandit.capacitor.datacapture.core.data.SerializableFinishModeCallbackData
import com.scandit.capacitor.datacapture.core.utils.Callback
import com.scandit.capacitor.datacapture.text.CapacitorPlugin
import com.scandit.datacapture.core.data.FrameData
import com.scandit.datacapture.text.capture.TextCapture
import com.scandit.datacapture.text.capture.TextCaptureListener
import com.scandit.datacapture.text.capture.TextCaptureSession
import org.json.JSONObject
import java.util.concurrent.atomic.AtomicReference
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

class TextCaptureCallback(
    private val plugin: CapacitorPlugin
) : Callback(), TextCaptureListener {

    private val lock = ReentrantLock(true)
    private val condition = lock.newCondition()

    private val latestStateData = AtomicReference<SerializableFinishModeCallbackData?>(null)

    override fun onTextCaptured(mode: TextCapture, session: TextCaptureSession, data: FrameData) {
        if (disposed.get()) return

        lock.withLock {
            plugin.notify(
                ACTION_TEXT_CAPTURED,
                JSObject.fromJSONObject(
                    JSONObject(
                        mapOf(
                            NAME to ACTION_TEXT_CAPTURED,
                            FIELD_ARGUMENT to mapOf(
                                FIELD_SESSION to session.toJson()
                            ),
                            FIELD_FRAME_DATA to data.toJson()
                        )
                    )
                )
            )
            lockAndWait()
            onUnlock(mode)
        }
    }

    private fun onUnlock(mode: TextCapture) {
        latestStateData.get()?.let { latestData ->
            mode.isEnabled = latestData.enabled
            latestStateData.set(null)
        }
        // If we don't have the latestData, it means no listener is set from js, so we do nothing.
    }

    private fun lockAndWait() {
        condition.await()
    }

    fun onFinishCallback(finishModeCallbackData: SerializableFinishModeCallbackData?) {
        latestStateData.set(finishModeCallbackData)
        unlock()
    }

    fun forceRelease() {
        lock.withLock {
            condition.signalAll()
        }
    }

    private fun unlock() {
        lock.withLock {
            condition.signal()
        }
    }

    private fun FrameData.toJson(): String = JSONObject(
        mapOf(FIELD_FRAME_DATA to JSONObject())
    ).toString()

    override fun dispose() {
        super.dispose()
        forceRelease()
    }

    companion object {
        private const val NAME = "name"
        private const val FIELD_SESSION = "session"
        private const val FIELD_FRAME_DATA = "frameData"
        private const val FIELD_ARGUMENT = "argument"

        const val ACTION_TEXT_CAPTURED = "didCaptureInTextCapture"
    }
}
