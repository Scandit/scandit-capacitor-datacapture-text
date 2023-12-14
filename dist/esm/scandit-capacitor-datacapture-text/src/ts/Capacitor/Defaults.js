import { CameraSettings } from '../../../../scandit-capacitor-datacapture-core/src/ts/Camera+Related';
import { Color } from '../../../../scandit-capacitor-datacapture-core/src/ts/Common';
export const defaultsFromJSON = (json) => {
    return {
        TextCapture: {
            TextCaptureOverlay: {
                DefaultBrush: {
                    fillColor: Color
                        .fromJSON(json.TextCapture.TextCaptureOverlay.DefaultBrush.fillColor),
                    strokeColor: Color
                        .fromJSON(json.TextCapture.TextCaptureOverlay.DefaultBrush.strokeColor),
                    strokeWidth: json.TextCapture.TextCaptureOverlay.DefaultBrush.strokeWidth,
                },
            },
            TextCaptureSettings: {
                recognitionDirection: json.TextCapture.TextCaptureSettings.recognitionDirection,
                duplicateFilter: json.TextCapture.TextCaptureSettings.duplicateFilter,
            },
            RecommendedCameraSettings: CameraSettings
                .fromJSON(json.TextCapture.RecommendedCameraSettings),
        },
    };
};
//# sourceMappingURL=Defaults.js.map