import resolve from "@rollup/plugin-node-resolve";

export default {
    input:"src/js/main.js",
    output:{
        file:"dist/bundle.js",
        format:"iife",
    },
    plugins:[resolve()]
}
