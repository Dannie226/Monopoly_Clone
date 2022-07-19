"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TASKS = require("./tasks");
async function build() {
    console.log("Building\n");
    const start = performance.now();
    await TASKS.beautify();
    await TASKS.transpile();
    await TASKS.lint();
    await TASKS.bundle();
    await TASKS.beautifyBundle();
    await TASKS.mangle();
    await TASKS.babel();
    await TASKS.compress();
    console.log("Build process took %d seconds", ((performance.now() - start) | 0) / 1000);
}
build();
