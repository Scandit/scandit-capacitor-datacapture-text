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
/**
 * @deprecated Text Capture mode is deprecated.
 */
export declare class TextCaptureSession {
    private _newlyCapturedTexts;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get newlyCapturedTexts(): CapturedText[];
    private _frameSequenceID;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get frameSequenceID(): number;
    private static fromJSON;
}
/**
 * @deprecated Text Capture mode is deprecated.
 */
export interface TextCaptureListener {
    didCaptureText?(textCapture: TextCapture, session: TextCaptureSession, getFrameData: () => Promise<FrameData>): void;
}
export interface PrivateTextCaptureFeedback {
    toJSON: () => object;
}
/**
 * @deprecated Text Capture mode is deprecated.
 */
export declare class TextCaptureFeedback extends DefaultSerializeable {
    success: Feedback;
    static get default(): TextCaptureFeedback;
}
export interface PrivateTextCaptureOverlay {
    toJSON: () => object;
}
/**
 * @deprecated Text Capture mode is deprecated.
 */
export declare class TextCaptureOverlay extends DefaultSerializeable implements DataCaptureOverlay {
    private type;
    private textCapture;
    private view;
    private _shouldShowScanAreaGuides;
    private _viewfinder;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    static get defaultBrush(): Brush;
    private _brush;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get brush(): Brush;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    set brush(newBrush: Brush);
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get viewfinder(): Viewfinder | null;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    set viewfinder(newViewfinder: Viewfinder | null);
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get shouldShowScanAreaGuides(): boolean;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    set shouldShowScanAreaGuides(shouldShow: boolean);
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    static withTextCapture(textCapture: TextCapture): TextCaptureOverlay;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    static withTextCaptureForView(textCapture: TextCapture, view: DataCaptureView | null): TextCaptureOverlay;
    private constructor();
}
