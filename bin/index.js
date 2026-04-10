#! /usr/bin/env node
"use strict";

const allpm = require("../index");
// Execute the command
try {
  const status = allpm.spawn.sync(process.argv.slice(2), { stdio: "inherit" }).status;
  process.exit(status);
} catch (err) {
  console.log(err);
  process.exit(1);
}
