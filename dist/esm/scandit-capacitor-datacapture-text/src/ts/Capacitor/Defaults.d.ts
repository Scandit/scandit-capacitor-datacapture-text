import { CameraSettings } from '../../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { Color, Direction } from '../../../../scandit-capacitor-datacapture-core/src/ts/Common';
import { CameraSettingsDefaultsJSON } from '../../../../scandit-capacitor-datacapture-core/src/ts/Capacitor/Defaults';
export interface Defaults {
    TextCapture: {
        TextCaptureOverlay: {
            DefaultBrush: {
                fillColor: Color;
                strokeColor: Color;
                strokeWidth: number;
            };
        };
        TextCaptureSettings: {
            recognitionDirection: Direction;
            duplicateFilter: number;
        };
        RecommendedCameraSettings: CameraSettings;
    };
}
export interface DefaultsJSON {
    TextCapture: {
        TextCaptureOverlay: {
            DefaultBrush: {
                fillColor: string;
                strokeColor: string;
                strokeWidth: number;
            };
        };
        TextCaptureSettings: {
            recognitionDirection: string;
            duplicateFilter: number;
        };
        RecommendedCameraSettings: CameraSettingsDefaultsJSON;
    };
}
export declare const defaultsFromJSON: (json: DefaultsJSON) => Defaults;
