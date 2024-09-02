import { FrameData } from 'scandit-datacapture-frameworks-core';
import { CapturedText, CapturedTextJSON } from './CapturedText';
import { DataCaptureOverlay } from 'scandit-datacapture-frameworks-core';
import { DataCaptureView } from 'scandit-capacitor-datacapture-core';
import { Feedback } from 'scandit-datacapture-frameworks-core';
import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
import { TextCapture } from './TextCapture';
import { Brush, Viewfinder } from 'scandit-datacapture-frameworks-core';
export interface TextCaptureSessionJSON {
    newlyCapturedTexts: CapturedTextJSON[];
    frameSequenceId: number;
}
export interface PrivateTextCaptureSession {
    fromJSON(json: TextCaptureSessionJSON): TextCaptureSession;
}
export declare class TextCaptureSession {
    private _newlyCapturedTexts;
    get newlyCapturedTexts(): CapturedText[];
    private _frameSequenceID;
    get frameSequenceID(): number;
    private static fromJSON;
}
export interface TextCaptureListener {
    didCaptureText?(textCapture: TextCapture, session: TextCaptureSession, getFrameData: () => Promise<FrameData>): void;
}
export interface PrivateTextCaptureFeedback {
    toJSON: () => object;
}
export declare class TextCaptureFeedback extends DefaultSerializeable {
    success: Feedback;
    static get default(): TextCaptureFeedback;
}
export interface PrivateTextCaptureOverlay {
    toJSON: () => object;
}
export declare class TextCaptureOverlay extends DefaultSerializeable implements DataCaptureOverlay {
    private type;
    private textCapture;
    private view;
    private _shouldShowScanAreaGuides;
    private _viewfinder;
    static get defaultBrush(): Brush;
    private _brush;
    get brush(): Brush;
    set brush(newBrush: Brush);
    get viewfinder(): Viewfinder | null;
    set viewfinder(newViewfinder: Viewfinder | null);
    get shouldShowScanAreaGuides(): boolean;
    set shouldShowScanAreaGuides(shouldShow: boolean);
    static withTextCapture(textCapture: TextCapture): TextCaptureOverlay;
    static withTextCaptureForView(textCapture: TextCapture, view: DataCaptureView | null): TextCaptureOverlay;
    private constructor();
}
