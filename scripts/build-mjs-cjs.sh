#!/bin/bash

if [ -z "$NPM_PACKAGE" ]
then
  exit 1
fi

exit_on_error() {
    exit_code=$1
    last_command=${@:2}
    if [ $exit_code -ne 0 ]; then
        >&2 echo "❌ \"${last_command}\" command failed with exit code ${exit_code}."
        exit $exit_code
    fi
}

rm -rf ../../build/packages/$NPM_PACKAGE
rm -rf ../../build/ts/$NPM_PACKAGE
rm -rf ../../build/mjs/$NPM_PACKAGE

mkdir -p ../../build/ts/$NPM_PACKAGE 2>/dev/null
mkdir -p ../../build/cjs/$NPM_PACKAGE 2>/dev/null
mkdir -p ../../build/mjs/$NPM_PACKAGE 2>/dev/null
mkdir -p ../../build/packages/$NPM_PACKAGE/mjs 2>/dev/null
mkdir -p ../../build/packages/$NPM_PACKAGE/cjs 2>/dev/null

# MJS

swc --config-file ../../swc-mjs.json src --out-dir ../../build/mjs/$NPM_PACKAGE/src --extensions ".ts,.tsx,.js,.jsx" --ignore "src/**/__mocks__/**/*.js" --ignore "src/**/*.test.ts" --ignore "src/**/*.d.ts" 1>/dev/null
exit_on_error $? swc

if test -n "$(find . -maxdepth 1 -name '*.ts' -print -quit 2>/dev/null)"
then
  swc --config-file ../../swc-mjs.json *.ts --out-dir ../../build/mjs/$NPM_PACKAGE --extensions ".ts" 1>/dev/null
  exit_on_error $? swc
fi

# CJS

swc --config-file ../../swc-cjs.json src --out-dir ../../build/cjs/$NPM_PACKAGE/src --extensions ".ts,.tsx,.js,.jsx" --ignore "src/**/__mocks__/**/*.js" --ignore "src/**/*.test.ts" 1>/dev/null
exit_on_error $? swc

if test -n "$(find . -maxdepth 1 -name '*.ts' -print -quit 2>/dev/null)"
then
  swc --config-file ../../swc-cjs.json *.ts --out-dir ../../build/cjs/$NPM_PACKAGE --extensions ".ts" 1>/dev/null
  exit_on_error $? swc
fi

# Bin .js

if test -n "$(find bin -maxdepth 1 -print -quit 2>/dev/null)"
then
  mkdir ../../build/packages/$NPM_PACKAGE/bin 2>/dev/null
  cp -r ./bin/* ../../build/packages/$NPM_PACKAGE/bin/
fi

# Use MJS as TS built output

cp -r ../../build/mjs/$NPM_PACKAGE/src ../../build/ts/$NPM_PACKAGE

echo Compiled to .js.

# Emit typedefs .d.ts

rm tsconfig.tsbuildinfo 2>/dev/null
tsc --emitDeclarationOnly
exit_on_error $? tsc

cp -r ../../build/ts/$NPM_PACKAGE/src/* ../../build/packages/$NPM_PACKAGE/cjs/
cp -r ../../build/ts/$NPM_PACKAGE/src/* ../../build/packages/$NPM_PACKAGE/mjs/
cp ../../build/ts/$NPM_PACKAGE/*.d.ts ../../build/packages/$NPM_PACKAGE/ 2>/dev/null
cp ../../build/ts/$NPM_PACKAGE/*.js ../../build/packages/$NPM_PACKAGE/ 2>/dev/null

echo Generated .d.ts.

# Copy CJS back

cp -r ../../build/cjs/$NPM_PACKAGE/src/* ../../build/packages/$NPM_PACKAGE/cjs/

# Rename .js to .cjs / .mjs

ts-node ../../scripts/rename-mjs-cjs.ts

# Finalize package.json

cp README.md package.json ../../build/packages/$NPM_PACKAGE

ts-node ../../scripts/package-json-mjs-cjs.ts
ts-node ../../scripts/package-json-version.ts

echo "✅"
