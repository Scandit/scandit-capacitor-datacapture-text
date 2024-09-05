import { Quadrilateral, QuadrilateralJSON } from 'scandit-datacapture-frameworks-core';
export interface CapturedTextJSON {
    value: string;
    location: QuadrilateralJSON;
}
export interface PrivateCapturedText {
    fromJSON(json: CapturedTextJSON): CapturedText;
}
/**
 * @deprecated Text Capture mode is deprecated.
 */
export declare class CapturedText {
    private _value;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get value(): string;
    private _location;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get location(): Quadrilateral;
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    private static fromJSON;
}
