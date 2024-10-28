FROM mcr.microsoft.com/playwright:v1.48.2-focal

WORKDIR /app

COPY package.json package-lock.json ./
COPY src/ ./src
COPY docs/ ./docs

RUN npm ci --ignore-scripts
