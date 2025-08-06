FROM oven/bun:1.2.19-alpine

WORKDIR /app

COPY ../../package.json ../../bun.lock /app
COPY ../../apps/server /app/apps/server
COPY ../../apps/client /app/apps/client

RUN bun i

CMD bun run --filter "server" start
