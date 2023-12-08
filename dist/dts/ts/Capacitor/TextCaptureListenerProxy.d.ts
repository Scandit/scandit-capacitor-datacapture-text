declare type TextCapture = any;
export declare class TextCaptureListenerProxy {
    private static capacitorExec;
    private textCapture;
    static forTextCapture(textCapture: TextCapture): TextCaptureListenerProxy;
    private initialize;
    private subscribeListener;
    private notifyListeners;
}
export {};
