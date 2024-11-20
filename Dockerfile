FROM mcr.microsoft.com/playwright:v1.49.0-focal

WORKDIR /app

COPY package.json package-lock.json vite.config.js index.html tailwind.config.js postcss.config.js ./
COPY src/ ./src
COPY public/ ./public

RUN npm ci --ignore-scripts
