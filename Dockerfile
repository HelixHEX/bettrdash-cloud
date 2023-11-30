ARG NODE_VERSION=18.17.0

# Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup yarn on the alpine base
FROM alpine as base
RUN npm install turbo --global
RUN npm install yarn --global --force


# Prune projects
FROM base AS pruner
ARG PROJECT

WORKDIR /app
COPY . .
RUN turbo prune --scope=${PROJECT} --docker

# Build the project
FROM base AS builder
ARG PROJECT

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN yarn install --production=false

# Build prisma

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN turbo run db-generate
RUN turbo run build --scope=${PROJECT}
RUN yarn install --production
RUN rm -rf ./**/*/src

# Final image
FROM alpine AS runner
ARG PROJECT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
RUN yarn add debug
COPY --from=builder --chown=nodejs:nodejs /app .
WORKDIR /app/apps/${PROJECT}

ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

CMD node dist/index