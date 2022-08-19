#!/bin/sh

rm -rf ../use.gpu-site/public/demo/ 2>/dev/null
mkdir ../use.gpu-site/public/demo/ 2>/dev/null
mkdir ../use.gpu-site/public/demo/dist/ 2>/dev/null
cp -r public/* ../use.gpu-site/public/demo/
cp -r dist/* ../use.gpu-site/public/demo/dist/

