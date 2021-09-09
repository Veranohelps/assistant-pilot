FROM node:lts-slim AS builder

# Build time, non persistent environment variables
ARG NODE_ENV
ARG REACT_APP_ENV
ARG REACT_APP_API_BASE_URL

WORKDIR /home/dersu-admin-console

COPY package-lock.json package.lock.json
COPY package.json package.json
RUN npm install

COPY .prettierrc .prettierrc
COPY tsconfig.json tsconfig.json
COPY public public
COPY src src
RUN npm run build

CMD ["npm", "start"]

FROM nginx:1.19.2-alpine AS final
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /home/dersu-admin-console/build /usr/share/nginx/html
