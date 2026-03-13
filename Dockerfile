# This is a multi-stage build to optimize image size.
# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /usr/app

ENV HUSKY=0

# Pin pnpm version for reproducible builds
RUN apk add --no-cache ca-certificates \
    && corepack enable && corepack prepare pnpm@10.32.1 --activate

FROM base AS install

# Install all dependencies (dev + prod)
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

FROM base AS build

# Get all dependencies and build the app
ENV NODE_ENV=production
COPY --from=install /usr/app/node_modules node_modules
COPY . .
RUN touch .env && pnpm run build


FROM base AS release

RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001 -G nodejs

# Copy production dependencies only
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=build --chown=nextjs:nodejs /usr/app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /usr/app/public ./public
COPY --from=build --chown=nextjs:nodejs /usr/app/next.config.js ./
COPY --from=build --chown=nextjs:nodejs /usr/app/svgr.config.js ./

# Prune unnecessary files to reduce image size
RUN rm -rf .next/cache \
    && rm -rf /root/.local/share/pnpm/store /tmp/*

RUN mkdir -p /usr/tests
COPY --from=build /usr/app/tsconfig.json /usr/tests/
COPY --from=build /usr/app/vitest.config.ts /usr/tests/
COPY --from=build /usr/app/package.json /usr/tests/
COPY --from=build /usr/app/src /usr/tests/src

# Switch to non-root user
USER nextjs

# Runs "/usr/bin/dumb-init -- /my/script --with --args"
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

EXPOSE 3000
CMD ["pnpm", "run", "start"]
