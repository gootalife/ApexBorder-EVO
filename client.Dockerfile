FROM node:16-alpine

WORKDIR /app/common
COPY ./common/package*.json ./
RUN npm install

WORKDIR /app/client
COPY ./client/package*.json ./
RUN npm install

WORKDIR /app/common
COPY ./common ./

WORKDIR /app/client
COPY ./client ./
COPY ./.env .
RUN npm run generate
