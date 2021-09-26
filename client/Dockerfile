FROM node:latest

WORKDIR '/cricket-client'
COPY package.json .
RUN npm install
COPY  . .
CMD ["npm","start"]

