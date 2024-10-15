FROM node:20.11-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build
RUN npm prune --prod

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "build" ]