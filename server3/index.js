const mongoose = require("mongoose");
const io = require("socket.io")(3003);
const ioClient = require("socket.io-client");
const fastify = require("fastify")({ logger: true });
const { isTopicPresent } = require("../server3/src/controller/topicController");
const SERVER_PORT = 5003;

const server3Rendezvous = () => {
  console.log(`Server 3 started on port: ${SERVER_PORT}`);
  // var socketServer1 = ioClient.connect("http://cricket-api:3001/", {
  // DOCKER
  var socketServer1 = ioClient.connect("http://localhost:3001/", {
    // LOCAL
    reconnection: true,
  });
  // var socketServer3 = ioClient.connect("http://cricket-api:3001/", {
  // DOCKER
  var socketServer2 = ioClient.connect("http://localhost:3002/", {
    // LOCAL
    reconnection: true,
  });

  var dummy = {
    topicId: "e2bb856b-90e0-4242-9cd6-f702450dbae6",
    topicData: "I am from server 3",
    isAdvertisement: true,
  };
  socketServer1.emit("push_to_node_broker1", dummy);
  // Getting Data from all of its client
  io.on("connection", function (socket) {
    console.log("CONNECTED to server 3 => ", socket.client.id);
    socket.on(
      "push_to_node_broker3",
      async ({ topicId, topicData, isAdvertisement }) => {
        let status = await isTopicPresent(topicId);

        if (!status) {
          console.log(topicData);
          socketServer1.emit("push_to_node_broker1", {
            topicId,
            topicData,
            isAdvertisement,
          });
          socketServer2.emit("push_to_node_broker2", {
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
  // socketServer1.emit("push_to_server1", "world1");
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

//MongoDB
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
        server3Rendezvous();
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

// // Publisher Connection & Updation
// io.on("connection", function (socket) {
//   console.log("CONNECTED PUBLISHER => ", socket.client.id);
//   socket.on("publisher_push", ({ topicId, topicData, isAdvertisement }) => {
//     console.log("PUBLISHER DATA", topicData);
//     if (!isAdvertisement) {
//       addTopicDataAndPublish(topicId, topicData);
//     } else {
//       // console.log("HERE");
//       PublishHelper.publishMessage("advertisement", {
//         ...topicData,
//         isAdvertisement,
//       });
//     }
//   });
// });
