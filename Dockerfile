# This is a multi-stage build to optimize image size.

# 1) First, we build the base image to have it cached on rebuilds.
# See https://nodejs.org/en/about/releases/ for a release support roadmap.
# Prefer even version numbers, they have active long-term support.
FROM node:lts-slim AS base

# Create app directory
WORKDIR /usr/app

# Cache necessary files for npm install
COPY package.json .
COPY package-lock.json .

# 2) Now we create a new image in which we install dependencies necessary for building our app.
#    This will create a lot of clutter that we don't want to include in our final image to push.
FROM base AS buildenv
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN npm set progress=false && npm config set depth 0
RUN npm ci
COPY . .
RUN touch .env && NODE_ENV=production npm run build && npm prune --production && rm -rf ./node_modules/.cache

# run linters, setup and tests
# FROM buildenv AS test
# COPY . .
# RUN  npm run lint && npm run setup && npm run test

# 3) The build is done! Now we create a third image, based on the base image from the beginning.
#    In this third image, we extract only the minimal necessary set of files to run the app. The
#    result is what we will push to the registry.

FROM base AS release

RUN apt-get update && apt-get install -y --no-install-recommends \
  dumb-init \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# copy production node_modules to /usr/app

COPY --from=buildenv /usr/app/package.json .
COPY --from=buildenv /usr/app/dist ./dist
COPY --from=buildenv /usr/app/.next ./.next
COPY --from=buildenv /usr/app/public ./public
COPY --from=buildenv /usr/app/node_modules ./node_modules
COPY --from=buildenv /usr/app/e2e ./e2e
COPY --from=buildenv /usr/app/run_tests.sh ./run_tests.sh

EXPOSE 3000

# Runs "/usr/bin/dumb-init -- /my/script --with --args"
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# or if you use --rewrite or other cli flags
# ENTRYPOINT ["dumb-init", "--rewrite", "2:3", "--"]

CMD ["npm", "run", "start"]
