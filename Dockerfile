# FROM --platform=$BUILDPLATFORM node:18-alpine as deps-prod
FROM node:18-alpine as deps-prod
WORKDIR /app
COPY ./package*.json ./
RUN npm install 

# FROM --platform=$BUILDPLATFORM node:18-alpine as builder
FROM node:18-alpine as builder
WORKDIR /app
COPY --from=deps-prod /app/node_modules ./node_modules/
COPY . .
RUN npm run build 

# FROM --platform=$BUILDPLATFORM node:18-alpine as runner
FROM node:18-alpine as runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY . .
COPY --from=deps-prod /app/node_modules ./node_modules
VOLUME [ "/static" ]
EXPOSE 3000
CMD ["node", "dist/main.js" ]