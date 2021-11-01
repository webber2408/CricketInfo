FROM node:latest

WORKDIR '/broker-node-2'
COPY package.json .
RUN npm install
COPY  . .
CMD ["npm","start"]

