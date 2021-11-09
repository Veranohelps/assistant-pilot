FROM node:lts-slim AS builder

# Build time, non persistent environment variables
ARG NODE_ENV
ARG REACT_APP_ENV
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_AUDIENCE

WORKDIR /home/dersu-admin-console

COPY yarn.lock yarn.lock
COPY package.json package.json
COPY .yarn/cache .yarn/cache/
COPY .yarn/releases .yarn/releases/
COPY .yarn/plugins .yarn/plugins/
COPY .yarnrc.yml .yarnrc.yml
COPY .pnp.cjs .pnp.cjs

COPY .prettierrc .prettierrc
COPY tsconfig.json tsconfig.json
COPY craco.config.js craco.config.js
COPY public public
COPY src src

RUN yarn build

CMD ["yarn", "start"]

FROM nginx:1.19.2-alpine AS final
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /home/dersu-admin-console/build /usr/share/nginx/html
