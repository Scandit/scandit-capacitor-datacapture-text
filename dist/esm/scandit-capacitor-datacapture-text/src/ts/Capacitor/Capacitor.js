import { capacitorExec } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/CommonCapacitor';
import { defaultsFromJSON, } from './Defaults';
const pluginName = 'ScanditTextNative';
// tslint:disable-next-line:variable-name
export const Capacitor = {
    pluginName,
    defaults: {},
    exec: (success, error, functionName, args) => capacitorExec(success, error, pluginName, functionName, args),
};
export var CapacitorFunction;
(function (CapacitorFunction) {
    CapacitorFunction["GetDefaults"] = "getDefaults";
    CapacitorFunction["SubscribeTextCaptureListener"] = "subscribeTextCaptureListener";
})(CapacitorFunction || (CapacitorFunction = {}));
export const getDefaults = async () => {
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
//# sourceMappingURL=Capacitor.js.map