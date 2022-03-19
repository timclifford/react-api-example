FROM uselagoon/node-16-builder:latest as builder
COPY package.json package-lock.json .env.defaults .lagoon.env* /app/
RUN npm install

FROM uselagoon/node-16:latest
# copy packages from build step
COPY --from=builder /app/node_modules /app/node_modules

# set the working directory to point to our react app - 'app/client'
# all the following commands will runb from there
WORKDIR /app/client

# Copying the .env.defaults into the Workdir, as the dotenv system searches within the workdir for it
COPY --from=builder /app/.env.defaults .

# copy the rest over
COPY . .

# making sure we run in production
ENV NODE_ENV production

# set the webroot and expose node port 3000
ENV WEBROOT=/app/client
EXPOSE 3000

ENV WDS_SOCKET_PORT 0

RUN npm run build
CMD ["npm", "run", "start"]