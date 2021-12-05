FROM node:latest

WORKDIR '/consumer-1'
COPY package.json .
RUN npm install
COPY  . .
CMD ["node","index.js"]

