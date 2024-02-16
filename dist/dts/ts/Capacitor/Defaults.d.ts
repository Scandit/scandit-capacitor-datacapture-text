import { CameraSettings } from 'scandit-datacapture-frameworks-core';
import { Color, Direction } from 'scandit-datacapture-frameworks-core';
import { CameraSettingsJSON } from 'scandit-datacapture-frameworks-core';
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
            Brush: {
                fillColor: string;
                strokeColor: string;
                strokeWidth: number;
            };
        };
        TextCaptureSettings: {
            recognitionDirection: string;
            duplicateFilter: number;
        };
        RecommendedCameraSettings: CameraSettingsJSON;
    };
}
export declare const defaultsFromJSON: (json: DefaultsJSON) => Defaults;
