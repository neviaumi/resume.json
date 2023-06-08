#!/bin/bash
set -ex

npm audit
npm run lint:ci
npm run test
npm run test:docker