FROM uselagoon/mariadb

COPY ./setup.sql /docker-entrypoint-initdb.d/setup.sql

