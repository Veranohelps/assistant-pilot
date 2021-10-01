FROM node:lts-slim AS builder

# See https://github.com/nestjs/nest-cli/issues/484
RUN apt update && apt install -y procps
RUN apt install -y netcat

WORKDIR /home/dersu-api

COPY wait-for wait-for
RUN chmod u+x wait-for

COPY yarn.lock yarn.lock
COPY package.json package.json
COPY .yarn/cache .yarn/cache/
COPY .yarn/releases .yarn/releases/
COPY .yarn/plugins .yarn/plugins/
COPY .yarnrc.yml .yarnrc.yml
COPY .pnp.cjs .pnp.cjs

COPY .eslintrc.js .eslintrc.js
COPY .prettierrc .prettierrc
COPY knexfile.ts knexfile.ts
COPY nest-cli.json nest-cli.json
COPY tsconfig.build.json tsconfig.build.json
COPY tsconfig.json tsconfig.json
COPY src src

CMD ["./wait-for", "database:5432", "--", "yarn", "start:dev"]

FROM node:lts-slim AS final
RUN apt update && apt install -y procps
RUN apt install -y netcat
COPY --from=builder /home/dersu-api /home/dersu-api
WORKDIR /home/dersu-api

RUN yarn build
CMD ["yarn", "start:prod"]
