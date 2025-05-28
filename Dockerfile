# This is a multi-stage build to optimize image size.

FROM node:lts-slim AS base
WORKDIR /usr/app

ENV HUSKY=0

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

FROM base AS install

RUN npm set progress=false && npm config set depth 0

# install all dependencies
RUN mkdir -p /tmp/dev
COPY package.json package-lock.json sozialhelden-core-1.0.0.tgz /tmp/dev/
RUN cd /tmp/dev && npm ci --omit=optional --ignore-scripts

# install prod dependencies into a different directory
RUN mkdir -p /tmp/prod
COPY package.json package-lock.json sozialhelden-core-1.0.0.tgz /tmp/prod/
RUN cd /tmp/prod && npm ci --omit=optional --production --ignore-scripts

FROM base AS build

# get all dependencies (including dev dependencies) and build the app
ENV NODE_ENV=production
COPY --from=install /tmp/dev/node_modules node_modules
COPY . .
RUN touch .env && npm run build


FROM base AS release

RUN apt-get update && apt-get install -y --no-install-recommends \
  dumb-init \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY --from=install /tmp/prod/node_modules node_modules
COPY --from=build /usr/app/.next ./.next
COPY --from=build /usr/app/public ./public
COPY --from=build /usr/app/package.json .
COPY --from=build /usr/app/run_tests.sh .

RUN mkdir -p /usr/tests
COPY --from=build /usr/app/tsconfig.json /usr/tests/
COPY --from=build /usr/app/vitest.config.ts /usr/tests/
COPY --from=build /usr/app/playwright.config.ts /usr/tests/
COPY --from=build /usr/app/package.json /usr/tests/
COPY --from=build /usr/app/tests /usr/tests/tests
COPY --from=build /usr/app/src /usr/tests/src

# Runs "/usr/bin/dumb-init -- /my/script --with --args"
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

EXPOSE 3000
CMD ["npm", "run", "start"]
