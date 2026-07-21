FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/backend/package.json apps/backend/
COPY packages/*/package.json packages/*/

RUN pnpm install --frozen-lockfile

COPY apps/backend ./apps/backend
COPY packages ./packages

WORKDIR /app/apps/backend

RUN pnpm build


FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json

WORKDIR /app/apps/backend

EXPOSE 3001

CMD ["sh", "-c", "pnpm typeorm -d ./dist/datos/presistence/connections/AppDataSource.js migration:run && node dist/server.js"]