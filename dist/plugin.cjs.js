'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

class CapacitorError {
    static fromJSON(json) {
        if (json && json.code && json.message) {
            return new CapacitorError(json.code, json.message);
        }
        else {
            return null;
        }
    }
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
const capacitorExec = (successCallback, errorCallback, pluginName, functionName, args) => {
    if (window.Scandit && window.Scandit.DEBUG) {
        // tslint:disable-next-line:no-console
        console.log(`Called native function: ${functionName}`, args, { success: successCallback, error: errorCallback });
    }
    const extendedSuccessCallback = (message) => {
        const shouldCallback = message && message.shouldNotifyWhenFinished;
        const finishCallbackID = shouldCallback ? message.finishCallbackID : null;
        const started = Date.now();
        let callbackResult;
        if (successCallback) {
            callbackResult = successCallback(message);
        }
        if (shouldCallback) {
            const maxCallbackDuration = 50;
            const callbackDuration = Date.now() - started;
            if (callbackDuration > maxCallbackDuration) {
                // tslint:disable-next-line:no-console
                console.log(`[SCANDIT WARNING] Took ${callbackDuration}ms to execute callback that's blocking native execution. You should keep this duration short, for more information, take a look at the documentation.`);
            }
            window.Capacitor.Plugins[pluginName].finishCallback([{
                    finishCallbackID,
                    result: callbackResult,
                }]);
        }
    };
    const extendedErrorCallback = (error) => {
        if (errorCallback) {
            const capacitorError = CapacitorError.fromJSON(error);
            if (capacitorError !== null) {
                error = capacitorError;
            }
            errorCallback(error);
        }
    };
    window.Capacitor.Plugins[pluginName][functionName](args).then(extendedSuccessCallback, extendedErrorCallback);
};

// tslint:disable-next-line:ban-types
function ignoreFromSerialization(target, propertyName) {
    target.ignoredProperties = target.ignoredProperties || [];
    target.ignoredProperties.push(propertyName);
}
// tslint:disable-next-line:ban-types
function nameForSerialization(customName) {
    return (target, propertyName) => {
        target.customPropertyNames = target.customPropertyNames || {};
        target.customPropertyNames[propertyName] = customName;
    };
}
// tslint:disable-next-line:ban-types
function ignoreFromSerializationIfNull(target, propertyName) {
    target.ignoredIfNullProperties = target.ignoredIfNullProperties || [];
    target.ignoredIfNullProperties.push(propertyName);
}
// tslint:disable-next-line:ban-types
function serializationDefault(defaultValue) {
    return (target, propertyName) => {
        target.customPropertyDefaults = target.customPropertyDefaults || {};
        target.customPropertyDefaults[propertyName] = defaultValue;
    };
}
class DefaultSerializeable {
    toJSON() {
        const properties = Object.keys(this);
        // use @ignoreFromSerialization to ignore properties
        const ignoredProperties = this.ignoredProperties || [];
        // use @ignoreFromSerializationIfNull to ignore properties if they're null
        const ignoredIfNullProperties = this.ignoredIfNullProperties || [];
        // use @nameForSerialization('customName') to rename properties in the JSON output
        const customPropertyNames = this.customPropertyNames || {};
        // use @serializationDefault({}) to use a different value in the JSON output if they're null
        const customPropertyDefaults = this.customPropertyDefaults || {};
        return properties.reduce((json, property) => {
            if (ignoredProperties.includes(property)) {
                return json;
            }
            let value = this[property];
            if (value === undefined) {
                return json;
            }
            // Ignore if it's null and should be ignored.
            // This is basically responsible for not including optional properties in the JSON if they're null,
            // as that's not always deserialized to mean the same as not present.
            if (value === null && ignoredIfNullProperties.includes(property)) {
                return json;
            }
            if (value === null && customPropertyDefaults[property] !== undefined) {
                value = customPropertyDefaults[property];
            }
            // Serialize if serializeable
            if (value != null && value.toJSON) {
                value = value.toJSON();
            }
            // Serialize the array if the elements are serializeable
            if (Array.isArray(value)) {
                value = value.map(e => e.toJSON ? e.toJSON() : e);
            }
            const propertyName = customPropertyNames[property] || property;
            json[propertyName] = value;
            return json;
        }, {});
    }
}

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class Point extends DefaultSerializeable {
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    static fromJSON(json) {
        return new Point(json.x, json.y);
    }
    constructor(x, y) {
        super();
        this._x = x;
        this._y = y;
    }
}
__decorate$8([
    nameForSerialization('x')
], Point.prototype, "_x", void 0);
__decorate$8([
    nameForSerialization('y')
], Point.prototype, "_y", void 0);
class Quadrilateral extends DefaultSerializeable {
    get topLeft() {
        return this._topLeft;
    }
    get topRight() {
        return this._topRight;
    }
    get bottomRight() {
        return this._bottomRight;
    }
    get bottomLeft() {
        return this._bottomLeft;
    }
    static fromJSON(json) {
        return new Quadrilateral(Point.fromJSON(json.topLeft), Point.fromJSON(json.topRight), Point.fromJSON(json.bottomRight), Point.fromJSON(json.bottomLeft));
    }
    constructor(topLeft, topRight, bottomRight, bottomLeft) {
        super();
        this._topLeft = topLeft;
        this._topRight = topRight;
        this._bottomRight = bottomRight;
        this._bottomLeft = bottomLeft;
    }
}
__decorate$8([
    nameForSerialization('topLeft')
], Quadrilateral.prototype, "_topLeft", void 0);
__decorate$8([
    nameForSerialization('topRight')
], Quadrilateral.prototype, "_topRight", void 0);
__decorate$8([
    nameForSerialization('bottomRight')
], Quadrilateral.prototype, "_bottomRight", void 0);
__decorate$8([
    nameForSerialization('bottomLeft')
], Quadrilateral.prototype, "_bottomLeft", void 0);
var MeasureUnit;
(function (MeasureUnit) {
    MeasureUnit["DIP"] = "dip";
    MeasureUnit["Pixel"] = "pixel";
    MeasureUnit["Fraction"] = "fraction";
})(MeasureUnit || (MeasureUnit = {}));
class NumberWithUnit extends DefaultSerializeable {
    get value() {
        return this._value;
    }
    get unit() {
        return this._unit;
    }
    static fromJSON(json) {
        return new NumberWithUnit(json.value, json.unit);
    }
    constructor(value, unit) {
        super();
        this._value = value;
        this._unit = unit;
    }
}
__decorate$8([
    nameForSerialization('value')
], NumberWithUnit.prototype, "_value", void 0);
__decorate$8([
    nameForSerialization('unit')
], NumberWithUnit.prototype, "_unit", void 0);
class PointWithUnit extends DefaultSerializeable {
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    static fromJSON(json) {
        return new PointWithUnit(NumberWithUnit.fromJSON(json.x), NumberWithUnit.fromJSON(json.y));
    }
    static get zero() {
        return new PointWithUnit(new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel));
    }
    constructor(x, y) {
        super();
        this._x = x;
        this._y = y;
    }
}
__decorate$8([
    nameForSerialization('x')
], PointWithUnit.prototype, "_x", void 0);
__decorate$8([
    nameForSerialization('y')
], PointWithUnit.prototype, "_y", void 0);
class Rect extends DefaultSerializeable {
    get origin() {
        return this._origin;
    }
    get size() {
        return this._size;
    }
    constructor(origin, size) {
        super();
        this._origin = origin;
        this._size = size;
    }
}
__decorate$8([
    nameForSerialization('origin')
], Rect.prototype, "_origin", void 0);
__decorate$8([
    nameForSerialization('size')
], Rect.prototype, "_size", void 0);
class RectWithUnit extends DefaultSerializeable {
    get origin() {
        return this._origin;
    }
    get size() {
        return this._size;
    }
    constructor(origin, size) {
        super();
        this._origin = origin;
        this._size = size;
    }
}
__decorate$8([
    nameForSerialization('origin')
], RectWithUnit.prototype, "_origin", void 0);
__decorate$8([
    nameForSerialization('size')
], RectWithUnit.prototype, "_size", void 0);
class SizeWithUnit extends DefaultSerializeable {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    constructor(width, height) {
        super();
        this._width = width;
        this._height = height;
    }
}
__decorate$8([
    nameForSerialization('width')
], SizeWithUnit.prototype, "_width", void 0);
__decorate$8([
    nameForSerialization('height')
], SizeWithUnit.prototype, "_height", void 0);
class Size extends DefaultSerializeable {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    static fromJSON(json) {
        return new Size(json.width, json.height);
    }
    constructor(width, height) {
        super();
        this._width = width;
        this._height = height;
    }
}
__decorate$8([
    nameForSerialization('width')
], Size.prototype, "_width", void 0);
__decorate$8([
    nameForSerialization('height')
], Size.prototype, "_height", void 0);
class SizeWithAspect {
    get size() {
        return this._size;
    }
    get aspect() {
        return this._aspect;
    }
    constructor(size, aspect) {
        this._size = size;
        this._aspect = aspect;
    }
}
__decorate$8([
    nameForSerialization('size')
], SizeWithAspect.prototype, "_size", void 0);
__decorate$8([
    nameForSerialization('aspect')
], SizeWithAspect.prototype, "_aspect", void 0);
var SizingMode;
(function (SizingMode) {
    SizingMode["WidthAndHeight"] = "widthAndHeight";
    SizingMode["WidthAndAspectRatio"] = "widthAndAspectRatio";
    SizingMode["HeightAndAspectRatio"] = "heightAndAspectRatio";
    SizingMode["ShorterDimensionAndAspectRatio"] = "shorterDimensionAndAspectRatio";
})(SizingMode || (SizingMode = {}));
class SizeWithUnitAndAspect {
    constructor() {
        this._shorterDimensionAndAspectRatio = null;
    }
    get widthAndHeight() {
        return this._widthAndHeight;
    }
    get widthAndAspectRatio() {
        return this._widthAndAspectRatio;
    }
    get heightAndAspectRatio() {
        return this._heightAndAspectRatio;
    }
    get shorterDimensionAndAspectRatio() {
        return this._shorterDimensionAndAspectRatio;
    }
    get sizingMode() {
        if (this.widthAndAspectRatio) {
            return SizingMode.WidthAndAspectRatio;
        }
        if (this.heightAndAspectRatio) {
            return SizingMode.HeightAndAspectRatio;
        }
        if (this.shorterDimensionAndAspectRatio) {
            return SizingMode.ShorterDimensionAndAspectRatio;
        }
        return SizingMode.WidthAndHeight;
    }
    static sizeWithWidthAndHeight(widthAndHeight) {
        const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._widthAndHeight = widthAndHeight;
        return sizeWithUnitAndAspect;
    }
    static sizeWithWidthAndAspectRatio(width, aspectRatio) {
        const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._widthAndAspectRatio = new SizeWithAspect(width, aspectRatio);
        return sizeWithUnitAndAspect;
    }
    static sizeWithHeightAndAspectRatio(height, aspectRatio) {
        const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._heightAndAspectRatio = new SizeWithAspect(height, aspectRatio);
        return sizeWithUnitAndAspect;
    }
    static sizeWithShorterDimensionAndAspectRatio(shorterDimension, aspectRatio) {
        const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._shorterDimensionAndAspectRatio = new SizeWithAspect(shorterDimension, aspectRatio);
        return sizeWithUnitAndAspect;
    }
    static fromJSON(json) {
        if (json.width && json.height) {
            return this.sizeWithWidthAndHeight(new SizeWithUnit(NumberWithUnit.fromJSON(json.width), NumberWithUnit.fromJSON(json.height)));
        }
        else if (json.width && json.aspect) {
            return this.sizeWithWidthAndAspectRatio(NumberWithUnit.fromJSON(json.width), json.aspect);
        }
        else if (json.height && json.aspect) {
            return this.sizeWithHeightAndAspectRatio(NumberWithUnit.fromJSON(json.height), json.aspect);
        }
        else if (json.shorterDimension && json.aspect) {
            return this.sizeWithShorterDimensionAndAspectRatio(NumberWithUnit.fromJSON(json.shorterDimension), json.aspect);
        }
        else {
            throw new Error(`SizeWithUnitAndAspectJSON is malformed: ${JSON.stringify(json)}`);
        }
    }
    // no member access so our coverage check doesn't pick it up
    // TODO: https://jira.scandit.com/browse/SDC-1773
    // tslint:disable-next-line:member-access
    toJSON() {
        switch (this.sizingMode) {
            case SizingMode.WidthAndAspectRatio:
                return {
                    width: this.widthAndAspectRatio.size.toJSON(),
                    aspect: this.widthAndAspectRatio.aspect,
                };
            case SizingMode.HeightAndAspectRatio:
                return {
                    height: this.heightAndAspectRatio.size.toJSON(),
                    aspect: this.heightAndAspectRatio.aspect,
                };
            case SizingMode.ShorterDimensionAndAspectRatio:
                return {
                    shorterDimension: this.shorterDimensionAndAspectRatio.size.toJSON(),
                    aspect: this.shorterDimensionAndAspectRatio.aspect,
                };
            default:
                return {
                    width: this.widthAndHeight.width.toJSON(),
                    height: this.widthAndHeight.height.toJSON(),
                };
        }
    }
}
__decorate$8([
    nameForSerialization('widthAndHeight')
], SizeWithUnitAndAspect.prototype, "_widthAndHeight", void 0);
__decorate$8([
    nameForSerialization('widthAndAspectRatio')
], SizeWithUnitAndAspect.prototype, "_widthAndAspectRatio", void 0);
__decorate$8([
    nameForSerialization('heightAndAspectRatio')
], SizeWithUnitAndAspect.prototype, "_heightAndAspectRatio", void 0);
__decorate$8([
    nameForSerialization('shorterDimensionAndAspectRatio')
], SizeWithUnitAndAspect.prototype, "_shorterDimensionAndAspectRatio", void 0);
class MarginsWithUnit extends DefaultSerializeable {
    get left() {
        return this._left;
    }
    get right() {
        return this._right;
    }
    get top() {
        return this._top;
    }
    get bottom() {
        return this._bottom;
    }
    static fromJSON(json) {
        return new MarginsWithUnit(NumberWithUnit.fromJSON(json.left), NumberWithUnit.fromJSON(json.right), NumberWithUnit.fromJSON(json.top), NumberWithUnit.fromJSON(json.bottom));
    }
    static get zero() {
        return new MarginsWithUnit(new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel));
    }
    constructor(left, right, top, bottom) {
        super();
        this._left = left;
        this._right = right;
        this._top = top;
        this._bottom = bottom;
    }
}
__decorate$8([
    nameForSerialization('left')
], MarginsWithUnit.prototype, "_left", void 0);
__decorate$8([
    nameForSerialization('right')
], MarginsWithUnit.prototype, "_right", void 0);
__decorate$8([
    nameForSerialization('top')
], MarginsWithUnit.prototype, "_top", void 0);
__decorate$8([
    nameForSerialization('bottom')
], MarginsWithUnit.prototype, "_bottom", void 0);
class Color {
    get redComponent() {
        return this.hexadecimalString.slice(0, 2);
    }
    get greenComponent() {
        return this.hexadecimalString.slice(2, 4);
    }
    get blueComponent() {
        return this.hexadecimalString.slice(4, 6);
    }
    get alphaComponent() {
        return this.hexadecimalString.slice(6, 8);
    }
    get red() {
        return Color.hexToNumber(this.redComponent);
    }
    get green() {
        return Color.hexToNumber(this.greenComponent);
    }
    get blue() {
        return Color.hexToNumber(this.blueComponent);
    }
    get alpha() {
        return Color.hexToNumber(this.alphaComponent);
    }
    static fromHex(hex) {
        return new Color(Color.normalizeHex(hex));
    }
    static fromRGBA(red, green, blue, alpha = 1) {
        const hexString = [red, green, blue, this.normalizeAlpha(alpha)]
            .reduce((hex, colorComponent) => hex + this.numberToHex(colorComponent), '');
        return new Color(hexString);
    }
    static hexToNumber(hex) {
        return parseInt(hex, 16);
    }
    static fromJSON(json) {
        return Color.fromHex(json);
    }
    static numberToHex(x) {
        x = Math.round(x);
        let hex = x.toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex.toUpperCase();
    }
    static normalizeHex(hex) {
        // remove leading #
        if (hex[0] === '#') {
            hex = hex.slice(1);
        }
        // double digits if single digit
        if (hex.length < 6) {
            hex = hex.split('').map(s => s + s).join('');
        }
        // add alpha if missing
        if (hex.length === 6) {
            hex = hex + 'FF';
        }
        return hex.toUpperCase();
    }
    static normalizeAlpha(alpha) {
        if (alpha > 0 && alpha <= 1) {
            return 255 * alpha;
        }
        return alpha;
    }
    constructor(hex) {
        this.hexadecimalString = hex;
    }
    withAlpha(alpha) {
        const newHex = this.hexadecimalString.slice(0, 6) + Color.numberToHex(Color.normalizeAlpha(alpha));
        return Color.fromHex(newHex);
    }
    // no member access so our coverage check doesn't pick it up
    // TODO: https://jira.scandit.com/browse/SDC-1773
    // tslint:disable-next-line:member-access
    toJSON() {
        return this.hexadecimalString;
    }
}
var Orientation;
(function (Orientation) {
    Orientation["Unknown"] = "unknown";
    Orientation["Portrait"] = "portrait";
    Orientation["PortraitUpsideDown"] = "portraitUpsideDown";
    Orientation["LandscapeRight"] = "landscapeRight";
    Orientation["LandscapeLeft"] = "landscapeLeft";
})(Orientation || (Orientation = {}));
var Direction;
(function (Direction) {
    Direction["None"] = "none";
    Direction["Horizontal"] = "horizontal";
    Direction["LeftToRight"] = "leftToRight";
    Direction["RightToLeft"] = "rightToLeft";
    Direction["Vertical"] = "vertical";
    Direction["TopToBottom"] = "topToBottom";
    Direction["BottomToTop"] = "bottomToTop";
})(Direction || (Direction = {}));

