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

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Run everything after as non-privileged user.
WORKDIR /app/common
COPY ./common/package*.json ./
RUN npm install
COPY ./common ./

WORKDIR /app/cron
COPY ./cron/package*.json ./
RUN npm install
COPY ./cron ./
RUN npm run build
