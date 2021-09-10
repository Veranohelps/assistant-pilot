FROM node:lts-slim AS builder

# See https://github.com/nestjs/nest-cli/issues/484
RUN apt update && apt install -y procps

WORKDIR /home/dersu-api

COPY package-lock.json package.lock.json
COPY package.json package.json
RUN npm install

COPY .eslintrc.js .eslintrc.js
COPY .prettierrc .prettierrc
COPY knexfile.ts knexfile.ts
COPY nest-cli.json nest-cli.json
COPY tsconfig.build.json tsconfig.build.json
COPY tsconfig.json tsconfig.json
COPY static static
COPY src src

RUN npm run build

CMD ["npm", "run", "start"]

# FROM node:lts-slim
# COPY --from=builder /home/dersu-api/dist /home/dersu-api
# WORKDIR /home/dersu-api
# CMD ["node", "dist/src/main.js"]
