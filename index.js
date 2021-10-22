const mongoose = require("mongoose");
var io = require("socket.io-client");
const fastify = require("fastify")({ logger: true });
const SERVER_PORT = 5000;

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

var socket = io.connect("http://localhost:3004/", {
  reconnection: true,
});

socket.on("connect", function () {
  console.log("connected to localhost:3004");
  socket.on("publisher1", function (data) {
    console.log("message from publisher 1:", data);
    // socket.emit("serverEvent", "thanks server! for sending '" + data + "'");
  });
});
