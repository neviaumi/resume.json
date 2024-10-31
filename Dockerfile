FROM mcr.microsoft.com/playwright:v1.48.2-focal

WORKDIR /app

COPY package.json package-lock.json vite.config.js index.html resume.json ./
COPY src/ ./src
COPY public/ ./public

RUN npm ci --ignore-scripts
