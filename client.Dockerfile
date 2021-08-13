FROM node:16-alpine

WORKDIR /app/common
COPY ./common/package*.json .
RUN npm install
COPY ./common .

WORKDIR /app/client
COPY ./client/package*.json .
RUN npm install
COPY ./client .
RUN npm run build && npm run export
