const mongoose = require("mongoose");
const { Kafka } = require("kafkajs");
const io = require("socket.io")(5004, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const fastify = require("fastify")({ logger: true });
const PublishHelper = require("./src/publishHelper/publishHelper");

const SERVER_PORT = 5000;

//CORS
fastify.register(require("fastify-cors"), {
  origin: ["http://localhost:3000"],
  method: ["GET", "POST", "PUT", "DELETE"],
});

//Routes
const routes = require("./routes/route.js");
const {
  addTopicDataAndPublish,
} = require("./src/controller/topicController.js");

Object.values(routes).forEach((item) => {
  item.forEach((route) => {
    fastify.route(route);
  });
});

fastify.get("/", (req, res) => {
  res.send("Cricket Information Server Started");
});

//MongoDB
mongoose
  .connect("mongodb://mongo:27017/cricketInfo", {
    // ON DOCKER
    // .connect("mongodb://localhost:27017/cricketInfo", {
    // ON LOCAL
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Error connecting mongodb");
    console.log(err);
  });

//Server
const start = async () => {
  try {
    fastify
      .listen(SERVER_PORT, "0.0.0.0")
      .then((address) => {
        console.log(`Server started at ${address}`);
      })
      .catch((err) => {
        console.log("Error starting server: " + err);
        process.exit(1);
      });
  } catch {
    fastify.log.error("Error");
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

const getKafka1Data = async (callback) => {
  var kafka = new Kafka({
    clientId: "myapp-1",
    brokers: ["kafka-1:9092"],
  });

  var consumer = kafka.consumer({ groupId: "test-1" + Date.now() });
  await consumer.connect();
  // Topic 5
  await consumer.subscribe({
    topic: "175bebb4-e985-497c-80be-784c687340c0",
    fromBeginning: true,
  });

  return await consumer.run({
    eachMessage: async (result) => {
      console.log(
        `RCVD Msg ${result.message.value} on partition ${result.partition}`
      );
      callback(result.message.value);
    },
  });
};

const getKafka2Data = async (callback) => {
  var kafka = new Kafka({
    clientId: "myapp-2",
    brokers: ["kafka-2:9093"],
  });

  var consumer = kafka.consumer({ groupId: "test-2" + Date.now() });
  await consumer.connect();
  // Topic 4
  await consumer.subscribe({
    topic: "e0f68c60-cce3-4b18-8404-8145c1465108",
    fromBeginning: true,
  });

  return await consumer.run({
    eachMessage: async (result) => {
      console.log(
        `RCVD Msg ${result.message.value} on partition ${result.partition}`
      );
      callback(result.message.value);
    },
  });
};

const getKafka3Data = async (callback) => {
  var kafka = new Kafka({
    clientId: "myapp-3",
    brokers: ["kafka-3:9094"],
  });

  var consumer = kafka.consumer({ groupId: "test-3" + Date.now() });
  await consumer.connect();

  // Topic 2
  await consumer.subscribe({
    topic: "46b70ec9-3e91-441c-98d0-21942fc410b0",
    fromBeginning: true,
  });

  return await consumer.run({
    eachMessage: async (result) => {
      console.log(
        `RCVD Msg ${result.message.value} on partition ${result.partition}`
      );
      callback(result.message.value);
    },
  });
};

// Publisher Connection & Updation
io.on("connection", function (socket) {
  console.log("CONNECTED CLIENT => ", socket.client.id);
  socket.on("subscribe-topic", ({ topicId }) => {
    console.log("SUBSCRIBE REQUEST FOR TOPIC " + topicId);
    switch (topicId) {
      case "175bebb4-e985-497c-80be-784c687340c0":
        getKafka1Data((message) => {
          console.log("RECEIVED MESSAGE " + message);
          socket.emit("kafka-message-" + topicId, {
            message: message,
          });
        });
        break;
      case "e0f68c60-cce3-4b18-8404-8145c1465108":
        getKafka2Data((message) => {
          console.log("RECEIVED MESSAGE " + message);
          socket.emit("kafka-message-" + topicId, {
            message: message,
          });
        });
        break;
      case "46b70ec9-3e91-441c-98d0-21942fc410b0":
        getKafka3Data((message) => {
          console.log("RECEIVED MESSAGE " + message);
          socket.emit("kafka-message-" + topicId, {
            message: message,
          });
        });
        break;
    }
  });
});
