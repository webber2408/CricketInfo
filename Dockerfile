FROM node:latest

WORKDIR '/cricket-api'
COPY package.json .
RUN npm install
COPY  . .
CMD ["npm","start"]

