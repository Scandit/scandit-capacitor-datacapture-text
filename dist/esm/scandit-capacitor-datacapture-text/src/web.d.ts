import { WebPlugin } from '@capacitor/core';
import type { ScanditTextPluginInterface } from './definitions';
export declare class ScanditTextPlugin extends WebPlugin implements ScanditTextPluginInterface {
    constructor();
    initialize(): Promise<any>;
}
declare const scanditText: ScanditTextPlugin;
export { scanditText };
