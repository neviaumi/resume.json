#!/bin/bash
set -ex

#touch ./public/resume.pdf
node ./src/build-pdf.js
#docker compose -f docker-compose-build.yml up --build --exit-code-from pdf-builder --abort-on-container-exit
npx vite build