FROM node:lts-slim AS builder

WORKDIR /home/dersu-api

COPY package-lock.json package.lock.json
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm install

COPY src src
COPY static static
RUN npm run build:production

CMD ["npm", "start"]

# PRODUCTION IMAGE
FROM node:lts-alpine AS production

WORKDIR /home/dersu-api

COPY --from=builder /home/dersu-api/node_modules /home/dersu-api/node_modules
COPY --from=builder /home/dersu-api/build /home/dersu-api/build
COPY --from=builder /home/dersu-api/package.json /home/dersu-api/package.json

CMD ["npm", "run", "start:production"]
