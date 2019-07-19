# This is a multi-stage build to optimize image size.

# 1) First, we build the base image to have it cached on rebuilds:
FROM node:12 AS base

# Create app directory
WORKDIR /usr/app

# Add Tini to increase container stability / https://github.com/krallin/tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini.asc /tini.asc
RUN gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 595E85A6B1B4779EA4DAAEC70B588DFF0527A9B7 \
  && gpg --batch --verify /tini.asc /tini
RUN chmod +x /tini
# Set tini as entrypoint
ENTRYPOINT ["/tini", "--"]

# Cache necessary files for npm install
COPY package.json .
COPY package-lock.json .

# 2) Now we create a new image in which we install dependencies necessary for building our app.
#    This will create a lot of clutter that we don't want to include in our final image to push.
FROM base AS buildenv
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  g++ \
  build-essential \
  make \
  gnupg2 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN npm set progress=false && npm config set depth 0
RUN npm install
COPY . .
RUN touch .env && npm run build && npm prune --production && rm -rf ./node_modules/.cache

# run linters, setup and tests
# FROM buildenv AS test
# COPY . .
# RUN  npm run lint && npm run setup && npm run test

# 3) The build is done! Now we create a third image, based on the base image from the beginning.
#    In this third image, we extract only the minimal necessary set of files to run the app. The
#    result is what we will push to the registry.

FROM base AS release

COPY --from=buildenv /usr/app/package.json .
COPY --from=buildenv /usr/app/.env .
COPY --from=buildenv /usr/app/.env.example .
COPY --from=buildenv /usr/app/src ./src
COPY --from=buildenv /usr/app/node_modules ./node_modules

EXPOSE 3000

CMD npm run start