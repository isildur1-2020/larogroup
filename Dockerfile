FROM node:18-alpine as dev
WORKDIR /app
COPY ./package.json ./
RUN yarn install --frozen-lockfile
CMD ["yarn", "start:dev"]

# FROM --platform=$BUILDPLATFORM node:18-alpine as deps-prod
FROM node:18-alpine as deps-prod
WORKDIR /app
COPY ./package.json ./
RUN yarn install --frozen-lockfile

# FROM --platform=$BUILDPLATFORM node:18-alpine as builder
FROM node:18-alpine as builder
WORKDIR /app
COPY --from=deps-prod /app/node_modules ./node_modules
COPY . .
RUN yarn build 

# FROM --platform=$BUILDPLATFORM node:18-alpine as runner
FROM node:18-alpine as prod
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps-prod /app/node_modules ./node_modules
VOLUME [ "/static" ]
CMD ["node", "dist/main" ]