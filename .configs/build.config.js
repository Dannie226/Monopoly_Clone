import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input:"src/js/main.min.js",
    output:{
        file:"dist/bundle.js",
        format:"iife",
    },
    plugins:[nodeResolve()]
}
