/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import Foundation
import Capacitor
import ScanditCapacitorDatacaptureCore
import ScanditFrameworksCore
import ScanditFrameworksText

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
public class ScanditTextNative: CAPPlugin {
    var textModule: TextCaptureModule!

    override public func load() {
        textModule = TextCaptureModule(
            textCaptureListener: FrameworksTextCaptureListener(
                emitter: CapacitorEventEmitter(with: self)
            )
        )
        textModule.didStart()
    }

    func onReset() {
        textModule.didStop()
    }

    // MARK: Listeners

    @objc(subscribeTextCaptureListener:)
    func subscribeTextCaptureListener(_ call: CAPPluginCall) {
        textModule.addListener()
        call.resolve()
    }

    // MARK: Defaults

    @objc(getDefaults:)
    func getDefaults(_ call: CAPPluginCall) {
        dispatchMain { [weak self] in
            guard let self = self else { return }
            call.resolve(["TextCapture": self.textModule.defaults.toEncodable()])
        }
    }

    @objc(finishCallback:)
    func finishCallback(_ call: CAPPluginCall) {
        guard let resultObject = call.getObject("result") else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        
        guard let enabled = resultObject["enabled"] as? Bool else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }

        textModule.finishDidCaptureText(enabled: enabled)
        call.resolve()
    }

        
    @objc(setModeEnabledState:)
    func setModeEnabledState(_ call: CAPPluginCall) {
        textModule.setModeEnabled(enabled: call.getBool("enabled", false))
        call.resolve()
    }
    
    @objc(updateTextCaptureOverlay:)
    func updateTextCaptureOverlay(_ call: CAPPluginCall) {
        guard let overlayJson = call.getString("overlayJson") else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        textModule.updateOverlay(overlayJson: overlayJson, result: CapacitorResult(call))
    }
    
    @objc(updateTextCaptureMode:)
    func updateTextCaptureMode(_ call: CAPPluginCall) {
        guard let modeJson = call.getString("modeJson") else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        textModule.updateModeFromJson(modeJson: modeJson, result: CapacitorResult(call))
    }
    
    @objc(applyTextCaptureModeSettings:)
    func applyTextCaptureModeSettings(_ call: CAPPluginCall) {
        guard let modeSettingsJson = call.getString("modeSettingsJson") else {
            call.reject(CommandError.invalidJSON.toJSONString())
            return
        }
        textModule.applyModeSettings(modeSettingsJson: modeSettingsJson, result: CapacitorResult(call))
    }
}
