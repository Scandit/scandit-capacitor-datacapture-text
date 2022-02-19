import ScanditTextCapture
import ScanditCapacitorDatacaptureCore

extension ScanditTextNative: TextCaptureListener {
    public func textCapture(_ textCapture: TextCapture,
                            didCaptureIn session: TextCaptureSession,
                            frameData: FrameData) {
        guard let callback = callbacks.textCaptureListener else {
            return
        }

        let listenerEvent = ListenerEvent(name: .didCaptureInTextCapture,
                                          argument: ["session": session.jsonString],
                                  shouldNotifyWhenFinished: true)
        waitForFinished(listenerEvent, callbackId: callback.id)
        finishBlockingCallback(with: textCapture, for: listenerEvent)
    }
}
