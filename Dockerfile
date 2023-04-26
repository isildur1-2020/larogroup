FROM node:18-alpine
WORKDIR /root/laroaccess
COPY . .
RUN npm i -g @nestjs/cli
RUN npm i --omit=dev
RUN npm run build
USER node
CMD ["npm", "run", "start:prod"]
