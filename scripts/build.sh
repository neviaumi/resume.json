#!/bin/bash
set -x

set -e
yarn build:docker
set +e
git diff --name-only --exit-code docs

if [ $? -eq 1 ]; then
  set -e
  git config user.email "github-action@github.com"
  git config user.name "github-action[bot]"
  git add docs
  git commit -m "docs(release): publish new resume[skip ci]"
  git push
else
  echo "Resume render result not changed"
fi


