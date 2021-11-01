FROM node:latest

WORKDIR '/broker-node-3'
COPY package.json .
RUN npm install
COPY  . .
CMD ["npm","start"]

