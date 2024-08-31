#!/bin/bash

if [ $# -eq 0 ]; then
  echo "No version supplied"
  exit
fi

git checkout master
git checkout -B rc
yarn version --new-version $1 && git push gitlab rc --force
git checkout master; echo
