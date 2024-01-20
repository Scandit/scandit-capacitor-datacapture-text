export type Optional<T> = T | null;
export interface ScanditTextPluginInterface {
    initialize(coreDefaults: any): Promise<any>;
}
