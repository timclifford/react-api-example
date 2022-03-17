FROM uselagoon/node-16-builder:latest as builder
COPY package.json package-lock.json /app/
RUN npm install

FROM uselagoon/node-16:latest
# copy packages from build step
COPY --from=builder /app/node_modules /app/node_modules
# copy the rest over
COPY . /app/

# set the working directory to point to the react app/client
WORKDIR /app/client
ENV WEBROOT=/app/client
EXPOSE 3000

RUN npm run build
CMD ["npm", "run", "start"]