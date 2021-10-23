FROM node:latest

WORKDIR '/cricket-api-publisher-3'
COPY package.json .
RUN npm install
COPY  . .
CMD ["node","index.js"]