var LogoStyle;
(function (LogoStyle) {
    LogoStyle["Minimal"] = "minimal";
    LogoStyle["Extended"] = "extended";
})(LogoStyle || (LogoStyle = {}));

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RectangularViewfinderStyle;
(function (RectangularViewfinderStyle) {
    RectangularViewfinderStyle["Legacy"] = "legacy";
    RectangularViewfinderStyle["Rounded"] = "rounded";
    RectangularViewfinderStyle["Square"] = "square";
})(RectangularViewfinderStyle || (RectangularViewfinderStyle = {}));
var RectangularViewfinderLineStyle;
(function (RectangularViewfinderLineStyle) {
    RectangularViewfinderLineStyle["Light"] = "light";
    RectangularViewfinderLineStyle["Bold"] = "bold";
})(RectangularViewfinderLineStyle || (RectangularViewfinderLineStyle = {}));
var LaserlineViewfinderStyle;
(function (LaserlineViewfinderStyle) {
    LaserlineViewfinderStyle["Legacy"] = "legacy";
    LaserlineViewfinderStyle["Animated"] = "animated";
})(LaserlineViewfinderStyle || (LaserlineViewfinderStyle = {}));
class RectangularViewfinderAnimation extends DefaultSerializeable {
    static fromJSON(json) {
        if (json === null) {
            return null;
        }
        return new RectangularViewfinderAnimation(json.looping);
    }
    get isLooping() {
        return this._isLooping;
    }
    constructor(isLooping) {
        super();
        this._isLooping = false;
        this._isLooping = isLooping;
    }
}
__decorate$7([
    nameForSerialization('isLooping')
], RectangularViewfinderAnimation.prototype, "_isLooping", void 0);

