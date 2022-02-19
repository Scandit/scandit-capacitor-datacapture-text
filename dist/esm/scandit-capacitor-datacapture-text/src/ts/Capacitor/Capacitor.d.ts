import { Defaults } from './Defaults';
export declare const Capacitor: {
    pluginName: string;
    defaults: Defaults;
    exec: (success: Function | null, error: Function | null, functionName: string, args: [any] | null) => void;
};
export declare enum CapacitorFunction {
    GetDefaults = "getDefaults",
    SubscribeTextCaptureListener = "subscribeTextCaptureListener"
}
export declare const getDefaults: Promise<Defaults>;
