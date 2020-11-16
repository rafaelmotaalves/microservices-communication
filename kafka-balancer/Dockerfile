FROM node:15.2.0-alpine3.10

WORKDIR /usr/src/app

# needed for running kakfa
RUN apk add openjdk8

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]