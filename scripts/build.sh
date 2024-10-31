#!/bin/bash
set -ex

touch ./docs/resume.pdf
docker compose -f docker-compose-build.yml up --build --exit-code-from pdf-builder --abort-on-container-exit
npx vite build