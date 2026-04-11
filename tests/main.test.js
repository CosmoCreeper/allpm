const { mock, expect, test } = require("bun:test");
const allpm = require("../index");

test("pkg manager check to be bun", () => {
  expect(allpm()).toBe("bun");
});

test("check for bun to be true", () => {
  expect(allpm.hasBun()).toBeTruthy();
});
