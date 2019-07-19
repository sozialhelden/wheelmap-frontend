FROM node:12 AS base

# Create app directory
WORKDIR /usr/app

# Add Tini / https://github.com/krallin/tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini.asc /tini.asc
RUN gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 595E85A6B1B4779EA4DAAEC70B588DFF0527A9B7 \
  && gpg --batch --verify /tini.asc /tini
RUN chmod +x /tini
# Set tini as entrypoint
ENTRYPOINT ["/tini", "--"]
# copy project file
COPY package.json .

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  htop \
  g++ \
  build-essential \
  make \
  gnupg2 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
RUN npm set progress=false && npm config set depth 0
# RUN npm install --only=production
# copy production node_modules aside
# RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

#
# ---- Test ----
# run linters, setup and tests
# FROM dependencies AS test
# COPY . .
# RUN  npm run lint && npm run setup && npm run test

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /usr/app/src/.next ./src/.next
COPY --from=dependencies /usr/app/node_modules ./node_modules
# expose port and define CMD
EXPOSE 3000
CMD npm run start