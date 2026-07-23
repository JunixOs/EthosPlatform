FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
COPY tests/e2e/package.json tests/e2e/
COPY packages/shared/package.json packages/shared/
COPY packages/types/package.json packages/types/
COPY packages/ui/package.json packages/ui/

RUN pnpm install --frozen-lockfile

COPY apps/backend ./apps/backend
COPY packages ./packages

WORKDIR /app/apps/backend
RUN pnpm run build


FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json

WORKDIR /app/apps/backend

EXPOSE 3001

CMD ["sh", "-c", "node node_modules/typeorm/cli.js -d ./dist/datos/presistence/connections/AppDataSource.js migration:run && node dist/datos/seed/seed.js && node dist/server.js"]