FROM node:latest

WORKDIR '/broker-node-1'
COPY package.json .
RUN npm install
COPY  . .
CMD ["npm","start"]

