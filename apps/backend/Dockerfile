FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/backend/package.json apps/backend/

COPY packages packages

RUN corepack enable

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @app/backend build

EXPOSE 3000

CMD ["pnpm" , "--filter", "@app/backend" , "start"]