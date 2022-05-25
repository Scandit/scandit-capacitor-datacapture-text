import Foundation
import Capacitor
import ScanditCaptureCore
import ScanditCapacitorDatacaptureCore
import ScanditTextCapture

class TextCaptureCallbacks {
    var textCaptureListener: Callback?

    func reset() {
        textCaptureListener = nil
    }
}

struct TextCaptureCallbackResult: BlockingListenerCallbackResult {
    struct ResultJSON: Decodable {
        let enabled: Bool?
    }

    let finishCallbackID: ListenerEvent.Name
    let result: ResultJSON?

    var enabled: Bool? {
        guard let result = result else {
            return nil
        }

        return result.enabled
    }
}

@objc(ScanditTextNative)
public class ScanditTextNative: CAPPlugin, DataCapturePlugin {

    lazy public var modeDeserializers: [DataCaptureModeDeserializer] = {
        let textCaptureDeserializer = TextCaptureDeserializer()
        textCaptureDeserializer.delegate = self
        return [textCaptureDeserializer]
    }()

    lazy public var componentDeserializers: [DataCaptureComponentDeserializer] = []
    lazy public var components: [DataCaptureComponent] = []

    lazy var callbacks = TextCaptureCallbacks()
    lazy var callbackLocks = CallbackLocks()

    override public func load() {
        ScanditCaptureCore.dataCapturePlugins.append(self as DataCapturePlugin)
    }

    // MARK: Listeners

    @objc(subscribeTextCaptureListener:)
    func subscribeTextCaptureListener(_ call: CAPPluginCall) {
        callbacks.textCaptureListener = Callback(id: call.callbackId)
        call.resolve()
    }

    // MARK: Defaults

    @objc(getDefaults:)
    func getDefaults(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let settings = try? TextCaptureSettings(jsonString: "{}") else {
                fatalError("Could not create default text capture settings, so defaults can not be created")
            }

            let textCapture = TextCapture(context: nil, settings: settings)
            let overlay = TextCaptureOverlay(textCapture: textCapture)

            let defaults = ScanditTextCaptureDefaults(textCaptureSettings: settings, overlay: overlay)

            var defaultsDictionary: [String: Any]? {
                    guard let data = try? JSONEncoder().encode(defaults) else {
                        return nil
                    }
                    guard let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] else
                    {
                        return nil
                    }
                    return json
                }

            call.resolve(defaultsDictionary ?? [:])
        }
    }

    @objc(finishCallback:)
    func finishCallback(_ call: CAPPluginCall) {
        guard let resultObject = call.getObject("result") else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }

        guard let finishCallbackId = resultObject["finishCallbackID"] else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
  
        guard let result = TextCaptureCallbackResult.from(([
            "finishCallbackID": finishCallbackId,
            "result": resultObject] as NSDictionary).jsonString) else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        callbackLocks.setResult(result, for: result.finishCallbackID)
        callbackLocks.release(for: result.finishCallbackID)
        call.resolve()
    }

    func waitForFinished(_ listenerEvent: ListenerEvent, callbackId: String) {
        callbackLocks.wait(for: listenerEvent.name, afterDoing: {
            self.notifyListeners(listenerEvent.name.rawValue, data: listenerEvent.resultMessage as? [String: Any])
        })
    }

    func finishBlockingCallback(with mode: DataCaptureMode, for listenerEvent: ListenerEvent) {
        defer {
            callbackLocks.clearResult(for: listenerEvent.name)
        }

        guard let result = callbackLocks.getResult(for: listenerEvent.name) as? TextCaptureCallbackResult,
            let enabled = result.enabled else {
            return
        }

        if enabled != mode.isEnabled {
            mode.isEnabled = enabled
        }
    }
}
