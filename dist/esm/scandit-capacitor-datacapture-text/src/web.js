import { registerPlugin } from '@capacitor/core';
import { Capacitor as CapacitorCore } from '../../scandit-capacitor-datacapture-core/src/ts/Capacitor/Capacitor';
import { getDefaults, Capacitor as CapacitorText } from './ts/Capacitor/Capacitor';
import { CapturedText, } from './ts/CapturedText';
import { TextCapture, } from './ts/TextCapture';
import { TextCaptureFeedback, TextCaptureOverlay, TextCaptureSession, } from './ts/TextCapture+Related';
import { TextCaptureSettings, } from './ts/TextCaptureSettings';
export * from './definitions';
export class ScanditTextPluginImplementation {
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
        CapacitorText.defaults = textDefaults;
        return api;
    }
}
registerPlugin('ScanditTextPlugin', {
    android: () => new ScanditTextPluginImplementation(),
    ios: () => new ScanditTextPluginImplementation(),
    web: () => new ScanditTextPluginImplementation(),
});
// tslint:disable-next-line:variable-name
export const ScanditTextPlugin = new ScanditTextPluginImplementation();
//# sourceMappingURL=web.js.map