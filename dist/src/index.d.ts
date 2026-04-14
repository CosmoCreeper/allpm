import type { ChildProcess, SpawnSyncReturns } from "child_process";
/** Clears allpm cache for detecting pkg manager installations */
export declare const clearCache: () => void;
declare function getPkgManager(): string;
type SpawnFn = {
    /** Spawns a process asynchronously */
    (...args: string[]): ChildProcess;
    /** Spawns a process synchronously */
    sync: (...args: string[]) => SpawnSyncReturns<Buffer>;
};
/** Allows spawning processes with the appropriate pkg manager */
export declare const spawn: SpawnFn;
type AllPm = typeof getPkgManager & {
    /** Return true if the user has bun */
    hasBun: () => boolean;
    /** Return true if the user has deno */
    hasDeno: () => boolean;
    /** Return true if the user has pnpm */
    hasPnpm: () => boolean;
    /** Return true if the user has yarn */
    hasYarn: () => boolean;
    /** Return true if the user has npm */
    hasNpm: () => boolean;
    /** Process spawning API */
    spawn: SpawnFn;
    /** Clears allpm cache */
    clearCache: () => void;
};
declare const allpm: AllPm;
export declare const hasBun: () => boolean;
export declare const hasDeno: () => boolean;
export declare const hasPnpm: () => boolean;
export declare const hasYarn: () => boolean;
export declare const hasNpm: () => boolean;
export default allpm;
