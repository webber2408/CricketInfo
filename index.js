const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
// const { v4: uuidv4 } = require('uuid');
const fastify = require("fastify")({ logger: true });
const SERVER_PORT = 5000;

// //CORS
// fastify.register(require("fastify-cors"), {
//   origin: ["http://localhost:3000"],
//   method: ["GET", "POST", "PUT", "DELETE"],
// });

// //Routes
// const routes = require("./routes/route.js");

// Object.values(routes).forEach((item) => {
//   item.forEach((route) => {
//     fastify.route(route);
//   });
// });

// fastify.get("/", (req, res) => {
//   res.send("Cricket Information Server Started");
// });

// //MongoDB
// mongoose
//   .connect("mongodb://mongo:27017/cricketInfo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB Connected");
//   })
//   .catch((err) => {
//     console.log("Error connecting mongodb");
//     console.log(err);
//   });

// //Server
// const start = async () => {
//   try {
//     fastify
//       .listen(SERVER_PORT, "0.0.0.0")
//       .then((address) => {
//         console.log(`Server started at ${address}`);
//       })
//       .catch((err) => {
//         console.log("Error starting server: " + err);
//         process.exit(1);
//       });
//   } catch {
//     fastify.log.error("Error");
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };

// start();

var io = require("socket.io-client");
var socket = io.connect("http://localhost:3000/", {
  reconnection: true,
});

socket.on("connect", function () {
  console.log("connected to localhost:3000");
  socket.on("publisher1", function (data) {
    console.log("message from publisher 1:", data);
    // socket.emit("serverEvent", "thanks server! for sending '" + data + "'");
  });
});

var io2 = require("socket.io-client");
var socket2 = io2.connect("http://localhost:3001/", {
  reconnection: true,
});

socket2.on("connect", function () {
  console.log("connected to localhost:3001");
  socket2.on("publisher2", function (data) {
    console.log("message from the publisher 2:", data);
    // socket.emit("serverEvent", "thanks server! for sending '" + data + "'");
  });
});
