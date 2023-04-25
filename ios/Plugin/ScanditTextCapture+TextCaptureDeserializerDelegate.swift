/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditTextCapture

extension ScanditTextNative: TextCaptureDeserializerDelegate {
    public func textCaptureDeserializer(_ deserializer: TextCaptureDeserializer,
                                        didStartDeserializingMode mode: TextCapture,
                                        from JSONValue: JSONValue) { }

    public func textCaptureDeserializer(_ deserializer: TextCaptureDeserializer,
                                        didFinishDeserializingMode mode: TextCapture,
                                        from JSONValue: JSONValue) {
        mode.isEnabled = JSONValue.bool(forKey: "enabled")

        mode.addListener(self)
    }

    public func textCaptureDeserializer(_ deserializer: TextCaptureDeserializer,
                                        didStartDeserializingSettings settings: TextCaptureSettings,
                                        from JSONValue: JSONValue) { }

    public func textCaptureDeserializer(_ deserializer: TextCaptureDeserializer,
                                        didFinishDeserializingSettings settings: TextCaptureSettings,
                                        from JSONValue: JSONValue) { }

    public func textCaptureDeserializer(_ deserializer: TextCaptureDeserializer,
                                        didStartDeserializingOverlay overlay: TextCaptureOverlay,
                                        from JSONValue: JSONValue) { }

    public func textCaptureDeserializer(_ deserializer: TextCaptureDeserializer,
                                        didFinishDeserializingOverlay overlay: TextCaptureOverlay,
                                        from JSONValue: JSONValue) { }
}
