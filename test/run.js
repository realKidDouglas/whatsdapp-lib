/* eslint-disable */
// enable requiring typescript files
require('ts-node').register();
require("fast-glob")
  // find all test spec files in the src directory
  .sync("../src/**/*.spec.ts", {cwd: __dirname})
  // require each of them to register its runners
  .forEach(f => require(f));
// run the test suite
require('ospec').run();
