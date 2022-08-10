FROM uselagoon/node-16-builder:latest as builder
COPY --chown=node:node package.json package-lock.json .env.defaults .lagoon.env* /app/
RUN npm install

FROM uselagoon/node-16:latest

RUN apk add --no-cache \
    gzip  \
    unzip \
    rsync \
    mariadb-client \
    mongodb-tools \
    openssh-client \
    coreutils \
    findutils

# copy packages from build step
COPY --from=builder --chown=node:node /app/node_modules /app/node_modules

# set the working directory to point to our react app - 'app/client'
# all the following commands will runb from there
WORKDIR /app/client

# Copying the .env.defaults into the Workdir, as the dotenv system searches within the workdir for it
COPY --from=builder /app/.env.* .

# copy the rest over
COPY --chown=node:node . .

# We not only use "export $PATH" as this could be overwritten again
# like it happens in /etc/profile of alpine Images.
COPY entrypoints /lagoon/entrypoints/

# SSH Key and Agent Setup
COPY ssh_config /etc/ssh/ssh_config
# COPY id_ed25519_lagoon_cli.key /home/.ssh/lagoon_cli.key
# RUN chmod 400 /home/.ssh/lagoon_cli.key
ENV SSH_AUTH_SOCK=/tmp/ssh-agent

# making sure we run in production
#ENV NODE_ENV production

ENV WDS_SOCKET_PORT 0

# set the webroot and expose node port 3000
ENV WEBROOT=/app/client
EXPOSE 3000

RUN npm run build
RUN npm run compile-runtime-envs && chown -R node:node /app/client/public

USER node

ENV MARIADB_HOST mariadb
ENV MARIADB_USER lagoon
ENV MARIADB_PASSWORD lagoon
ENV MARIADB_DATABASE lagoon
ENV MARIADB_PORT 3306

ENTRYPOINT ["/sbin/tini", "--", "/lagoon/entrypoints.sh"]
CMD ["npm", "run", "start"]