ARG CLI_IMAGE
FROM ${CLI_IMAGE:-builder} as builder

FROM uselagoon/nginx:latest
COPY nginx/redirects-map.conf /etc/nginx/redirects-map.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/app.conf
RUN fix-permissions /etc/nginx/redirects-map.conf
RUN fix-permissions /etc/nginx/conf.d/app.conf

COPY --from=builder /app /app

ENV WEBROOT=client