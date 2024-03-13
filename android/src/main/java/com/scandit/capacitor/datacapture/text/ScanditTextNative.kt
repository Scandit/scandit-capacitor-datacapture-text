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
import com.scandit.capacitor.datacapture.core.errors.JsonParseError
import com.scandit.capacitor.datacapture.core.utils.CapacitorNoopResult
import com.scandit.capacitor.datacapture.core.utils.CapacitorResult
import com.scandit.datacapture.frameworks.core.events.Emitter
import com.scandit.datacapture.frameworks.text.TextCaptureModule
import com.scandit.datacapture.frameworks.text.listeners.FrameworksTextCaptureListener
import org.json.JSONException
import org.json.JSONObject

@CapacitorPlugin(name = "ScanditTextNative")
class ScanditTextNative : Plugin(), Emitter {

    private val textCaptureModule = TextCaptureModule(FrameworksTextCaptureListener(this))

    private var lastTextCaptureEnabledState: Boolean = false

    @PluginMethod
    fun getDefaults(call: PluginCall) {
        val defaults = textCaptureModule.getDefaults()
        val defaultsJson = JSONObject(
            mapOf(
                "TextCapture" to defaults
            )
        )
        call.resolve(JSObject.fromJSONObject(defaultsJson))
    }

    @PluginMethod
    fun subscribeTextCaptureListener(call: PluginCall) {
        textCaptureModule.addListener(CapacitorResult(call))
    }

    @PluginMethod
    fun setModeEnabledState(call: PluginCall) {
        val enabled = call.data.getBoolean("enabled")
        textCaptureModule.setModeEnabled(enabled, CapacitorResult(call))
    }

    @PluginMethod
    fun finishCallback(call: PluginCall) {
        try {
            val data = call.data
            // We need the "result" field to exist ( null is also allowed )
            if (!data.has(FIELD_RESULT)) {
                throw JSONException("Missing $FIELD_RESULT field in response json")
            }
            val result: JSONObject = data.getJSObject(FIELD_RESULT) ?: JSONObject()
            textCaptureModule.finishDidCapture(
                result.getBoolean("enabled"),
                CapacitorResult(call)
            )
        } catch (e: JSONException) {
            call.reject(JsonParseError(e.message).toString())
        } catch (e: RuntimeException) {
            call.reject(JsonParseError(e.message).toString())
        }
    }

    @PluginMethod
    fun updateTextCaptureOverlay(call: PluginCall) {
        val overlayJson = call.data.getString("overlayJson")
            ?: return call.reject(WRONG_INPUT)
        textCaptureModule.updateOverlay(overlayJson, CapacitorResult(call))
    }

    @PluginMethod
    fun updateTextCaptureMode(call: PluginCall) {
        val modeJson = call.data.getString("modeJson")
            ?: return call.reject(WRONG_INPUT)
        textCaptureModule.updateModeFromJson(modeJson, CapacitorResult(call))
    }

    @PluginMethod
    fun applyTextCaptureModeSettings(call: PluginCall) {
        val modeSettingsJson = call.data.getString("modeSettingsJson")
            ?: return call.reject(WRONG_INPUT)
        textCaptureModule.applyModeSettings(modeSettingsJson, CapacitorResult(call))
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

        textCaptureModule.onCreate(bridge.context)
    }

    override fun handleOnStart() {
        textCaptureModule.setModeEnabled(lastTextCaptureEnabledState, CapacitorNoopResult())
    }

    override fun handleOnStop() {
        lastTextCaptureEnabledState = textCaptureModule.isModeEnabled()
        textCaptureModule.setModeEnabled(false, CapacitorNoopResult())
    }

    override fun handleOnDestroy() {
        textCaptureModule.onDestroy()
    }

    override fun emit(eventName: String, payload: MutableMap<String, Any?>) {
        payload[FIELD_EVENT_NAME] = eventName

        notifyListeners(eventName, JSObject.fromJSONObject(JSONObject(payload)))
    }

    override fun hasListenersForEvent(eventName: String): Boolean = this.hasListeners(eventName)

    companion object {
        private const val FIELD_EVENT_NAME = "name"
        private const val FIELD_RESULT = "result"
        private const val CORE_PLUGIN_NAME = "ScanditCaptureCoreNative"
        private const val WRONG_INPUT = "Wrong input parameter"
    }
}
