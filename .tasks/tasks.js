"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mangle = exports.compress = exports.beautifyBundle = exports.babel = exports.bundleDev = exports.bundle = exports.lint = exports.transpile = exports.beautify = exports.runCommand = exports.nodeModulePath = void 0;
const child_process_1 = require("child_process");
const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Italic = "\x1b[3m";
const Underscore = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const Hidden = "\x1b[8m";
const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";
const FgPink = "\x1b[95m";
const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";
exports.nodeModulePath = "/usr/local/lib/nodejs/node-v16.15.1-linux-armv7l/bin/";
function runCommand(commandOptions) {
    const { command, name } = commandOptions;
    let mod = "";
    switch (commandOptions.color) {
        case "black":
            mod = FgBlack;
            break;
        case "red":
            mod = FgRed;
            break;
        case "green":
            mod = FgGreen;
            break;
        case "yellow":
            mod = FgYellow;
            break;
        case "blue":
            mod = FgBlue;
            break;
        case "magenta":
            mod = FgMagenta;
            break;
        case "cyan":
            mod = FgCyan;
            break;
        case "white":
            mod = FgWhite;
            break;
        case "pink":
            mod = FgPink;
    }
    return new Promise(resolve => {
        console.log(mod + "> Running %s <" + Reset, name);
        console.log(mod + Bright + ">> %s <<" + Reset, command);
        const start = performance.now();
        (0, child_process_1.exec)(exports.nodeModulePath + command, (error, message) => {
            if (error)
                throw error;
            console.log(mod + Italic + "%s took %d seconds\n" + Reset, name, ((performance.now() - start) | 0) / 1000);
            resolve(message);
        });
    });
}
exports.runCommand = runCommand;
;
async function beautify() {
    await runCommand({
        command: "js-beautify -f ./src/ts/**.ts --config ./.configs/beautify.config.json -r -q",
        name: "Beautify Code",
        color: "pink"
    });
}
exports.beautify = beautify;
async function transpile() {
    await runCommand({
        command: "tsc -p ./.configs/tsconfig.json",
        name: "Transpiling",
        color: "cyan"
    });
}
exports.transpile = transpile;
async function lint() {
    await runCommand({
        command: "eslint -c ./.configs/.eslintrc.json ./src/js/main.js --fix",
        name: "Linting",
        color: "white"
    });
}
exports.lint = lint;
async function bundle() {
    await runCommand({
        command: "rollup -c ./.configs/build.config.js --silent",
        name: "Bundling",
        color: "magenta"
    });
}
exports.bundle = bundle;
async function bundleDev() {
    await runCommand({
        command: "rollup -c ./.configs/dev.config.js --silent",
        name: "Bundling",
        color: "magenta"
    });
}
exports.bundleDev = bundleDev;
async function babel() {
    await runCommand({
        command: "babel ./dist/bundle.min.js --out-dir ./dist --config-file ./.configs/babel.config.json",
        name: "Babel",
        color: "yellow"
    });
}
exports.babel = babel;
async function beautifyBundle() {
    await runCommand({
        command: "js-beautify -f ./dist/bundle.js --config ./.configs/beautify.config.json -r -q",
        name: "Beautify Bundle",
        color: "blue"
    });
}
exports.beautifyBundle = beautifyBundle;
async function compress() {
    await runCommand({
        command: "uglifyjs ./dist/bundle.min.js -c -o ./dist/bundle.min.js",
        name: "Compress",
        color: "red"
    });
}
exports.compress = compress;
async function mangle() {
    await runCommand({
        command: "uglifyjs ./dist/bundle.js -m toplevel --mangle-props -o ./dist/bundle.min.js",
        name: "mangle",
        color: "green"
    });
}
exports.mangle = mangle;