var CapacitorFunction$1;
(function (CapacitorFunction) {
    CapacitorFunction["GetDefaults"] = "getDefaults";
    CapacitorFunction["ContextFromJSON"] = "contextFromJSON";
    CapacitorFunction["DisposeContext"] = "disposeContext";
    CapacitorFunction["UpdateContextFromJSON"] = "updateContextFromJSON";
    CapacitorFunction["SubscribeContextListener"] = "subscribeContextListener";
    CapacitorFunction["SubscribeContextFrameListener"] = "subscribeContextFrameListener";
    CapacitorFunction["SetViewPositionAndSize"] = "setViewPositionAndSize";
    CapacitorFunction["ShowView"] = "showView";
    CapacitorFunction["HideView"] = "hideView";
    CapacitorFunction["ViewPointForFramePoint"] = "viewPointForFramePoint";
    CapacitorFunction["ViewQuadrilateralForFrameQuadrilateral"] = "viewQuadrilateralForFrameQuadrilateral";
    CapacitorFunction["SubscribeViewListener"] = "subscribeViewListener";
    CapacitorFunction["GetCurrentCameraState"] = "getCurrentCameraState";
    CapacitorFunction["GetIsTorchAvailable"] = "getIsTorchAvailable";
    CapacitorFunction["GetLastFrame"] = "getLastFrame";
    CapacitorFunction["GetLastFrameOrNull"] = "getLastFrameOrNull";
    CapacitorFunction["EmitFeedback"] = "emitFeedback";
    CapacitorFunction["SubscribeVolumeButtonObserver"] = "subscribeVolumeButtonObserver";
    CapacitorFunction["UnsubscribeVolumeButtonObserver"] = "unsubscribeVolumeButtonObserver";
})(CapacitorFunction$1 || (CapacitorFunction$1 = {}));
const pluginName$1 = 'ScanditCaptureCoreNative';
// tslint:disable-next-line:variable-name
const Capacitor$1 = {
    pluginName: pluginName$1,
    defaults: {},
    exec: (success, error, functionName, args) => capacitorExec(success, error, pluginName$1, functionName, args),
};

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FrameSourceState;
(function (FrameSourceState) {
    FrameSourceState["On"] = "on";
    FrameSourceState["Off"] = "off";
    FrameSourceState["Starting"] = "starting";
    FrameSourceState["Stopping"] = "stopping";
    FrameSourceState["Standby"] = "standby";
    FrameSourceState["BootingUp"] = "bootingUp";
    FrameSourceState["WakingUp"] = "wakingUp";
    FrameSourceState["GoingToSleep"] = "goingToSleep";
    FrameSourceState["ShuttingDown"] = "shuttingDown";
})(FrameSourceState || (FrameSourceState = {}));
var TorchState;
(function (TorchState) {
    TorchState["On"] = "on";
    TorchState["Off"] = "off";
    TorchState["Auto"] = "auto";
})(TorchState || (TorchState = {}));
var CameraPosition;
(function (CameraPosition) {
    CameraPosition["WorldFacing"] = "worldFacing";
    CameraPosition["UserFacing"] = "userFacing";
    CameraPosition["Unspecified"] = "unspecified";
})(CameraPosition || (CameraPosition = {}));
var VideoResolution;
(function (VideoResolution) {
    VideoResolution["Auto"] = "auto";
    VideoResolution["HD"] = "hd";
    VideoResolution["FullHD"] = "fullHd";
    VideoResolution["UHD4K"] = "uhd4k";
})(VideoResolution || (VideoResolution = {}));
var FocusRange;
(function (FocusRange) {
    FocusRange["Full"] = "full";
    FocusRange["Near"] = "near";
    FocusRange["Far"] = "far";
})(FocusRange || (FocusRange = {}));
var FocusGestureStrategy;
(function (FocusGestureStrategy) {
    FocusGestureStrategy["None"] = "none";
    FocusGestureStrategy["Manual"] = "manual";
    FocusGestureStrategy["ManualUntilCapture"] = "manualUntilCapture";
    FocusGestureStrategy["AutoOnLocation"] = "autoOnLocation";
})(FocusGestureStrategy || (FocusGestureStrategy = {}));
var PrivateCameraProperty;
(function (PrivateCameraProperty) {
    PrivateCameraProperty["CameraAPI"] = "api";
})(PrivateCameraProperty || (PrivateCameraProperty = {}));
class CameraSettings extends DefaultSerializeable {
    get focusRange() {
        return this.focus.range;
    }
    set focusRange(newRange) {
        this.focus.range = newRange;
    }
    get focusGestureStrategy() {
        return this.focus.focusGestureStrategy;
    }
    set focusGestureStrategy(newStrategy) {
        this.focus.focusGestureStrategy = newStrategy;
    }
    get shouldPreferSmoothAutoFocus() {
        return this.focus.shouldPreferSmoothAutoFocus;
    }
    set shouldPreferSmoothAutoFocus(newShouldPreferSmoothAutoFocus) {
        this.focus.shouldPreferSmoothAutoFocus = newShouldPreferSmoothAutoFocus;
    }
    static fromJSON(json) {
        const settings = new CameraSettings();
        settings.preferredResolution = json.preferredResolution;
        settings.zoomFactor = json.zoomFactor;
        settings.focusRange = json.focusRange;
        settings.zoomGestureZoomFactor = json.zoomGestureZoomFactor;
        settings.focusGestureStrategy = json.focusGestureStrategy;
        settings.shouldPreferSmoothAutoFocus = json.shouldPreferSmoothAutoFocus;
        if (json.properties != undefined) {
            for (const key of Object.keys(json.properties)) {
                settings.setProperty(key, json.properties[key]);
            }
        }
        return settings;
    }
    constructor(settings) {
        super();
        this.focusHiddenProperties = [
            'range',
            'manualLensPosition',
            'shouldPreferSmoothAutoFocus',
            'focusStrategy',
            'focusGestureStrategy'
        ];
        this.preferredResolution = Capacitor$1.defaults.Camera.Settings.preferredResolution;
        this.zoomFactor = Capacitor$1.defaults.Camera.Settings.zoomFactor;
        this.zoomGestureZoomFactor = Capacitor$1.defaults.Camera.Settings.zoomGestureZoomFactor;
        this.api = 0;
        this.focus = {
            range: Capacitor$1.defaults.Camera.Settings.focusRange,
            focusGestureStrategy: Capacitor$1.defaults.Camera.Settings.focusGestureStrategy,
            shouldPreferSmoothAutoFocus: Capacitor$1.defaults.Camera.Settings.shouldPreferSmoothAutoFocus,
        };
        if (settings !== undefined && settings !== null) {
            Object.getOwnPropertyNames(settings).forEach(propertyName => {
                this[propertyName] = settings[propertyName];
            });
        }
    }
    setProperty(name, value) {
        if (this.focusHiddenProperties.includes(name)) {
            this.focus[name] = value;
            return;
        }
        this[name] = value;
    }
    getProperty(name) {
        if (this.focusHiddenProperties.includes(name)) {
            return this.focus[name];
        }
        return this[name];
    }
}
__decorate$6([
    ignoreFromSerialization
], CameraSettings.prototype, "focusHiddenProperties", void 0);
class ImageBuffer {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get data() {
        return this._data;
    }
}
class PrivateFrameData {
    get imageBuffers() {
        return this._imageBuffers;
    }
    get orientation() {
        return this._orientation;
    }
    static fromJSON(json) {
        const frameData = new PrivateFrameData();
        frameData._imageBuffers = json.imageBuffers.map((imageBufferJSON) => {
            const imageBuffer = new ImageBuffer();
            imageBuffer._width = imageBufferJSON.width;
            imageBuffer._height = imageBufferJSON.height;
            imageBuffer._data = imageBufferJSON.data;
            return imageBuffer;
        });
        frameData._orientation = json.orientation;
        return frameData;
    }
}

