const mongoose = require("mongoose");
const { Rendezvous } = require("./rendezvous");
const { CLIENT_URL, MongoURL, SERVER_PORT } = require("./rendezvousConfig");
const fastify = require("fastify")({ logger: true });

//CORS
fastify.register(require("fastify-cors"), {
  origin: [CLIENT_URL],
  method: ["GET", "POST", "PUT", "DELETE"],
});

//Routes
const routes = require("./routes/route.js");

// Mapping fastify routes
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
  .connect(MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Error connecting mongodb");
    console.log(err);
    process.exit(1);
  });

//Server
const start = async () => {
  try {
    fastify
      .listen(SERVER_PORT, "0.0.0.0")
      .then((address) => {
        console.log(`Server started at ${address}`);
        Rendezvous();
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
//       PublishHelper.publishMessageHelper("advertisement", {
//         ...topicData,
//         isAdvertisement,
//       });
//     }
//   });
// });
