#! /usr/bin/env node
"use strict";

const nypb = require("../index");
// Execute the command
try {
  const status = nypb.spawn.sync(process.argv.slice(2), { stdio: "inherit" }).status;
  process.exit(status);
} catch (err) {
  console.log(err);
  process.exit(1);
}
