FROM node:16.6.0-alpine
RUN yarn config set registry https://registry.npm.taobao.org
WORKDIR /code
COPY index.js .
COPY package.json .
COPY yarn.lock .
RUN yarn install
ENTRYPOINT node index.js