const defaultsFromJSON = (json) => {
    return {
        TextCapture: {
            TextCaptureOverlay: {
                DefaultBrush: {
                    fillColor: Color
                        .fromJSON(json.TextCapture.TextCaptureOverlay.DefaultBrush.fillColor),
                    strokeColor: Color
                        .fromJSON(json.TextCapture.TextCaptureOverlay.DefaultBrush.strokeColor),
                    strokeWidth: json.TextCapture.TextCaptureOverlay.DefaultBrush.strokeWidth,
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

class CapturedText {
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

class CameraProxy {
    static forCamera(camera) {
        const proxy = new CameraProxy();
        proxy.camera = camera;
        return proxy;
    }
    static getLastFrame() {
        return new Promise(resolve => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.GetLastFrame]().then((result) => {
            resolve(PrivateFrameData.fromJSON(JSON.parse(result.data)));
        }));
    }
    static getLastFrameOrNull() {
        return new Promise(resolve => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.GetLastFrameOrNull]()
            .then((frameDataJSONString) => {
            if (!frameDataJSONString) {
                return resolve(null);
            }
            resolve(PrivateFrameData.fromJSON(JSON.parse(frameDataJSONString.data)));
        }));
    }
    getCurrentState() {
        return new Promise((resolve, reject) => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.GetCurrentCameraState]()
            .then((result) => {
            resolve(result.data);
        }, reject));
    }
    getIsTorchAvailable() {
        return new Promise((resolve, reject) => window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.GetIsTorchAvailable]({
            position: this.camera.position,
        }).then((result) => { resolve(result.data); }, reject));
    }
}

class FeedbackProxy {
    static forFeedback(feedback) {
        const proxy = new FeedbackProxy();
        proxy.feedback = feedback;
        return proxy;
    }
    emit() {
        window.Capacitor.Plugins[Capacitor$1.pluginName][CapacitorFunction$1.EmitFeedback]({ feedback: this.feedback.toJSON() });
    }
}

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var VibrationType;
(function (VibrationType) {
    VibrationType["default"] = "default";
    VibrationType["selectionHaptic"] = "selectionHaptic";
    VibrationType["successHaptic"] = "successHaptic";
})(VibrationType || (VibrationType = {}));
class Vibration extends DefaultSerializeable {
    static fromJSON(json) {
        return new Vibration(json.type);
    }
    static get defaultVibration() {
        return new Vibration(VibrationType.default);
    }
    static get selectionHapticFeedback() {
        return new Vibration(VibrationType.selectionHaptic);
    }
    static get successHapticFeedback() {
        return new Vibration(VibrationType.successHaptic);
    }
    constructor(type) {
        super();
        this.type = type;
    }
}
class Sound extends DefaultSerializeable {
    static fromJSON(json) {
        return new Sound(json.resource);
    }
    static get defaultSound() {
        return new Sound(null);
    }
    constructor(resource) {
        super();
        this.resource = null;
        this.resource = resource;
    }
}
__decorate$5([
    ignoreFromSerializationIfNull
], Sound.prototype, "resource", void 0);
class Feedback extends DefaultSerializeable {
    static get defaultFeedback() {
        return new Feedback(Vibration.defaultVibration, Sound.defaultSound);
    }
    static fromJSON(json) {
        return new Feedback(json.vibration ? Vibration.fromJSON(json.vibration) : null, json.sound ? Sound.fromJSON(json.sound) : null);
    }
    get vibration() {
        return this._vibration;
    }
    get sound() {
        return this._sound;
    }
    constructor(vibration, sound) {
        super();
        this._vibration = null;
        this._sound = null;
        this._vibration = vibration;
        this._sound = sound;
        this.initialize();
    }
    emit() {
        if (!this.proxy) {
            return;
        }
        this.proxy.emit();
    }
    initialize() {
        if (this.proxy) {
            return;
        }
        this.proxy = FeedbackProxy.forFeedback(this);
    }
}
__decorate$5([
    ignoreFromSerializationIfNull,
    nameForSerialization('vibration')
], Feedback.prototype, "_vibration", void 0);
__decorate$5([
    ignoreFromSerializationIfNull,
    nameForSerialization('sound')
], Feedback.prototype, "_sound", void 0);
__decorate$5([
    ignoreFromSerialization
], Feedback.prototype, "proxy", void 0);

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class Brush extends DefaultSerializeable {
    static get transparent() {
        const transparentBlack = Color.fromRGBA(255, 255, 255, 0);
        return new Brush(transparentBlack, transparentBlack, 0);
    }
    get fillColor() {
        return this.fill.color;
    }
    get strokeColor() {
        return this.stroke.color;
    }
    get strokeWidth() {
        return this.stroke.width;
    }
    constructor(fillColor = Capacitor$1.defaults.Brush.fillColor, strokeColor = Capacitor$1.defaults.Brush.strokeColor, strokeWidth = Capacitor$1.defaults.Brush.strokeWidth) {
        super();
        this.fill = { color: fillColor };
        this.stroke = { color: strokeColor, width: strokeWidth };
    }
}
// tslint:disable-next-line:variable-name
const NoViewfinder = { type: 'none' };
class LaserlineViewfinder extends DefaultSerializeable {
    constructor(style) {
        super();
        this.type = 'laserline';
        const viewfinderStyle = style || Capacitor$1.defaults.LaserlineViewfinder.defaultStyle;
        this._style = Capacitor$1.defaults.LaserlineViewfinder.styles[viewfinderStyle].style;
        this.width = Capacitor$1.defaults.LaserlineViewfinder.styles[viewfinderStyle].width;
        this.enabledColor = Capacitor$1.defaults.LaserlineViewfinder.styles[viewfinderStyle].enabledColor;
        this.disabledColor = Capacitor$1.defaults.LaserlineViewfinder.styles[viewfinderStyle].disabledColor;
    }
    get style() {
        return this._style;
    }
}
__decorate$4([
    nameForSerialization('style')
], LaserlineViewfinder.prototype, "_style", void 0);
class RectangularViewfinder extends DefaultSerializeable {
    get sizeWithUnitAndAspect() {
        return this._sizeWithUnitAndAspect;
    }
    constructor(style, lineStyle) {
        super();
        this.type = 'rectangular';
        const viewfinderStyle = style || Capacitor$1.defaults.RectangularViewfinder.defaultStyle;
        this._style = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].style;
        this._lineStyle = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].lineStyle;
        this._dimming = parseFloat(Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].dimming);
        this._disabledDimming =
            parseFloat(Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].disabledDimming);
        this._animation = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].animation;
        this.color = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].color;
        this._sizeWithUnitAndAspect = Capacitor$1.defaults.RectangularViewfinder.styles[viewfinderStyle].size;
        if (lineStyle !== undefined) {
            this._lineStyle = lineStyle;
        }
    }
    get style() {
        return this._style;
    }
    get lineStyle() {
        return this._lineStyle;
    }
    get dimming() {
        return this._dimming;
    }
    set dimming(value) {
        this._dimming = value;
    }
    get disabledDimming() {
        return this._disabledDimming;
    }
    set disabledDimming(value) {
        this._disabledDimming = value;
    }
    get animation() {
        return this._animation;
    }
    set animation(animation) {
        this._animation = animation;
    }
    setSize(size) {
        this._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithWidthAndHeight(size);
    }
    setWidthAndAspectRatio(width, heightToWidthAspectRatio) {
        this._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithWidthAndAspectRatio(width, heightToWidthAspectRatio);
    }
    setHeightAndAspectRatio(height, widthToHeightAspectRatio) {
        this._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithHeightAndAspectRatio(height, widthToHeightAspectRatio);
    }
    setShorterDimensionAndAspectRatio(fraction, aspectRatio) {
        this._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithShorterDimensionAndAspectRatio(new NumberWithUnit(fraction, MeasureUnit.Fraction), aspectRatio);
    }
}
__decorate$4([
    nameForSerialization('style')
], RectangularViewfinder.prototype, "_style", void 0);
__decorate$4([
    nameForSerialization('lineStyle')
], RectangularViewfinder.prototype, "_lineStyle", void 0);
__decorate$4([
    nameForSerialization('dimming')
], RectangularViewfinder.prototype, "_dimming", void 0);
__decorate$4([
    nameForSerialization('disabledDimming')
], RectangularViewfinder.prototype, "_disabledDimming", void 0);
__decorate$4([
    nameForSerialization('animation'),
    ignoreFromSerialization
], RectangularViewfinder.prototype, "_animation", void 0);
__decorate$4([
    nameForSerialization('size')
], RectangularViewfinder.prototype, "_sizeWithUnitAndAspect", void 0);

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class TextCaptureSession {
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
class TextCaptureFeedback extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.success = Feedback.defaultFeedback;
    }
    static get default() {
        return new TextCaptureFeedback();
    }
}
class TextCaptureOverlay extends DefaultSerializeable {
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
__decorate$3([
    ignoreFromSerialization
], TextCaptureOverlay.prototype, "textCapture", void 0);
__decorate$3([
    nameForSerialization('shouldShowScanAreaGuides')
], TextCaptureOverlay.prototype, "_shouldShowScanAreaGuides", void 0);
__decorate$3([
    serializationDefault(NoViewfinder),
    nameForSerialization('viewfinder')
], TextCaptureOverlay.prototype, "_viewfinder", void 0);
__decorate$3([
    nameForSerialization('brush')
], TextCaptureOverlay.prototype, "_brush", void 0);

var TextCaptureListenerEvent;
(function (TextCaptureListenerEvent) {
    TextCaptureListenerEvent["DidCapture"] = "didCaptureInTextCapture";
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
                    finishCallbackID: event.name,
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
                            .fromJSON(JSON.parse(event.argument.session)), CameraProxy.getLastFrame);
                    }
                    break;
            }
        });
        return done();
    }
}
TextCaptureListenerProxy.capacitorExec = Capacitor.exec;

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class TextCapture extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'textCapture';
        this._isEnabled = true;
        this._feedback = TextCaptureFeedback.default;
        this._context = null;
        this.listeners = [];
        this.listenerProxy = null;
        this.isInListenerCallback = false;
    }
    get isEnabled() {
        return this._isEnabled;
    }
    set isEnabled(isEnabled) {
        this._isEnabled = isEnabled;
        if (!this.isInListenerCallback) {
            // If we're "in" a listener callback, we don't want to deserialize the context to update the enabled state,
            // but rather pass that back to be applied in the native callback.
            this.didChange();
        }
    }
    get context() {
        return this._context;
    }
    static get recommendedCameraSettings() {
        return new CameraSettings(Capacitor.defaults.TextCapture.RecommendedCameraSettings);
    }
    get feedback() {
        return this._feedback;
    }
    set feedback(feedback) {
        this._feedback = feedback;
        this.didChange();
    }
    static forContext(context, settings) {
        const textCapture = new TextCapture();
        textCapture.settings = settings;
        if (context) {
            context.addMode(textCapture);
        }
        textCapture.listenerProxy = TextCaptureListenerProxy.forTextCapture(textCapture);
        return textCapture;
    }
    applySettings(settings) {
        this.settings = settings;
        return this.didChange();
    }
    addListener(listener) {
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    }
    removeListener(listener) {
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
    didChange() {
        if (this.context) {
            return this.context.update();
        }
        else {
            return Promise.resolve();
        }
    }
}
__decorate$2([
    nameForSerialization('enabled')
], TextCapture.prototype, "_isEnabled", void 0);
__decorate$2([
    nameForSerialization('feedback')
], TextCapture.prototype, "_feedback", void 0);
__decorate$2([
    ignoreFromSerialization
], TextCapture.prototype, "_context", void 0);
__decorate$2([
    ignoreFromSerialization
], TextCapture.prototype, "listeners", void 0);
__decorate$2([
    ignoreFromSerialization
], TextCapture.prototype, "listenerProxy", void 0);
__decorate$2([
    ignoreFromSerialization
], TextCapture.prototype, "isInListenerCallback", void 0);

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// tslint:disable-next-line:variable-name
const NoneLocationSelection = { type: 'none' };
class RadiusLocationSelection extends DefaultSerializeable {
    get radius() {
        return this._radius;
    }
    constructor(radius) {
        super();
        this.type = 'radius';
        this._radius = radius;
    }
}
__decorate$1([
    nameForSerialization('radius')
], RadiusLocationSelection.prototype, "_radius", void 0);
class RectangularLocationSelection extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'rectangular';
    }
    get sizeWithUnitAndAspect() {
        return this._sizeWithUnitAndAspect;
    }
    static withSize(size) {
        const locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithWidthAndHeight(size);
        return locationSelection;
    }
    static withWidthAndAspectRatio(width, heightToWidthAspectRatio) {
        const locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect
            .sizeWithWidthAndAspectRatio(width, heightToWidthAspectRatio);
        return locationSelection;
    }
    static withHeightAndAspectRatio(height, widthToHeightAspectRatio) {
        const locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect
            .sizeWithHeightAndAspectRatio(height, widthToHeightAspectRatio);
        return locationSelection;
    }
}
__decorate$1([
    nameForSerialization('size')
], RectangularLocationSelection.prototype, "_sizeWithUnitAndAspect", void 0);

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class TextCaptureSettings extends DefaultSerializeable {
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
        Capacitor$1.defaults = coreDefaults;
        const textDefaults = await getDefaults();
        Capacitor.defaults = textDefaults;
        return api;
    }
}
core.registerPlugin('ScanditTextPlugin', {
    android: () => new ScanditTextPluginImplementation(),
    ios: () => new ScanditTextPluginImplementation(),
    web: () => new ScanditTextPluginImplementation(),
});
// tslint:disable-next-line:variable-name
const ScanditTextPlugin = new ScanditTextPluginImplementation();

exports.ScanditTextPlugin = ScanditTextPlugin;
exports.ScanditTextPluginImplementation = ScanditTextPluginImplementation;
//# sourceMappingURL=plugin.cjs.js.map
