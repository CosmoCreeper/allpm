const { mock, expect, test } = require("bun:test");

await mock.module("cross-spawn", () => ({
  sync: mock(() => ({ stdout: "1.0.0" })),
}));

delete require.cache[require.resolve("../index")];

const allpm = require("../index");

test("bun to exist", () => {
  expect(allpm.hasBun()).toBeTruthy();
});

test("deno to exist", () => {
  expect(allpm.hasDeno()).toBeTruthy();
});

test("pnpm to exist", () => {
  expect(allpm.hasPnpm()).toBeTruthy();
});

test("yarn to exist", () => {
  expect(allpm.hasYarn()).toBeTruthy();
});

test("npm to exist", () => {
  expect(allpm.hasNpm()).toBeTruthy();
});
