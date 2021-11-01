// RAW
const APIS = {
  REGISTER: "REGISTER",
};
const brokerNodes = {
  Node2: {
    local: "localhost",
    docker: "broker-node-2",
    port: "5002",
    socketPort: "3002",
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
const SERVER_PORT = "5001";
const PUBLISHER1_URL = "http://cricket-api-publisher-1:7001";

// DERIVED
const BN2URL = `http://${brokerNodes.Node2[currentEnv]}:${brokerNodes.Node2.port}`;
const BN3URL = `http://${brokerNodes.Node3[currentEnv]}:${brokerNodes.Node3.port}`;
const BN2URL_SOCKET = `http://${brokerNodes.Node2[currentEnv]}:${brokerNodes.Node2.socketPort}/`;
const BN3URL_SOCKET = `http://${brokerNodes.Node3[currentEnv]}:${brokerNodes.Node3.socketPort}/`;
const MongoURL = `mongodb://${otherNodes.Mongo[currentEnv]}:${otherNodes.Mongo.port}/cricketInfo`;
const RabbitMQURL = `amqp://${otherNodes.RabbitMQ[currentEnv]}:${otherNodes.RabbitMQ.port}`;

//EXPORTS
module.exports = {
  APIS,
  brokerNodes,
  currentEnv,
  BN2URL,
  BN3URL,
  CLIENT_URL,
  otherNodes,
  MongoURL,
  SERVER_PORT,
  BN2URL_SOCKET,
  BN3URL_SOCKET,
  PUBLISHER1_URL,
  RabbitMQURL,
};
