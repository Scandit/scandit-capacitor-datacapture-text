import { Defaults } from './Defaults';
export declare const Capacitor: {
    pluginName: string;
    defaults: Defaults;
    exec: (success: Function | null, error: Function | null, functionName: string, args: [any] | null) => void;
};
export interface CapacitorWindow extends Window {
    Scandit: any;
    Capacitor: any;
}
export declare enum CapacitorFunction {
    GetDefaults = "getDefaults",
    SubscribeTextCaptureListener = "subscribeTextCaptureListener",
    SetModeEnabledState = "setModeEnabledState",
    UpdateTextCaptureOverlay = "updateTextCaptureOverlay",
    UpdateTextCaptureMode = "updateTextCaptureMode",
    ApplyTextCaptureModeSettings = "applyTextCaptureModeSettings"
}
export declare const getDefaults: () => Promise<Defaults>;
