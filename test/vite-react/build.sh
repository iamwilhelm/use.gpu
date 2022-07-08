#!/bin/sh
rm -rf ./usegpu-test
yarn create vite usegpu-test --template react-ts
cd usegpu-test
yarn install
mkdir ./node_modules/@use-gpu 2>/dev/null;
cp -r ../../../build/packages/* node_modules/@use-gpu
cp ../vite.config.ts .
cp ../tsconfig.json .
cp ../src/* src
