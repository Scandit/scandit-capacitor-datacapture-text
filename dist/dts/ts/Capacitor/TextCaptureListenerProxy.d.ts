import { TextCaptureOverlay } from '../TextCapture+Related';
import { TextCaptureSettings } from '../TextCaptureSettings';
declare type TextCapture = any;
export declare class TextCaptureListenerProxy {
    private static capacitorExec;
    private textCapture;
    static forTextCapture(textCapture: TextCapture): TextCaptureListenerProxy;
    private initialize;
    updateTextCaptureMode(): Promise<void>;
    applyTextCaptureModeSettings(newSettings: TextCaptureSettings): Promise<void>;
    updateTextCaptureOverlay(overlay: TextCaptureOverlay): Promise<void>;
    setModeEnabledState(enabled: boolean): Promise<void>;
    private subscribeListener;
    private notifyListeners;
}
export {};
