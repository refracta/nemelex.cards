#!/usr/bin/env bash

set -ex

eslint --ext .ts js
cd js
tsc
cd ..
