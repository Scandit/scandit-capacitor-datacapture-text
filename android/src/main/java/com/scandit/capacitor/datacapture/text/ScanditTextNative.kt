/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2021- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.text

import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.scandit.capacitor.datacapture.core.ScanditCaptureCoreNative
import com.scandit.capacitor.datacapture.core.communication.ModeDeserializersProvider
import com.scandit.capacitor.datacapture.core.data.SerializableCallbackAction.Companion.FIELD_FINISH_CALLBACK_ID
import com.scandit.capacitor.datacapture.core.data.SerializableFinishModeCallbackData
import com.scandit.capacitor.datacapture.core.data.defaults.SerializableBrushDefaults
import com.scandit.capacitor.datacapture.core.data.defaults.SerializableCameraSettingsDefault
import com.scandit.capacitor.datacapture.core.errors.JsonParseError
import com.scandit.capacitor.datacapture.text.callbacks.TextCaptureCallback
import com.scandit.capacitor.datacapture.text.callbacks.TextCaptureCallback.Companion.ACTION_TEXT_CAPTURED
import com.scandit.capacitor.datacapture.text.data.defaults.SerializableTextCaptureDefaults
import com.scandit.capacitor.datacapture.text.data.defaults.SerializableTextCaptureOverlayDefaults
import com.scandit.capacitor.datacapture.text.data.defaults.SerializableTextCaptureSettingsDefaults
import com.scandit.capacitor.datacapture.text.data.defaults.SerializableTextDefaults
import com.scandit.capacitor.datacapture.text.handlers.TextCaptureHandler
import com.scandit.datacapture.core.capture.serialization.DataCaptureModeDeserializer
import com.scandit.datacapture.core.data.FrameData
import com.scandit.datacapture.core.json.JsonValue
import com.scandit.datacapture.text.capture.TextCapture
import com.scandit.datacapture.text.capture.TextCaptureListener
import com.scandit.datacapture.text.capture.TextCaptureSession
import com.scandit.datacapture.text.capture.TextCaptureSettings
import com.scandit.datacapture.text.capture.serialization.TextCaptureDeserializer
import com.scandit.datacapture.text.capture.serialization.TextCaptureDeserializerListener
import com.scandit.datacapture.text.ui.TextCaptureOverlay
import org.json.JSONException
import org.json.JSONObject

@CapacitorPlugin(name = "ScanditTextNative")
class ScanditTextNative :
    Plugin(),
    com.scandit.capacitor.datacapture.text.CapacitorPlugin,
    ModeDeserializersProvider,
    TextCaptureDeserializerListener,
    TextCaptureListener {

    private var textCaptureCallback: TextCaptureCallback? = null
    private val textCaptureHandler: TextCaptureHandler = TextCaptureHandler(this)

    private var lastTextCaptureEnabledState: Boolean = false

    companion object {
        private const val FIELD_RESULT = "result"
        private const val CORE_PLUGIN_NAME = "ScanditCaptureCoreNative"
    }

    @PluginMethod
    fun getDefaults(call: PluginCall) {
        try {
            val defaults = SerializableTextDefaults(
                textCaptureDefaults = SerializableTextCaptureDefaults(
                    textCaptureOverlayDefaults = SerializableTextCaptureOverlayDefaults(
                        brushDefaults = SerializableBrushDefaults(
                            TextCaptureOverlay.defaultBrush()
                        )
                    ),
                    textCaptureSettingsDefaults = SerializableTextCaptureSettingsDefaults(
                        TextCaptureSettings.fromJson("{}")
                    ),
                    recommendedCameraSettings = SerializableCameraSettingsDefault(
                        TextCapture.createRecommendedCameraSettings()
                    )
                )
            )
            call.resolve(JSObject.fromJSONObject(defaults.toJson()))
        } catch (e: Exception) {
            println(e)
            call.reject(JsonParseError(e.message).toString())
        }
    }

    @PluginMethod
    fun subscribeTextCaptureListener(call: PluginCall) {
        textCaptureCallback?.dispose()
        textCaptureCallback = TextCaptureCallback(this)
        call.resolve()
    }

    @PluginMethod
    fun finishCallback(call: PluginCall) {
        try {
            val data = call.data
            // We need the "result" field to exist ( null is also allowed )
            if (!data.has(FIELD_RESULT)) {
                throw JSONException("Missing $FIELD_RESULT field in response json")
            }
            val result: JSONObject = data.optJSONObject(FIELD_RESULT) ?: JSONObject()
            when {
                isFinishTextCaptureModeCallback(result) -> textCaptureCallback?.onFinishCallback(
                    SerializableFinishModeCallbackData.fromJson(result)
                )
                else ->
                    throw JSONException("Cannot recognise finish callback action with data $data")
            }
        } catch (e: JSONException) {
            println(e)
            call.reject(JsonParseError(e.message).toString())
        } catch (e: RuntimeException) {
            println(e)
            call.reject(JsonParseError(e.message).toString())
        }
    }

    override fun load() {
        super.load()

        // We need to register the plugin with its Core dependency for serializers to load.
        val corePlugin = bridge.getPlugin(CORE_PLUGIN_NAME)
        if (corePlugin != null) {
            (corePlugin.instance as ScanditCaptureCoreNative)
                .registerPluginInstance(pluginHandle.instance)
        } else {
            Log.e("Registering:", "Core not found")
        }
    }

    override fun handleOnStop() {
        lastTextCaptureEnabledState = textCaptureHandler.textCapture?.isEnabled ?: false
        textCaptureHandler.textCapture?.isEnabled = false
        textCaptureCallback?.forceRelease()
    }

    override fun provideModeDeserializers(): List<DataCaptureModeDeserializer> = listOf(
        TextCaptureDeserializer()
            .also { it.listener = this }
    )

    override fun onModeDeserializationFinished(
        deserializer: TextCaptureDeserializer,
        mode: TextCapture,
        json: JsonValue
    ) {
        if (json.contains("enabled")) {
            mode.isEnabled = json.requireByKeyAsBoolean("enabled")
        }
        textCaptureHandler.attachTextCapture(mode)
    }

    override fun onTextCaptured(mode: TextCapture, session: TextCaptureSession, data: FrameData) {
        ScanditCaptureCoreNative.lastFrame = data
        textCaptureCallback?.onTextCaptured(mode, session, data)
        ScanditCaptureCoreNative.lastFrame = null
    }

    private fun isFinishTextCaptureModeCallback(data: JSONObject) =
        data.has(FIELD_FINISH_CALLBACK_ID) && data[FIELD_FINISH_CALLBACK_ID] == ACTION_TEXT_CAPTURED

    override fun notify(name: String, data: JSObject) {
        notifyListeners(name, data)
    }
}

interface CapacitorPlugin {
    fun notify(name: String, data: JSObject)
}
