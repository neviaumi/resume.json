FROM mcr.microsoft.com/playwright:bionic

WORKDIR /app

COPY package.json yarn.lock resume.json buildPDF.js ./
RUN yarn --production --frozen-lockfile
RUN yarn build