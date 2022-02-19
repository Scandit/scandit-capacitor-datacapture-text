/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2021- Scandit AG. All rights reserved.
 */

package com.scandit.capacitor.datacapture.text.data.defaults

import com.scandit.capacitor.datacapture.core.data.SerializableData
import com.scandit.datacapture.core.common.Direction
import com.scandit.datacapture.core.common.toJson
import com.scandit.datacapture.text.capture.TextCaptureSettings
import org.json.JSONObject

data class SerializableTextCaptureSettingsDefaults(
    private val duplicateFilter: Float,
    private val recognitionDirection: Direction
) : SerializableData {

    constructor(settings: TextCaptureSettings) : this(
        settings.duplicateFilter.asSeconds(),
        settings.recognitionDirection
    )

    override fun toJson(): JSONObject = JSONObject(
        mapOf(
            FIELD_DUPLICATE_FILTER to duplicateFilter,
            FIELD_RECOGNITION_DIRECTION to recognitionDirection.toJson()
        )
    )

    private companion object {
        const val FIELD_DUPLICATE_FILTER = "duplicateFilter"
        const val FIELD_RECOGNITION_DIRECTION = "recognitionDirection"
    }
}
