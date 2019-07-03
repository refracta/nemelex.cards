#!/usr/bin/env bash

set -ex

cd js
tslint -p tsconfig.json
tsc
cd ..
