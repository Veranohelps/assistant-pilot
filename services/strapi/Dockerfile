FROM strapi/strapi:3.6.8-node14-alpine AS builder

WORKDIR /srv/app

COPY package.json package.json
COPY yarn.lock yarn.lock 
RUN yarn

COPY config config
COPY api api
COPY extensions extensions
COPY public public
COPY .eslintignore .eslintignore
COPY favicon.ico favicon.ico

CMD ["yarn", "develop"]

FROM strapi/strapi:3.6.8-node14-alpine AS final
COPY --from=builder /srv/app /srv/app
WORKDIR /srv/app
RUN NODE_ENV=production yarn build
CMD ["yarn", "start"]
