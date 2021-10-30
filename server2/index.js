const mongoose = require("mongoose");
const io = require("socket.io")(3002);
const ioClient = require("socket.io-client");
const fastify = require("fastify")({ logger: true });
const { isTopicPresent } = require("../server2/src/controller/topicController");
const express = require("express");
const app = express();

const neighboursPort = {
  Server2: "8000",
  Server3: "9000",
};

const SERVER_PORT = 5002;

app.get("/", (req, res) => {
  res.send("Hello from Publisher-1");
});

const server2Rendezvous = () => {
  console.log(`Server 2 started on port: ${SERVER_PORT}`);
  // var socketServer1 = ioClient.connect("http://cricket-api:3001/", {
  // DOCKER
  var socketServer1 = ioClient.connect("http://localhost:3001/", {
    // LOCAL
    reconnection: true,
  });
  // var socketServer3 = ioClient.connect("http://cricket-api:3001/", {
  // DOCKER
  var socketServer3 = ioClient.connect("http://localhost:3003/", {
    // LOCAL
    reconnection: true,
  });

  // var dummy = {
  //   topicId: "406dc390-7342-4880-b2ba-6ab64306bea1",
  //   topicData: "I am from server 2",
  //   isAdvertisement: true,
  // };
  // socketServer1.emit("push_to_node_broker1", dummy);
  // Getting Data from all of its client
  io.on("connection", function (socket) {
    console.log("CONNECTED to server 2 => ", socket.client.id);
    socket.on(
      "push_to_node_broker2",
      async ({ topicId, topicData, isAdvertisement }) => {
        let status = await isTopicPresent(topicId);
        console.log("STATUS ", status);
        if (!status) {
          console.log(topicData);
          socketServer1.emit("push_to_node_broker1", {
            topicId,
            topicData,
            isAdvertisement,
          });
          socketServer3.emit("push_to_node_broker3", {
            topicId,
            topicData,
            isAdvertisement,
          });
        } else {
          console.log("Perform operation");
        }
      }
    );
  });
};

//CORS
fastify.register(require("fastify-cors"), {
  origin: ["http://localhost:3000"],
  method: ["GET", "POST", "PUT", "DELETE"],
});

//Routes
const routes = require("./routes/route.js");

Object.values(routes).forEach((item) => {
  item.forEach((route) => {
    fastify.route(route);
  });
});

fastify.get("/", (req, res) => {
  res.send("Cricket Information Server Started");
});

// //MongoDB
mongoose
  //   .connect("mongodb://mongo:27017/cricketInfo", {
  // ON DOCKER
  .connect("mongodb://localhost:27017/cricketInfo", {
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
        server2Rendezvous();
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
