run_command () {
    local start_time=$(date +%s.%3N)

    echo -e "\e[$3m$2\e[0m"
    echo -e "\e[1;$3m$1\e[0m"
    eval $1 || { exit 1; }

    local end_time=$(date +%s.%3N)
    
    local elapsed=$(echo "scale=3; $end_time - $start_time" | bc)
    echo -e "\e[3;$3m$2 took $elapsed s\e[0m"
    echo ""
}

export PATH=/usr/local/lib/nodejs/node-v16.15.1-linux-armv7l/bin:$PATH
. ~/.profile

start_time=$(date +%s.%3N)

run_command "tsc -p ./.configs/tsconfig.json" "Transpilation" 36

run_command "rollup -c ./.configs/dev.config.js --silent" "Bundling" 35

end_time=$(date +%s.%3N)
elapsed=$(echo "$end_time-$start_time" | bc)
echo "Build took $elapsed seconds"
