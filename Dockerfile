FROM node:20 AS builder

WORKDIR /app

ARG GITHUB_TOKEN
RUN echo "registry=https://registry.npmjs.org\n\
@gametheorygoodsgame:registry=https://npm.pkg.github.com\n\
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY src/public ./dist/src/public


RUN ls -la /app/dist

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app ./

RUN npm prune --production

EXPOSE 30167

CMD ["node", "dist/src/server.js"]
