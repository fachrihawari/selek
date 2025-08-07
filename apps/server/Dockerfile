# --- Builder stage ---
FROM oven/bun:1.2.19 AS builder
WORKDIR /app

COPY ./package.json ./bun.lock /app/
COPY ./apps/server /app/apps/server
COPY ./.env /app/.env

RUN bun install

RUN cd apps/server && bun run build

# --- Runner stage ---
FROM oven/bun:1.2.19 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/bun.lock /app/.env /app/
COPY --from=builder /app/apps/server /app/apps/server
COPY --from=builder /app/node_modules /app/node_modules

CMD bun run --filter "server" migrate && bun run --filter "server" seed && bun run --filter "server" start
