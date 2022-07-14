#!/bin/bash

if [ -z "$NPM_PACKAGE" ]
then
  exit 1
fi

rm -rf ../../build/packages/$NPM_PACKAGE
rm -rf ../../build/ts/$NPM_PACKAGE

mkdir ../../build 2>/dev/null
mkdir ../../build/ts 2>/dev/null
mkdir ../../build/ts/$NPM_PACKAGE 2>/dev/null
mkdir ../../build/packages 2>/dev/null
mkdir ../../build/packages/$NPM_PACKAGE 2>/dev/null
mkdir ../../build/packages/$NPM_PACKAGE/mjs 2>/dev/null
mkdir ../../build/packages/$NPM_PACKAGE/umd 2>/dev/null

MODULE_ENV=mjs babel src --out-dir ../../build/ts/$NPM_PACKAGE/src --extensions ".ts,.tsx,.js,.jsx" --ignore "src/**/__mocks__/**/*.js" --ignore "src/**/*.test.ts" 1>/dev/null

if test -n "$(find . -maxdepth 1 -name '*.ts' -print -quit)"
then
  MODULE_ENV=mjs babel *.ts --out-dir ../../build/ts/$NPM_PACKAGE --extensions ".ts" --ignore "src/**/__mocks__/**/*.js" --ignore "src/**/*.test.ts" 1>/dev/null
fi

cp -r ../../build/ts/$NPM_PACKAGE/src/* ../../build/packages/$NPM_PACKAGE/mjs/

MODULE_ENV=umd babel src --out-dir ../../build/ts/$NPM_PACKAGE/src --extensions ".ts,.tsx,.js,.jsx" --ignore "src/**/__mocks__/**/*.js" --ignore "src/**/*.test.ts" 1>/dev/null

if test -n "$(find . -maxdepth 1 -name '*.ts' -print -quit)"
then
  MODULE_ENV=umd babel *.ts --out-dir ../../build/ts/$NPM_PACKAGE --extensions ".ts" --ignore "src/**/__mocks__/**/*.js" --ignore "src/**/*.test.ts" 1>/dev/null
fi

cp -r ../../build/ts/$NPM_PACKAGE/src/* ../../build/packages/$NPM_PACKAGE/umd/

echo Compiled to .js.

rm tsconfig.tsbuildinfo 2>/dev/null
tsc --emitDeclarationOnly
cp -r ../../build/ts/$NPM_PACKAGE/src/* ../../build/packages/$NPM_PACKAGE/umd/
cp -r ../../build/ts/$NPM_PACKAGE/src/* ../../build/packages/$NPM_PACKAGE/mjs/

echo Generated .d.ts.

cp ../../build/ts/$NPM_PACKAGE/*.ts ../../build/packages/$NPM_PACKAGE/ 2>/dev/null
cp ../../build/ts/$NPM_PACKAGE/*.js ../../build/packages/$NPM_PACKAGE/ 2>/dev/null

cp README.md package.json ../../build/packages/$NPM_PACKAGE

ts-node ../../scripts/package-json-mjs-umd.ts
ts-node ../../scripts/package-json-version.ts
