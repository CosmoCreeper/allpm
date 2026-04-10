# allpm

Execute scripts with bun, pnpm, yarn, or npm.

```sh
bun install -d allpm
# or
pnpm install -D allpm
# or
yarn add -D allpm
# or
npm i --save-dev allpm
```

The client is determined by a series of ordered checks:

1. `bun.lock` file is in the nearest package directory - **bun**
1. `pnpm-lock.yaml` file is in the nearest package directory - **pnpm**
1. `yarn.lock` file is in the nearest package directory - **yarn**
1. `package-lock.json` file is in the nearest package directory - **npm**
1. `bun` is installed - **bun**
1. `pnpm` is installed - **pnpm**
1. `yarn` is installed - **yarn**
1. Fallback - **npm**

## Module

```js
import getPkgManager, { spawn, hasBun, hasPnpm, hasYarn, hasNpm } from "allpm";

// String of `bun`, `pnpm`, `yarn`, or `npm` returned
console.log(getPkgManager());

// Boolean values for hasBun, hasPnpm, hasYarn, hasNpm
console.log(hasBun());

// Spawn allpm command
spawn(["init"]);

// Spawn sync option
spawn.sync(["init"], { stdio: "inherit" });
```

Under the covers, there are cached lookup values being used for efficiency. These can be manually cleared:

```js
import allpm from "allpm";
import { spawnSync } from "child_process";

console.log(allpm.hasBun()); // false

spawnSync("npm", ["i", "-g", "yarn"], { stdio: "inherit" });

console.log(allpm.hasBun()); // false (cached)

allpm.clearCache();
console.log(allpm.hasBun()); // true
```

## CLI

```sh
allpm <command>
```

## Package

Modules with bin files can be called directly in `package.json` scripts:

```json
{
  "devDependencies": {
    ...
    "allpm": "^1.0.0"
  },
  "scripts": {
    "compile": "babel src --out-dir dist",
    "lint": "eslint .",
    "prepublish": "allpm run lint && allpm run compile"
  }
}
```
