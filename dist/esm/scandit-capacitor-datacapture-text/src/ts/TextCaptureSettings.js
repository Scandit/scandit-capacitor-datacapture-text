var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Capacitor } from './Capacitor/Capacitor';
import { NoneLocationSelection } from '../../../scandit-capacitor-datacapture-core/src/ts/LocationSelection';
import { DefaultSerializeable, serializationDefault } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
export class TextCaptureSettings extends DefaultSerializeable {
    static fromJSON(json) {
        const settings = new TextCaptureSettings();
        Object.keys(json).forEach(key => {
            settings[key] = json[key];
        });
        return settings;
    }
    constructor() {
        super();
        this.duplicateFilter = Capacitor.defaults.TextCapture.TextCaptureSettings.duplicateFilter;
        this.locationSelection = null;
        this.recognitionDirection = Capacitor.defaults.TextCapture.TextCaptureSettings.recognitionDirection;
    }
}
__decorate([
    serializationDefault(NoneLocationSelection)
], TextCaptureSettings.prototype, "locationSelection", void 0);
//# sourceMappingURL=TextCaptureSettings.js.map