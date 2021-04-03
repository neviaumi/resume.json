FROM mcr.microsoft.com/playwright:bionic

WORKDIR /app

COPY package.json yarn.lock resume.json buildPDF.js ./
COPY theme ./theme
RUN yarn --production --frozen-lockfile
