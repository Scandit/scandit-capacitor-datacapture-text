import { TextCaptureSession } from '../TextCapture+Related';
import { Plugins } from '@capacitor/core';
import { Capacitor, CapacitorFunction } from './Capacitor';
var TextCaptureListenerEvent;
(function (TextCaptureListenerEvent) {
    TextCaptureListenerEvent["DidCapture"] = "didCaptureInTextCapture";
})(TextCaptureListenerEvent || (TextCaptureListenerEvent = {}));
export class TextCaptureListenerProxy {
    static forTextCapture(textCapture) {
        const proxy = new TextCaptureListenerProxy();
        proxy.textCapture = textCapture;
        proxy.initialize();
        return proxy;
    }
    initialize() {
        this.subscribeListener();
    }
    subscribeListener() {
        TextCaptureListenerProxy.capacitorExec(this.notifyListeners.bind(this), null, CapacitorFunction.SubscribeTextCaptureListener, null);
        Plugins[Capacitor.pluginName]
            .addListener(TextCaptureListenerEvent.DidCapture, this.notifyListeners.bind(this));
    }
    notifyListeners(event) {
        const done = () => {
            this.textCapture.isInListenerCallback = false;
            Plugins[Capacitor.pluginName].finishCallback({
                result: {
                    enabled: this.textCapture.isEnabled,
                    finishCallbackID: event.name,
                },
            });
            return { enabled: this.textCapture.isEnabled };
        };
        this.textCapture.isInListenerCallback = true;
        if (!event) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return done();
        }
        this.textCapture.listeners.forEach((listener) => {
            switch (event.name) {
                case TextCaptureListenerEvent.DidCapture:
                    if (listener.didCaptureText) {
                        listener.didCaptureText(this.textCapture, TextCaptureSession
                            .fromJSON(JSON.parse(event.argument.session)));
                    }
                    break;
            }
        });
        return done();
    }
}
TextCaptureListenerProxy.capacitorExec = Capacitor.exec;
//# sourceMappingURL=TextCaptureListenerProxy.js.map