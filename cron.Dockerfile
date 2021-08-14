FROM alpine:3.14.1

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app/common
COPY ./common/package*.json ./
RUN npm install
COPY ./common ./

WORKDIR /app/cron
COPY ./cron/package*.json ./
RUN npm install
COPY ./cron ./
RUN npm run build
