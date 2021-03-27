#!/bin/bash
set -ex

git config user.email "github-action@github.com"
git config user.name "github-action[bot]"
rm -f docs/index.html
rm -f docs/resume.pdf
yarn build
yarn build:pdf
git add docs
git commit -m "docs(release): publish new resume[skip ci]"
git push || true