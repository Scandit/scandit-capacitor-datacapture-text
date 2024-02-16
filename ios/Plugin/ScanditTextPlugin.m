/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(ScanditTextNative, "ScanditTextNative",
           CAP_PLUGIN_METHOD(getDefaults, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(subscribeTextCaptureListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(finishCallback, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setModeEnabledState, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateTextCaptureOverlay, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateTextCaptureMode, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(applyTextCaptureModeSettings, CAPPluginReturnPromise);)
