FROM node:18-alpine

WORKDIR /opt/build

COPY package.json ./
COPY yarn.lock ./

ENV NODE_ENV production

RUN yarn --prod --ignore-scripts

COPY . .

EXPOSE 3000

ENTRYPOINT [ "node", "server.js" ]
