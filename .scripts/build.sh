#!/bin/bash

run_command () {
    local start_time=$(date +%s.%3N)

    echo -e "\e[$3m> Running $2 <\e[0m"
    echo -e "\e[1;$3m>> $1 <<\e[0m"
    eval $1 || { exit 1; }

    local end_time=$(date +%s.%3N)
    
    local elapsed=$(echo "scale=3; $end_time - $start_time" | bc)
    echo -e "\e[3;$3m$2 took $elapsed s\e[0m"
    echo ""
}

export PATH=/usr/local/lib/nodejs/node-v16.15.1-linux-armv7l/bin:$PATH
. ~/.profile

start_time=$(date +%s.%3N)

run_command "js-beautify -f ./src/ts/**.ts ./src/ts/**/**.ts --config ./.configs/beautify.config.json -r -q" "Beautify TS" 33

run_command "tsc -p ./.configs/tsconfig.json" "Transpilation" 36

run_command "eslint -c ./.configs/.eslintrc.json ./src/js/main.js --fix" "Lint JS" 97

run_command "uglifyjs ./src/js/main.js -c -m toplevel -o ./src/js/main.min.js" "Initial Min" 31

run_command "rollup -c ./.configs/build.config.js --silent" "Bundling" 35

run_command "js-beautify -f ./dist/bundle.js --config ./.configs/beautify.config.json -r -q" "Beautify Bundle" 34

run_command "uglifyjs ./dist/bundle.js -c -m toplevel -o ./dist/bundle.min.js --source-map" "Minify" 32

run_command "echo -e \"\n//# sourceMappingURL=bundle.min.js.map\" >> ./dist/bundle.min.js" "Append Source Map" 91

end_time=$(date +%s.%3N)
elapsed=$(echo "$end_time-$start_time" | bc)
echo "Build took $elapsed s"
