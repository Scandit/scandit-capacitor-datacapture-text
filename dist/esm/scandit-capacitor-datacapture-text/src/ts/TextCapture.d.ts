import { CameraSettings } from '../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { DataCaptureContext, DataCaptureMode, PrivateDataCaptureMode } from '../../../scandit-capacitor-datacapture-core/src/ts/DataCaptureContext';
import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { TextCaptureFeedback, TextCaptureListener } from './TextCapture+Related';
import { TextCaptureSettings } from './TextCaptureSettings';
export interface PrivateTextCapture extends PrivateDataCaptureMode {
    _context: DataCaptureContext | null;
    didChange: () => Promise<void>;
}
export declare class TextCapture extends DefaultSerializeable implements DataCaptureMode {
    get isEnabled(): boolean;
    set isEnabled(isEnabled: boolean);
    get context(): DataCaptureContext | null;
    static get recommendedCameraSettings(): CameraSettings;
    get feedback(): TextCaptureFeedback;
    set feedback(feedback: TextCaptureFeedback);
    private type;
    private _isEnabled;
    private _feedback;
    private settings;
    private _context;
    private listeners;
    private listenerProxy;
    private isInListenerCallback;
    static forContext(context: DataCaptureContext | null, settings: TextCaptureSettings): TextCapture;
    applySettings(settings: TextCaptureSettings): Promise<void>;
    addListener(listener: TextCaptureListener): void;
    removeListener(listener: TextCaptureListener): void;
    private didChange;
}
