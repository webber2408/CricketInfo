const mongoose = require("mongoose");
const io = require("socket.io")(3001);
const ioClient = require("socket.io-client");
const fastify = require("fastify")({ logger: true });
const { isTopicPresent } = require("../server1/src/controller/topicController");
const { addTopicDataAndPublish } = require("./src/controller/topicController");

const neighboursPort = {
  Server2: "8000",
  Server3: "9000",
};

const SERVER_PORT = 5001;

const server1Rendezvous = () => {
  console.log(`Server 1 started on port: ${SERVER_PORT}`);

  //   var socketServer2 = ioClient.connect("http://cricket-api:3002/", {
  // DOCKER
  var socketServer2 = ioClient.connect("http://localhost:3002/", {
    // LOCAL
    reconnection: true,
  });

  //   var socketServer3 = ioClient.connect("http://cricket-api:3003/", {
  // DOCKER
  var socketServer3 = ioClient.connect("http://localhost:3003/", {
    // LOCAL
    reconnection: true,
  });
  // var dummy = {
  //   topicId: "406dc390-7342-4880-b2ba-6ab64306bea1",
  //   topicData: ["I am from server 1"],
  //   isAdvertisement: true,
  // };
  // socketServer2.emit("push_to_node_broker2", dummy);
  //   Getting Data from all of its client
  io.on("connection", function (socket) {
    console.log("CONNECTED to Server 2 => ", socket.client.id);
    socket.on(
      "push_to_node_broker1",
      async ({ topicID, topicData, isAdvertisement }) => {
        console.log("Topic ID", topicID);
        let status = await isTopicPresent(topicID);
        console.log("STATUS", status);
        if (!status) {
          console.log(topicData);
          socketServer2.emit("push_to_node_broker2", {
            topicID,
            topicData,
            isAdvertisement,
          });
          socketServer3.emit("push_to_node_broker3", {
            topicID,
            topicData,
            isAdvertisement,
          });
        } else {
          console.log("found");
          addTopicDataAndPublish(topicID, topicData);
        }
      }
    );
  });
};

// //CORS
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
        server1Rendezvous();
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
