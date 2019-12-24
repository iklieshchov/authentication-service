# DEV
FROM node:13.2.0-alpine3.10 as DEV

RUN npm install -g nodemon

COPY package.json package.json
RUN npm i
COPY ./src /src

ENTRYPOINT [ "nodemon", "--inspect=0.0.0.0", "--watch", "src", "src/index.js" ]

# PRE_PROD
FROM node:13.2.0-alpine3.10 as PRE_PROD
COPY --from=DEV /node_modules /node_modules
RUN npm prune --production

# PROD
FROM node:13.2.0-alpine3.10 as PROD
COPY --from=PRE_PROD /node_modules /node_modules
COPY --from=DEV /src /src

ENV NODE_ENV=production

ENTRYPOINT [ "node", "src/index.js" ]
