FROM postgres:13-alpine
COPY ./db /docker-entrypoint-initdb.d
