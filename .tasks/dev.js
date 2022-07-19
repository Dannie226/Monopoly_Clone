"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TASKS = require("./tasks");
async function build() {
    console.log("Development Building\n");
    const start = performance.now();
    await TASKS.transpile();
    await TASKS.bundleDev();
    console.log("Build process took %d seconds", ((performance.now() - start) | 0) / 1000);
}
build();
