import { Quadrilateral, QuadrilateralJSON } from 'scandit-datacapture-frameworks-core';
export interface CapturedTextJSON {
    value: string;
    location: QuadrilateralJSON;
}
export interface PrivateCapturedText {
    fromJSON(json: CapturedTextJSON): CapturedText;
}
export declare class CapturedText {
    private _value;
    get value(): string;
    private _location;
    get location(): Quadrilateral;
    private static fromJSON;
}
