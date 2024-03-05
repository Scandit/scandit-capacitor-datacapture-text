/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditTextCapture
import ScanditCapacitorDatacaptureCore

struct ScanditTextCaptureDefaults: Encodable {

    struct TextCaptureOverlayDefaults: Encodable {
        let DefaultBrush: BrushDefaults
    }

    struct TextCaptureSettingsDefaults: Encodable {
        let recognitionDirection: String
        let duplicateFilter: Double
    }

    struct TextCaptureDefaultsContainer: Encodable {
        let TextCaptureOverlay: TextCaptureOverlayDefaults
        let TextCaptureSettings: TextCaptureSettingsDefaults
        let RecommendedCameraSettings: CameraSettingsDefaults
    }

    let TextCapture: TextCaptureDefaultsContainer

    init(textCaptureSettings: TextCaptureSettings, overlay: TextCaptureOverlay) {
        self.TextCapture = TextCaptureDefaultsContainer.from(textCaptureSettings, overlay)
    }
}

extension ScanditTextCaptureDefaults.TextCaptureDefaultsContainer {
    static func from(_ settings: TextCaptureSettings,
                     _ overlay: TextCaptureOverlay) -> ScanditTextCaptureDefaults.TextCaptureDefaultsContainer {
        let textCaptureOverlay = ScanditTextCaptureDefaults.TextCaptureOverlayDefaults.from(overlay)
        let textCaptureSettings = ScanditTextCaptureDefaults.TextCaptureSettingsDefaults.from(settings)
        let cameraSettings = CameraSettingsDefaults.from(TextCapture.recommendedCameraSettings)
        return ScanditTextCaptureDefaults.TextCaptureDefaultsContainer(TextCaptureOverlay: textCaptureOverlay,
                                                                       TextCaptureSettings: textCaptureSettings,
                                                                       RecommendedCameraSettings: cameraSettings)
    }
}

extension ScanditTextCaptureDefaults.TextCaptureOverlayDefaults {
    static func from(_ overlay: TextCaptureOverlay) -> ScanditTextCaptureDefaults.TextCaptureOverlayDefaults {
        let brush = BrushDefaults.from(TextCaptureOverlay.defaultBrush)
        return ScanditTextCaptureDefaults.TextCaptureOverlayDefaults(DefaultBrush: brush)
    }
}

extension ScanditTextCaptureDefaults.TextCaptureSettingsDefaults {
    static func from(_ settings: TextCaptureSettings) ->
        ScanditTextCaptureDefaults.TextCaptureSettingsDefaults {
            return ScanditTextCaptureDefaults.TextCaptureSettingsDefaults(
                recognitionDirection: settings.recognitionDirection.jsonString,
                duplicateFilter: settings.duplicateFilter)
    }
}
