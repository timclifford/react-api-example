FROM uselagoon/mariadb

# copy initial table setup into docker entrpoint
COPY ./setup.sql /docker-entrypoint-initdb.d/setup.sql

