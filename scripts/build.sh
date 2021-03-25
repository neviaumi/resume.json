#!/bin/bash

git config user.email "github-action@github.com"
git config user.name "github-action[bot]"
yarn build
git add docs
git commit -m "docs(release): publish new resume html[skip ci]"
git push