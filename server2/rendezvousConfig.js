// RAW
const APIS = {
  REGISTER: "REGISTER",
};
const brokerNodes = {
  Node1: {
    local: "localhost",
    docker: "broker-node-1",
    port: "5001",
    socketPort: "3001",
  },
  Node3: {
    local: "localhost",
    docker: "broker-node-3",
    port: "5003",
    socketPort: "3003",
  },
};
const otherNodes = {
  Mongo: {
    local: "localhost",
    docker: "mongo",
    port: "27017",
  },
  RabbitMQ: {
    local: "localhost",
    docker: "rabbitmq",
    port: "5672",
  },
};
const currentEnv = "docker"; // 'docker'
const CLIENT_URL = `http://localhost:3000`;
const SERVER_PORT = "5002";

// DERIVED
const BN1URL = `http://${brokerNodes.Node1[currentEnv]}:${brokerNodes.Node1.port}`;
const BN3URL = `http://${brokerNodes.Node3[currentEnv]}:${brokerNodes.Node3.port}`;
const BN1URL_SOCKET = `http://${brokerNodes.Node1[currentEnv]}:${brokerNodes.Node1.socketPort}/`;
const BN3URL_SOCKET = `http://${brokerNodes.Node3[currentEnv]}:${brokerNodes.Node3.socketPort}/`;
const MongoURL = `mongodb://${otherNodes.Mongo[currentEnv]}:${otherNodes.Mongo.port}/cricketInfo`;
const RabbitMQURL = `amqp://${otherNodes.RabbitMQ[currentEnv]}:${otherNodes.RabbitMQ.port}`;

//EXPORTS
module.exports = {
  APIS,
  brokerNodes,
  currentEnv,
  BN1URL,
  BN3URL,
  CLIENT_URL,
  otherNodes,
  MongoURL,
  SERVER_PORT,
  BN1URL_SOCKET,
  BN3URL_SOCKET,
  RabbitMQURL,
};
