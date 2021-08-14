FROM node:16-alpine

WORKDIR /app/common
COPY ./common/package*.json ./
RUN npm install

WORKDIR /app/apiserver
COPY ./apiserver/package*.json ./
RUN npm install

WORKDIR /app/common
COPY ./common ./

WORKDIR /app/apiserver
COPY ./apiserver ./
RUN npm run build
