/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditTextCapture
import ScanditCapacitorDatacaptureCore

extension ScanditTextNative: TextCaptureListener {
    public func textCapture(_ textCapture: TextCapture,
                            didCaptureIn session: TextCaptureSession,
                            frameData: FrameData) {
        guard let callback = callbacks.textCaptureListener else {
            return
        }

        ScanditCaptureCore.lastFrame = frameData
        defer { ScanditCaptureCore.lastFrame = nil }

        let listenerEvent = ListenerEvent(name: .didCaptureInTextCapture,
                                          argument: ["session": session.jsonString],
                                  shouldNotifyWhenFinished: true)
        waitForFinished(listenerEvent, callbackId: callback.id)
        finishBlockingCallback(with: textCapture, for: listenerEvent)
    }
}
