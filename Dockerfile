FROM mcr.microsoft.com/playwright:v1.48.2-focal

WORKDIR /app

COPY package.json package-lock.json vite.config.js index.html tailwind.config.js postcss.config.js ./
COPY web-components/ ./web-components
COPY src/ ./src
COPY public/ ./public

RUN npm ci --ignore-scripts
