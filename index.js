const fs = require("fs");
const path = require("path");
const crossSpawn = require("cross-spawn");
const pkgDir = require("package-directory");

const cache = new Map();
let cachedClient;

const clearCache = () => cache.clear();

function hasManager(name) {
  if (name in cache) return cache[name];
  try {
    cache[name] = !!crossSpawn.sync(name, ["--version"]).stdout?.toString().trim();
  } catch {
    cache[name] = false;
  }
  return cache[name];
}

function getPkgManager() {
  if (cachedClient !== undefined) return cachedClient;

  const pkgRoot = pkgDir.packageDirectorySync();
  if (pkgRoot) {
    const pkgManagers = [
      ["bun", "bun.lock"],
      ["pnpm", "pnpm-lock.yaml"],
      ["yarn", "yarn.lock"],
      ["npm", "package-lock.json"],
    ];

    const detected = pkgManagers.find(([, lockFile]) =>
      fs.existsSync(path.join(pkgRoot, lockFile))
    );
    if (detected) return (cachedClient = detected[0]);
  }

  return (cachedClient = ["bun", "pnpm", "yarn"].find(hasManager) ?? "npm");
}

const spawn = (...args) => crossSpawn(getPkgManager(), ...args);
const spawnSync = (...args) => crossSpawn.sync(getPkgManager(), ...args);

Object.assign(getPkgManager, {
  hasBun: () => hasManager("bun"),
  hasPnpm: () => hasManager("pnpm"),
  hasYarn: () => hasManager("yarn"),
  hasNpm: () => hasManager("npm"),
  spawn: Object.assign(spawn, { sync: spawnSync }),
  clearCache,
});
module.exports = getPkgManager;
