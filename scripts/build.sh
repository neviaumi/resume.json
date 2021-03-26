#!/bin/bash
set -ex

git config user.email "github-action@github.com"
git config user.name "github-action[bot]"
rm -f docs/index.html
git add docs
git commit -m "docs(release): remove existing resume html[skip ci]"
yarn build
yarn build:pdf
git add docs
git commit -m "docs(release): publish new resume html[skip ci]"
git push