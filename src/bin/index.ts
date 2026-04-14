#! /usr/bin/env node
"use strict";

import allpm from "../index";
// Execute the command
try {
  const status = allpm.spawn.sync(...process.argv.slice(2)).status;
  process.exit(status);
} catch (err) {
  console.log(err);
  process.exit(1);
}
