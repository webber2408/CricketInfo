const mongoose = require("mongoose");
var io = require("socket.io")(3004);
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
  // .connect("mongodb://mongo:27017/cricketInfo", {
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

// Publisher Connection & Updation
io.on("connection", function (socket) {
  console.log("CONNECTED PUBLISHER => ", socket.client.id);
  socket.on("publisher_push", ({ topicId, topicData, isAdvertisement }) => {
    console.log("PUBLISHER DATA", topicData);
    if (!isAdvertisement) {
      addTopicDataAndPublish(topicId, topicData);
    } else {
      // console.log("HERE");
      PublishHelper.publishMessage("advertisement", {
        ...topicData,
        isAdvertisement,
      });
    }
  });
});
