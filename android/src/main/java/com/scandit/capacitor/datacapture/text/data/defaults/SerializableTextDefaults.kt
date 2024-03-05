/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2021- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.text.data.defaults

import com.scandit.capacitor.datacapture.core.data.SerializableData
import org.json.JSONObject

data class SerializableTextDefaults(
    private val textCaptureDefaults: SerializableTextCaptureDefaults
) : SerializableData {

    override fun toJson(): JSONObject = JSONObject(
        mapOf(FIELD_TEXT_CAPTURE_DEFAULTS to textCaptureDefaults.toJson())
    )

    private companion object {
        const val FIELD_TEXT_CAPTURE_DEFAULTS = "TextCapture"
    }
}
