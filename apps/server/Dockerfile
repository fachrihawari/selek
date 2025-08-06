FROM oven/bun:1.1.36-alpine

WORKDIR /app

COPY ./apps/server /app

RUN bun install
RUN bun run build
CMD bun run start:prod
