import { registerPlugin } from '@capacitor/core';
import { getDefaults } from './ts/Capacitor/Capacitor';
import { TextCapture, } from './ts/TextCapture';
import { TextCaptureSettings, } from './ts/TextCaptureSettings';
import { TextCaptureFeedback, TextCaptureOverlay, TextCaptureSession, } from './ts/TextCapture+Related';
export * from './definitions';
import { CapturedText, } from './ts/CapturedText';
export class ScanditTextPluginImplementation {
    async initialize() {
        const api = {
            TextCapture,
            TextCaptureSettings,
            TextCaptureFeedback,
            TextCaptureOverlay,
            TextCaptureSession,
            CapturedText,
        };
        return new Promise((resolve, reject) => getDefaults.then(() => {
            resolve(api);
        }, reject));
    }
}
registerPlugin('ScanditTextPlugin', {
    android: () => new ScanditTextPluginImplementation(),
    ios: () => new ScanditTextPluginImplementation(),
});
// tslint:disable-next-line:variable-name
export const ScanditTextPlugin = new ScanditTextPluginImplementation();
//# sourceMappingURL=web.js.map