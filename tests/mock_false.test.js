const { mock, expect, test } = require("bun:test");

await mock.module("cross-spawn", () => ({
  sync: mock(() => ({ stdout: null })),
}));

delete require.cache[require.resolve("../index")];

const allpm = require("../index");

test("bun to not exist", () => {
  expect(allpm.hasBun()).toBeFalsy();
});

test("pnpm to not exist", () => {
  expect(allpm.hasPnpm()).toBeFalsy();
});

test("yarn to not exist", () => {
  expect(allpm.hasYarn()).toBeFalsy();
});

test("npm to not exist", () => {
  expect(allpm.hasNpm()).toBeFalsy();
});
