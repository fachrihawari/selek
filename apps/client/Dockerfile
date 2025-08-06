# build stage
FROM oven/bun:1.1.36-alpine AS builder

WORKDIR /app
COPY ./apps/client /app

# Install dependencies
RUN bun install
RUN bun run build

# runner stage
FROM nginx:1.27.1-alpine3.20

# Remove the default nginx.conf to add our own
RUN rm /etc/nginx/conf.d/default.conf

# Copy build & nginx conf
COPY --from=builder /app/build/client /usr/share/nginx/html
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
