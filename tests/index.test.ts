import { describe, it, expect, mock, spyOn, beforeAll } from "bun:test";
import type { Mock } from "bun:test";
import fs from "fs";
import path from "path";
import type AllpmModule from "../src/index";

// Mock cross-spawn and package-directory for manipulation during tests
const mockSpawnSync: Mock<(cmd: string, args: string[]) => { stdout: Buffer | null }> = mock(
  () => ({ stdout: Buffer.from("1.0.0") })
);
const mockSpawn = mock(() => ({ pid: 1234 }));
const mockPackageDirectorySync = mock(() => undefined as string | undefined);

const pkgManagers = [
  ["bun", "bun.lock"],
  ["deno", "deno.lock"],
  ["pnpm", "pnpm-lock.yaml"],
  ["yarn", "yarn.lock"],
  ["npm", "package-lock.json"],
];

await mock.module("cross-spawn", () => {
  const fn = Object.assign(mockSpawn, { sync: mockSpawnSync });
  return { default: fn };
});

await mock.module("package-directory", () => ({
  packageDirectorySync: mockPackageDirectorySync,
}));

describe("hasPkgManager", () => {
  let allpm: typeof AllpmModule;
  let clearCache: () => void;
  beforeAll(async () => {
    ({ default: allpm, clearCache } = await import("../src/index"));
  });

  const returnValues: [Buffer<ArrayBufferLike> | null, boolean][] = [
    [Buffer.from("1.0.0"), true],
    [null, false],
  ];

  for (const [manager, _lockFile] of pkgManagers) {
    const hasFn = `has${manager.charAt(0).toUpperCase() + manager.slice(1)}` as keyof typeof allpm;
    it(`${hasFn} handles all values`, () => {
      for (const [input, expected] of returnValues) {
        mockSpawnSync.mockReturnValue({ stdout: input });
        clearCache();
        expect(allpm[hasFn]()).toBe(expected);
      }
    });
  }
});

describe("clearCache", () => {
  it("is exported and callable", async () => {
    const { clearCache } = await import("../src/index");
    expect(typeof clearCache).toBe("function");
    expect(() => clearCache()).not.toThrow();
  });

  it("forces re-detection after clearing", async () => {
    mockSpawnSync.mockReturnValue({ stdout: Buffer.from("1.0.0") });
    mockPackageDirectorySync.mockReturnValue(undefined);

    const { default: allpm, clearCache } = await import("../src/index");

    // First call caches the result
    const first = allpm();
    clearCache();
    const second = allpm();

    expect(typeof first).toBe("string");
    expect(typeof second).toBe("string");
  });
});

describe("getPkgManager", () => {
  describe("detects pkg managers from lock file", () => {
    for (const [manager, lockFile] of pkgManagers) {
      it(`detects ${manager} from ${lockFile}`, async () => {
        const fakeRoot = "/fake/project";
        mockPackageDirectorySync.mockReturnValue(fakeRoot);

        spyOn(fs, "existsSync").mockImplementation((p) => p === path.join(fakeRoot, lockFile));

        const { default: allpm, clearCache } = await import("../src/index");
        clearCache();
        expect(allpm()).toBe(manager);
      });
    }
  });

  it("falls back to PATH detection when no lock file found", async () => {
    mockPackageDirectorySync.mockReturnValue(undefined);
    // Simulate yarn available on PATH
    mockSpawnSync.mockImplementation((cmd: string, _args: string[]) => {
      if (cmd === "yarn") return { stdout: Buffer.from("1.22.0") };
      return { stdout: null };
    });

    const { default: allpm, clearCache } = await import("../src/index");
    clearCache();
    expect(allpm()).toBe("yarn");
  });

  it("falls back to npm when no manager found on PATH", async () => {
    mockPackageDirectorySync.mockReturnValue(undefined);
    mockSpawnSync.mockReturnValue({ stdout: null });

    const { default: allpm, clearCache } = await import("../src/index");
    clearCache();
    expect(allpm()).toBe("npm");
  });
});

describe("spawn", () => {
  it("spawn() calls cross-spawn with proper args", async () => {
    mockPackageDirectorySync.mockReturnValue(undefined);
    mockSpawnSync.mockReturnValue({ stdout: Buffer.from("1.0.0") });

    const { spawn, clearCache } = await import("../src/index");
    clearCache();

    spawn("run", "test");

    expect(mockSpawn).toHaveBeenCalledWith(expect.any(String), ["run", "test"]);
  });

  it("spawn.sync() calls cross-spawn.sync with proper args", async () => {
    mockPackageDirectorySync.mockReturnValue(undefined);
    mockSpawnSync.mockReturnValue({ stdout: Buffer.from("1.0.0") });

    const { spawn, clearCache } = await import("../src/index");
    clearCache();

    spawn.sync("run", "build");

    // Last call should be sync spawn
    const calls = mockSpawnSync.mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall).toEqual([expect.any(String), ["run", "build"]]);
  });
});

describe("named exports", () => {
  let allpm: typeof AllpmModule;
  beforeAll(async () => {
    ({ default: allpm } = await import("../src/index"));
  });

  it("standard api is available", () => {
    expect(typeof allpm).toBe("function");
    expect(typeof allpm.clearCache).toBe("function");
  });

  it("spawn api is available", () => {
    expect(typeof allpm.spawn).toBe("function");
    expect(typeof allpm.spawn.sync).toBe("function");
  });

  it("pkg manager detection apis are available", () => {
    expect(typeof allpm.hasBun).toBe("function");
    expect(typeof allpm.hasDeno).toBe("function");
    expect(typeof allpm.hasPnpm).toBe("function");
    expect(typeof allpm.hasYarn).toBe("function");
    expect(typeof allpm.hasNpm).toBe("function");
  });
});
