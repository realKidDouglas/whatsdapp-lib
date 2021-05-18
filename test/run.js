/* eslint @typescript-eslint/no-var-requires: "off" */
// enable requiring typescript files
require('ts-node').register();

switch(process.argv[2]) {
  case "unit":
    unit();
    break;
  case "e2e":
    e2e();
    break;
  default:
    help();
}

function unit() {
  /* eslint-disable */
  require("fast-glob")
    // find all test spec files in the src directory
    .sync("../src/**/*.spec.ts", {cwd: __dirname})
    // require each of them to register its runners
    .forEach(f => require(f));
  // run the test suite
  require('ospec').run();
}

function e2e() {
  require('./e2e/e2e.ts').run().then(() => console.log("e2e test done!"));
}

function help() {
  console.log("usage: node run unit|e2e")
}
