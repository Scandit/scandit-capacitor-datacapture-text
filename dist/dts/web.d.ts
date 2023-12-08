import type { ScanditTextPluginInterface } from './definitions';
export * from './definitions';
export declare class ScanditTextPluginImplementation implements ScanditTextPluginInterface {
    initialize(coreDefaults: any): Promise<any>;
}
export declare const ScanditTextPlugin: ScanditTextPluginImplementation;
