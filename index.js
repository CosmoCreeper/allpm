const fs = require("fs");
const path = require("path");
const crossSpawn = require("cross-spawn");
const pkgDir = require("package-directory");

const cache = new Map();
let cachedClient;

const clearCache = () => cache.clear();

function hasManager(name) {
  if (cache.has(name)) return cache.get(name);
  try {
    cache.set(name, !!crossSpawn.sync(name, ["--version"]).stdout?.toString().trim());
  } catch {
    cache.set(name, false);
  }
  return cache.get(name);
}

function getPkgManager() {
  if (cachedClient !== undefined) return cachedClient;

  const pkgRoot = pkgDir.packageDirectorySync();
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

const spawn = (...args) => crossSpawn(getPkgManager(), ...args);
const spawnSync = (...args) => crossSpawn.sync(getPkgManager(), ...args);

Object.assign(getPkgManager, {
  hasBun: () => hasManager("bun"),
  hasDeno: () => hasManager("deno"),
  hasPnpm: () => hasManager("pnpm"),
  hasYarn: () => hasManager("yarn"),
  hasNpm: () => hasManager("npm"),
  spawn: Object.assign(spawn, { sync: spawnSync }),
  clearCache,
});
module.exports = getPkgManager;
