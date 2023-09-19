var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CapturedText } from './CapturedText';
import { Capacitor } from './Capacitor/Capacitor';
import { Feedback } from '../../../scandit-capacitor-datacapture-core/src/ts/Feedback';
import { DefaultSerializeable, ignoreFromSerialization, nameForSerialization, serializationDefault, } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { Brush, NoViewfinder } from '../../../scandit-capacitor-datacapture-core/src/ts/Viewfinder';
export class TextCaptureSession {
    get newlyCapturedTexts() {
        return this._newlyCapturedTexts;
    }
    get frameSequenceID() {
        return this._frameSequenceID;
    }
    static fromJSON(json) {
        const session = new TextCaptureSession();
        session._newlyCapturedTexts = json.newlyCapturedTexts
            .map(CapturedText.fromJSON);
        session._frameSequenceID = json.frameSequenceId;
        return session;
    }
}
export class TextCaptureFeedback extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.success = Feedback.defaultFeedback;
    }
    static get default() {
        return new TextCaptureFeedback();
    }
}
export class TextCaptureOverlay extends DefaultSerializeable {
    static get defaultBrush() {
        return new Brush(Capacitor.defaults.TextCapture.TextCaptureOverlay.DefaultBrush.fillColor, Capacitor.defaults.TextCapture.TextCaptureOverlay.DefaultBrush.strokeColor, Capacitor.defaults.TextCapture.TextCaptureOverlay.DefaultBrush.strokeWidth);
    }
    get brush() {
        return this._brush;
    }
    set brush(newBrush) {
        this._brush = newBrush;
        this.textCapture.didChange();
    }
    get viewfinder() {
        return this._viewfinder;
    }
    set viewfinder(newViewfinder) {
        this._viewfinder = newViewfinder;
        this.textCapture.didChange();
    }
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.textCapture.didChange();
    }
    static withTextCapture(textCapture) {
        return TextCaptureOverlay.withTextCaptureForView(textCapture, null);
    }
    static withTextCaptureForView(textCapture, view) {
        const overlay = new TextCaptureOverlay();
        overlay.textCapture = textCapture;
        if (view) {
            view.addOverlay(overlay);
        }
        return overlay;
    }
    constructor() {
        super();
        this.type = 'textCapture';
        this._shouldShowScanAreaGuides = false;
        this._viewfinder = null;
        this._brush = TextCaptureOverlay.defaultBrush;
    }
}
__decorate([
    ignoreFromSerialization
], TextCaptureOverlay.prototype, "textCapture", void 0);
__decorate([
    nameForSerialization('shouldShowScanAreaGuides')
], TextCaptureOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
__decorate([
    serializationDefault(NoViewfinder),
    nameForSerialization('viewfinder')
], TextCaptureOverlay.prototype, "_viewfinder", void 0);
__decorate([
    nameForSerialization('brush')
], TextCaptureOverlay.prototype, "_brush", void 0);
//# sourceMappingURL=TextCapture+Related.js.map