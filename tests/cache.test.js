import { test, expect, mock, afterAll } from "bun:test";
import crossSpawn from "cross-spawn";

let stdout = "1.0.0";
mock.module("cross-spawn", () => ({
  sync: mock(() => ({ stdout })),
}));

const allpm = require("../index");

test("testing cache behavior", () => {
  // Uncached check, forcefully truthy via mock
  expect(allpm.hasBun()).toBeTruthy();

  // Result of a check will now be falsy, but the result is cached, keeping it truthy
  stdout = null;
  expect(allpm.hasBun()).toBeTruthy();

  // Clearing cache will make it check, resulting in a falsy result
  allpm.clearCache();
  expect(allpm.hasBun()).toBeFalsy();
});

afterAll(() => {
  mock.module("cross-spawn", () => crossSpawn);
  delete require.cache[require.resolve("../index")];
});
