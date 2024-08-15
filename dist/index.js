import { registerPlugin } from '@capacitor/core';
import { CapacitorCore, capacitorExec } from 'scandit-capacitor-datacapture-core';
import { nameForSerialization, serializationDefault, NoViewfinder, NoneLocationSelection, ignoreFromSerialization, DefaultSerializeable, Brush, CameraSettings, Color, Quadrilateral, Feedback, CameraController } from 'scandit-capacitor-datacapture-core/dist/core';

const defaultsFromJSON = (json) => {
    return {
        TextCapture: {
            TextCaptureOverlay: {
                DefaultBrush: {
                    fillColor: Color
                        .fromJSON(json.TextCapture.TextCaptureOverlay.Brush.fillColor),
                    strokeColor: Color
                        .fromJSON(json.TextCapture.TextCaptureOverlay.Brush.strokeColor),
                    strokeWidth: json.TextCapture.TextCaptureOverlay.Brush.strokeWidth,
                },
            },
            TextCaptureSettings: {
                recognitionDirection: json.TextCapture.TextCaptureSettings.recognitionDirection,
                duplicateFilter: json.TextCapture.TextCaptureSettings.duplicateFilter,
            },
            RecommendedCameraSettings: CameraSettings
                .fromJSON(json.TextCapture.RecommendedCameraSettings),
        },
    };
};

const pluginName = 'ScanditTextNative';
// tslint:disable-next-line:variable-name
const Capacitor = {
    pluginName,
    defaults: {},
    exec: (success, error, functionName, args) => capacitorExec(success, error, pluginName, functionName, args),
};
var CapacitorFunction;
(function (CapacitorFunction) {
    CapacitorFunction["GetDefaults"] = "getDefaults";
    CapacitorFunction["SubscribeTextCaptureListener"] = "subscribeTextCaptureListener";
    CapacitorFunction["SetModeEnabledState"] = "setModeEnabledState";
    CapacitorFunction["UpdateTextCaptureOverlay"] = "updateTextCaptureOverlay";
    CapacitorFunction["UpdateTextCaptureMode"] = "updateTextCaptureMode";
    CapacitorFunction["ApplyTextCaptureModeSettings"] = "applyTextCaptureModeSettings";
})(CapacitorFunction || (CapacitorFunction = {}));
const getDefaults = async () => {
    await window.Capacitor.Plugins[pluginName][CapacitorFunction.GetDefaults]()
        .then((defaultsJSON) => {
        const defaults = defaultsFromJSON(defaultsJSON);
        Capacitor.defaults = defaults;
    })
        .catch((error) => {
        // tslint:disable-next-line:no-console
        console.warn(error);
    });
    return Capacitor.defaults;
};

/**
 * @deprecated Text Capture mode is deprecated.
 */
