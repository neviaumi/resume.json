#!/bin/bash
set -ex

npm run lint:ci
npm run test
npm run test:docker