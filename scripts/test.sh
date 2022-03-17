#!/bin/bash
set -ex

npm run lint:ci
npx markdownlint-cli2-fix "**/*.md" "#node_modules"
npm run test