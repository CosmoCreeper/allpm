import type { ChildProcess, SpawnSyncReturns } from "child_process";
export declare const clearCache: () => void;
declare function getPkgManager(): string;
type SpawnFn = {
    (...args: string[]): ChildProcess;
    sync: (...args: string[]) => SpawnSyncReturns<Buffer>;
};
export declare const spawn: SpawnFn;
type AllPm = typeof getPkgManager & {
    hasBun: () => boolean;
    hasDeno: () => boolean;
    hasPnpm: () => boolean;
    hasYarn: () => boolean;
    hasNpm: () => boolean;
    spawn: SpawnFn;
    clearCache: () => void;
};
declare const allpm: AllPm;
export declare const hasBun: () => boolean;
export declare const hasDeno: () => boolean;
export declare const hasPnpm: () => boolean;
export declare const hasYarn: () => boolean;
export declare const hasNpm: () => boolean;
export default allpm;
