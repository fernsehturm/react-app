#!/bin/bash


export IP_ADDR=$(ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
echo $IP_ADDR

set -a
source ./localdev.env
set +a

VARNAME=\$$(echo $1)
PORT=$(eval echo $VARNAME)

webpack-dev-server --config ./webpack.config.example.js --port $PORT