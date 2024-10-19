FROM uselagoon/node-16-builder:latest as builder
COPY package.json package-lock.json /app/
RUN npm install

FROM uselagoon/node-16:latest
COPY --from=builder /app/node_modules /app/node_modules
COPY ./ /app/

RUN chmod +x ./wait-for-mariadb.sh
# a small entrypoint which waits for mariadb to be fully ready.
CMD sh -c './wait-for-mariadb.sh && npm run seed'