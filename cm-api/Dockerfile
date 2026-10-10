FROM node:24-slim AS dependencies

WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS build
COPY . .
RUN pnpm build

FROM node:24-slim AS runtime

WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=build /app/dist ./dist
COPY .sequelizerc ./
COPY database ./database

ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["sh", "-c", "./node_modules/.bin/sequelize-cli db:migrate && ./node_modules/.bin/sequelize-cli db:seed:all && exec node dist/server.js"]
