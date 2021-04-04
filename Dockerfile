FROM mcr.microsoft.com/playwright:bionic

WORKDIR /app

COPY package.json yarn.lock ./
COPY src/ ./src
RUN mkdir -p ./docs
RUN yarn --production --frozen-lockfile
