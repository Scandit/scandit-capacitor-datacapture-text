/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2021- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.text.data.defaults

import com.scandit.capacitor.datacapture.core.data.SerializableData
import com.scandit.capacitor.datacapture.core.data.defaults.SerializableCameraSettingsDefault
import org.json.JSONObject

data class SerializableTextCaptureDefaults(
    private val textCaptureOverlayDefaults: SerializableTextCaptureOverlayDefaults,
    private val textCaptureSettingsDefaults: SerializableTextCaptureSettingsDefaults,
    private val recommendedCameraSettings: SerializableCameraSettingsDefault
) : SerializableData {

    override fun toJson(): JSONObject = JSONObject(
        mapOf(
            FIELD_OVERLAY_DEFAULTS to textCaptureOverlayDefaults.toJson(),
            FIELD_SETTINGS_DEFAULTS to textCaptureSettingsDefaults.toJson(),
            FIELD_RECOMMENDED_CAMERA_SETTINGS to recommendedCameraSettings.toJson()
        )
    )

    private companion object {
        const val FIELD_OVERLAY_DEFAULTS = "TextCaptureOverlay"
        const val FIELD_SETTINGS_DEFAULTS = "TextCaptureSettings"
        const val FIELD_RECOMMENDED_CAMERA_SETTINGS = "RecommendedCameraSettings"
    }
}
