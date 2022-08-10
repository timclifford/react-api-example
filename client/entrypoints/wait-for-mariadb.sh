#!/bin/sh
set -eu
echo "Waiting until ${MARIADB_HOST} is ready"
until nc -vzw5 "${MARIADB_HOST}" 3306; do
    sleep 1
done