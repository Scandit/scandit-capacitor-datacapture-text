import { WebPlugin } from '@capacitor/core';
import { getDefaults } from './ts/Capacitor/Capacitor';
import { TextCapture, } from './ts/TextCapture';
import { TextCaptureSettings, } from './ts/TextCaptureSettings';
import { TextCaptureFeedback, TextCaptureOverlay, TextCaptureSession, } from './ts/TextCapture+Related';
import { CapturedText, } from './ts/CapturedText';
export class ScanditTextPlugin extends WebPlugin {
    constructor() {
        super({
            name: 'ScanditTextPlugin',
            platforms: ['android', 'ios'],
        });
    }
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
const scanditText = new ScanditTextPlugin();
export { scanditText };
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(scanditText);
//# sourceMappingURL=web.js.map