class CapturedText {
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get value() {
        return this._value;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get location() {
        return this._location;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    static fromJSON(json) {
        console.warn('Text Capture mode is deprecated.');
        const text = new CapturedText();
        text._value = json.value;
        text._location = Quadrilateral.fromJSON(json.location);
        return text;
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @deprecated Text Capture mode is deprecated.
 */
class TextCaptureSession {
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get newlyCapturedTexts() {
        return this._newlyCapturedTexts;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get frameSequenceID() {
        return this._frameSequenceID;
    }
    static fromJSON(json) {
        console.warn('Text Capture mode is deprecated.');
        const session = new TextCaptureSession();
        session._newlyCapturedTexts = json.newlyCapturedTexts
            .map(CapturedText.fromJSON);
        session._frameSequenceID = json.frameSequenceId;
        return session;
    }
}
/**
 * @deprecated Text Capture mode is deprecated.
 */
class TextCaptureFeedback extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.success = Feedback.defaultFeedback;
    }
    static get default() {
        console.warn('Text Capture mode is deprecated.');
        return new TextCaptureFeedback();
    }
}
/**
 * @deprecated Text Capture mode is deprecated.
 */
class TextCaptureOverlay extends DefaultSerializeable {
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    static get defaultBrush() {
        console.warn('Text Capture mode is deprecated.');
        return new Brush(Capacitor.defaults.TextCapture.TextCaptureOverlay.DefaultBrush.fillColor, Capacitor.defaults.TextCapture.TextCaptureOverlay.DefaultBrush.strokeColor, Capacitor.defaults.TextCapture.TextCaptureOverlay.DefaultBrush.strokeWidth);
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get brush() {
        return this._brush;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    set brush(newBrush) {
        this._brush = newBrush;
        this.textCapture.listenerProxy.updateTextCaptureOverlay(this);
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get viewfinder() {
        return this._viewfinder;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    set viewfinder(newViewfinder) {
        this._viewfinder = newViewfinder;
        this.textCapture.listenerProxy.updateTextCaptureOverlay(this);
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get shouldShowScanAreaGuides() {
        return this._shouldShowScanAreaGuides;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    set shouldShowScanAreaGuides(shouldShow) {
        this._shouldShowScanAreaGuides = shouldShow;
        this.textCapture.listenerProxy.updateTextCaptureOverlay(this);
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    static withTextCapture(textCapture) {
        return TextCaptureOverlay.withTextCaptureForView(textCapture, null);
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
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
        console.warn('Text Capture mode is deprecated.');
    }
}
__decorate([
    ignoreFromSerialization
], TextCaptureOverlay.prototype, "textCapture", void 0);
__decorate([
    ignoreFromSerialization
], TextCaptureOverlay.prototype, "view", void 0);
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

var TextCaptureListenerEvent;
(function (TextCaptureListenerEvent) {
    TextCaptureListenerEvent["DidCapture"] = "TextCaptureListener.didCaptureText";
})(TextCaptureListenerEvent || (TextCaptureListenerEvent = {}));
class TextCaptureListenerProxy {
    static forTextCapture(textCapture) {
        const proxy = new TextCaptureListenerProxy();
        proxy.textCapture = textCapture;
        proxy.initialize();
        return proxy;
    }
    initialize() {
        this.subscribeListener();
    }
    updateTextCaptureMode() {
        return new Promise((resolve, reject) => {
            TextCaptureListenerProxy.capacitorExec(resolve, reject, CapacitorFunction.UpdateTextCaptureMode, {
                modeJson: JSON.stringify(this.textCapture.toJSON())
            });
        });
    }
    applyTextCaptureModeSettings(newSettings) {
        return new Promise((resolve, reject) => {
            TextCaptureListenerProxy.capacitorExec(resolve, reject, CapacitorFunction.ApplyTextCaptureModeSettings, {
                modeSettingsJson: JSON.stringify(newSettings.toJSON())
            });
        });
    }
    updateTextCaptureOverlay(overlay) {
        return new Promise((resolve, reject) => {
            TextCaptureListenerProxy.capacitorExec(resolve, reject, CapacitorFunction.UpdateTextCaptureOverlay, {
                overlayJson: JSON.stringify(overlay.toJSON())
            });
        });
    }
    setModeEnabledState(enabled) {
        return new Promise((resolve, reject) => {
            TextCaptureListenerProxy.capacitorExec(resolve, reject, CapacitorFunction.SetModeEnabledState, {
                enabled: enabled
            });
        });
    }
    subscribeListener() {
        TextCaptureListenerProxy.capacitorExec(this.notifyListeners.bind(this), null, CapacitorFunction.SubscribeTextCaptureListener, null);
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(TextCaptureListenerEvent.DidCapture, this.notifyListeners.bind(this));
    }
    notifyListeners(event) {
        const done = () => {
            this.textCapture.isInListenerCallback = false;
            window.Capacitor.Plugins[Capacitor.pluginName].finishCallback({
                result: {
                    enabled: this.textCapture.isEnabled,
                },
            });
            return { enabled: this.textCapture.isEnabled };
        };
        this.textCapture.isInListenerCallback = true;
        if (!event) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return done();
        }
        this.textCapture.listeners.forEach((listener) => {
            switch (event.name) {
                case TextCaptureListenerEvent.DidCapture:
                    if (listener.didCaptureText) {
                        listener.didCaptureText(this.textCapture, TextCaptureSession
                            .fromJSON(JSON.parse(event.session)), CameraController.getLastFrame);
                    }
                    break;
            }
        });
        return done();
    }
}
TextCaptureListenerProxy.capacitorExec = Capacitor.exec;

/**
 * @deprecated Text Capture mode is deprecated.
 */
class TextCapture extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'textCapture';
        this._isEnabled = true;
        this._feedback = TextCaptureFeedback.default;
        this._context = null;
        this.listeners = [];
        this.isInListenerCallback = false;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get isEnabled() {
        return this._isEnabled;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    set isEnabled(isEnabled) {
        this._isEnabled = isEnabled;
        this.listenerProxy.setModeEnabledState(isEnabled);
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get context() {
        return this._context;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    static get recommendedCameraSettings() {
        console.warn('Text Capture mode is deprecated.');
        return new CameraSettings(Capacitor.defaults.TextCapture.RecommendedCameraSettings);
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    get feedback() {
        return this._feedback;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    set feedback(feedback) {
        this._feedback = feedback;
        this.listenerProxy.updateTextCaptureMode();
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    static forContext(context, settings) {
        console.warn('Text Capture mode is deprecated.');
        const textCapture = new TextCapture();
        textCapture.settings = settings;
        if (context) {
            context.addMode(textCapture);
        }
        textCapture.listenerProxy = TextCaptureListenerProxy.forTextCapture(textCapture);
        return textCapture;
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    applySettings(settings) {
        this.settings = settings;
        return this.listenerProxy.applyTextCaptureModeSettings(settings);
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    addListener(listener) {
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    }
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    removeListener(listener) {
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}
__decorate([
    ignoreFromSerialization
], TextCapture.prototype, "_isEnabled", void 0);
__decorate([
    nameForSerialization('feedback')
], TextCapture.prototype, "_feedback", void 0);
__decorate([
    ignoreFromSerialization
], TextCapture.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], TextCapture.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], TextCapture.prototype, "listenerProxy", void 0);
__decorate([
    ignoreFromSerialization
], TextCapture.prototype, "isInListenerCallback", void 0);

/**
 * @deprecated Text Capture mode is deprecated.
 */
class TextCaptureSettings extends DefaultSerializeable {
    /**
     * @deprecated Text Capture mode is deprecated.
     */
    static fromJSON(json) {
        const settings = new TextCaptureSettings();
        Object.keys(json).forEach(key => {
            settings[key] = json[key];
        });
        return settings;
    }
    constructor() {
        super();
        /**
         * @deprecated Text Capture mode is deprecated.
         */
        this.duplicateFilter = Capacitor.defaults.TextCapture.TextCaptureSettings.duplicateFilter;
        /**
         * @deprecated Text Capture mode is deprecated.
         */
        this.locationSelection = null;
        /**
         * @deprecated Text Capture mode is deprecated.
         */
        this.recognitionDirection = Capacitor.defaults.TextCapture.TextCaptureSettings.recognitionDirection;
        console.warn('Text Capture mode is deprecated.');
    }
}
__decorate([
    serializationDefault(NoneLocationSelection)
], TextCaptureSettings.prototype, "locationSelection", void 0);

class ScanditTextPluginImplementation {
    async initialize(coreDefaults) {
        const api = {
            TextCapture,
            TextCaptureSettings,
            TextCaptureFeedback,
            TextCaptureOverlay,
            TextCaptureSession,
            CapturedText,
        };
        CapacitorCore.defaults = coreDefaults;
        const textDefaults = await getDefaults();
        Capacitor.defaults = textDefaults;
        return api;
    }
}
registerPlugin('ScanditTextPlugin', {
    android: () => new ScanditTextPluginImplementation(),
    ios: () => new ScanditTextPluginImplementation(),
    web: () => new ScanditTextPluginImplementation(),
});
// tslint:disable-next-line:variable-name
const ScanditTextPlugin = new ScanditTextPluginImplementation();

export { ScanditTextPlugin, ScanditTextPluginImplementation };
