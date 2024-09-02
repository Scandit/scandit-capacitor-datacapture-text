import { Direction } from 'scandit-datacapture-frameworks-core';
import { LocationSelection } from 'scandit-datacapture-frameworks-core';
import { DefaultSerializeable } from 'scandit-datacapture-frameworks-core';
export declare class TextCaptureSettings extends DefaultSerializeable {
    duplicateFilter: number;
    locationSelection: LocationSelection | null;
    recognitionDirection: Direction;
    static fromJSON(json: {
        [key: string]: any;
    }): TextCaptureSettings | null;
    private constructor();
}
