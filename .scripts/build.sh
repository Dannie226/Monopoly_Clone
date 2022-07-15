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

run_command "js-beautify -f ./src/ts/**.ts --config ./.configs/beautify.config.json -r -q" "Beautify TS" 95

run_command "tsc -p ./.configs/tsconfig.json" "Transpilation" 36

run_command "eslint -c ./.configs/.eslintrc.json ./src/js/main.js --fix" "Lint JS" 97

run_command "rollup -c ./.configs/build.config.js --silent" "Bundling" 35

run_command "js-beautify -f ./dist/bundle.js --config ./.configs/beautify.config.json -r -q" "Beautify Bundle" 34

run_command "uglifyjs ./dist/bundle.js -m toplevel --mangle-props -o ./dist/bundle.min.js" "Mangle" 32

run_command "babel ./dist/bundle.min.js --out-dir ./dist --config-file ./.configs/babel.config.json --quiet" "Babel" 33

run_command "uglifyjs ./dist/bundle.min.js -c -o ./dist/bundle.min.js" "Compress" 31

end_time=$(date +%s.%3N)
elapsed=$(echo "$end_time-$start_time" | bc)
echo "Build took $elapsed s"
