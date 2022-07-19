import resolve from "@rollup/plugin-node-resolve";

export default {
    input:"src/js/main.js",
    output:{
        file:"dist/bundle.min.js",
        format:"iife",
        sourcemap:"inline"
    },
    plugins:[resolve()]
}
