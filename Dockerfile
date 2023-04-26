FROM node:18-alpine
WORKDIR /root/laroaccess
COPY . .
RUN npm ci --omit=dev
RUN npm run build
USER node
CMD ["npm", "run", "start:prod"]
