#!/bin/bash
set -ex

npx eslint .
npx playwright test
npm run test:docker