FROM node:16-alpine

WORKDIR /app/common
COPY ./common/package*.json ./
RUN npm install

WORKDIR /app/cron
COPY ./cron/package*.json ./
RUN npm install

WORKDIR /app/common
COPY ./common ./

WORKDIR /app/cron
COPY ./cron ./
RUN npm run build
