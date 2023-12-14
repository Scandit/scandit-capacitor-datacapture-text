import { Quadrilateral } from '../../../scandit-capacitor-datacapture-core/src/ts/Common';
export class CapturedText {
    get value() {
        return this._value;
    }
    get location() {
        return this._location;
    }
    static fromJSON(json) {
        const text = new CapturedText();
        text._value = json.value;
        text._location = Quadrilateral.fromJSON(json.location);
        return text;
    }
}
//# sourceMappingURL=CapturedText.js.map