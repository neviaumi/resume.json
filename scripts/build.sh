#!/bin/bash
set -x

yarn build

git diff --name-only --exit-code docs/index.html
if [ $? -eq 1 ]; then
  set -e
  git config user.email "github-action@github.com"
  git config user.name "github-action[bot]"
  git add docs
  git commit -m "docs(release): publish new resume[skip ci]"
  git push
else
  echo "Result HTML not changed"
fi


