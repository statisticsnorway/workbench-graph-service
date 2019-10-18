FROM node:current-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY src ./src
COPY docker-entrypoint.sh .
COPY index.js .

EXPOSE 8005

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]