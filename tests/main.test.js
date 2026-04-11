import { expect, test } from "bun:test";
import allpm from "../index";

test("pkg manager check to be bun", () => {
  expect(allpm()).toBe("bun");
});

test("check for bun to be true", () => {
  expect(allpm.hasBun()).toBeTruthy();
});

test("ensure spawn to succeed and process via bun", () => {
  const result = allpm.spawn.sync("--version").stdout?.toString().trim();
  expect(!!result).toBeTruthy();
  expect(result).toContain("bun");
});
