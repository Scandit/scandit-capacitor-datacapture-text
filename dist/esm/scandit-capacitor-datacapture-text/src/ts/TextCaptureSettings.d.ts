import { Direction } from '../../../scandit-capacitor-datacapture-core/src/ts/Common';
import { LocationSelection } from '../../../scandit-capacitor-datacapture-core/src/ts/LocationSelection';
import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
export declare class TextCaptureSettings extends DefaultSerializeable {
    duplicateFilter: number;
    locationSelection: LocationSelection | null;
    recognitionDirection: Direction;
    static fromJSON(json: {
        [key: string]: any;
    }): TextCaptureSettings | null;
    private constructor();
}
