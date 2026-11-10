FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

FROM base AS development
ENV NODE_ENV=development
EXPOSE 1337
CMD ["pnpm", "develop"]

FROM base AS build
ENV NODE_ENV=production
RUN pnpm build

FROM node:22-bookworm-slim AS production
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY --from=build /app ./

EXPOSE 1337
CMD ["pnpm", "start"]
