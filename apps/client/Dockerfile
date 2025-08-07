# build stage
FROM oven/bun:1.2.19 AS builder
WORKDIR /app

COPY ./package.json ./bun.lock /app
COPY ./apps/client /app/apps/client

# Set build-time environment variable
ARG VITE_API_URL

RUN bun install
RUN cd apps/client && bun run build

# runner stage
FROM nginx:1.27.1-alpine3.20
WORKDIR /app

# Remove the default nginx.conf to add our own
RUN rm /etc/nginx/conf.d/default.conf

# Copy build & nginx conf
COPY --from=builder /app/apps/client/build/client /usr/share/nginx/html
COPY --from=builder /app/apps/client/nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
