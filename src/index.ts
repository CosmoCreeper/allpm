import fs from "node:fs";
import path from "node:path";
import crossSpawn from "cross-spawn";
import { packageDirectorySync } from "package-directory";
import type { ChildProcess, SpawnSyncReturns } from "node:child_process";

const cache = new Map<string, boolean>();
let cachedClient: string | undefined;

/** Clears allpm cache for detecting pkg manager installations */
export const clearCache = (): void => {
  cache.clear();
  cachedClient = undefined;
};

function hasManager(name: string): boolean {
  if (cache.has(name)) return cache.get(name)!;
  let managerExists = false;
  try {
    managerExists = !!crossSpawn.sync(name, ["--version"]).stdout?.toString().trim();
    cache.set(name, managerExists);
  } catch {
    cache.set(name, false);
  }
  return managerExists;
}

function getPkgManager(): string {
  if (cachedClient !== undefined) return cachedClient;

  const pkgRoot = packageDirectorySync();
  if (pkgRoot) {
    const pkgManagers = [
      ["bun", "bun.lock"],
      ["deno", "deno.lock"],
      ["pnpm", "pnpm-lock.yaml"],
      ["yarn", "yarn.lock"],
      ["npm", "package-lock.json"],
    ];

    const detected = pkgManagers.find(([, lockFile]) =>
      fs.existsSync(path.join(pkgRoot, lockFile))
    );
    if (detected) return (cachedClient = detected[0]);
  }

  return (cachedClient = ["bun", "deno", "pnpm", "yarn"].find(hasManager) ?? "npm");
}

/** Spawn API */
export type SpawnFn = {
  /** Spawns a process asynchronously */
  (...args: string[]): ChildProcess;
  /** Spawns a process synchronously */
  sync: (...args: string[]) => SpawnSyncReturns<Buffer>;
};

/** Allows spawning processes with the appropriate pkg manager */
export const spawn: SpawnFn = Object.assign(
  (...args: string[]): ChildProcess => crossSpawn(getPkgManager(), args),
  {
    sync: (...args: string[]): SpawnSyncReturns<Buffer> => crossSpawn.sync(getPkgManager(), args),
  }
);

/** Default typing for the allpm default exports */
export type AllPm = {
  /** Returns the detected package manager name */
  (): string;

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

/** Default exports */
const allpm = Object.assign(getPkgManager, {
  hasBun: (): boolean => hasManager("bun"),
  hasDeno: (): boolean => hasManager("deno"),
  hasPnpm: (): boolean => hasManager("pnpm"),
  hasYarn: (): boolean => hasManager("yarn"),
  hasNpm: (): boolean => hasManager("npm"),
  spawn,
  clearCache,
}) as AllPm;

/** Returns true if bun is installed */
export const hasBun: () => boolean = allpm.hasBun;
/** Returns true if deno is installed */
export const hasDeno: () => boolean = allpm.hasDeno;
/** Returns true if pnpm is installed */
export const hasPnpm: () => boolean = allpm.hasPnpm;
/** Returns true if yarn is installed */
export const hasYarn: () => boolean = allpm.hasYarn;
/** Returns true if npm is installed */
export const hasNpm: () => boolean = allpm.hasNpm;

export default allpm;
