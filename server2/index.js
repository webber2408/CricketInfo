const mongoose = require("mongoose");
const io = require("socket.io")(3002);
const ioClient = require("socket.io-client");
const fastify = require("fastify")({ logger: true });
const PublishHelper = require("./src/publishHelper/publishHelper");
const express = require("express");
const app = express();

const neighboursPort = {
    "Server2" : "8000",
    "Server3" : "9000"
}

const SERVER_PORT = 5002;

app.get("/", (req, res) => {
  res.send("Hello from Publisher-1");
});


// get data from the publisher
// export const isTopicPresent = createAsyncThunk(
//     "cricket/getAllTopics",
//     async (thunkApi) => {
//       const response = await api.get("/topic/all");
//       if (response.status == 400) {
//         return thunkApi.rejectWithValue({
//           errorMessage: "Error fetching the topics",
//         });
//       }
//       return response.data.data;
//     }
//   );




  
 

app.listen(SERVER_PORT, () => {
  console.log(`Server 2 started on port: ${SERVER_PORT}`);
  // var socketServer1 = ioClient.connect("http://cricket-api:3001/", {
    // DOCKER
    var socketServer1 = ioClient.connect("http://localhost:3001/", { // LOCAL
    reconnection: true,
  });

  
  // Getting Data from all of its client
    io.on("connection", function (socket) {
        console.log("CONNECTED to server 1 => ", socket.client.id);
        socket.on("push_to_server2", function(data) {
        console.log(data)
        //   await isTopicPresent(data);
        if(true){
          console.log(data)
          socketServer1.emit("push_to_server1", "world1");
        }else{
            console.log("Perform operation");
        }
        });

    });
    // socketServer1.emit("push_to_server1", "world1");
});




  


// //CORS
// fastify.register(require("fastify-cors"), {
//   origin: ["http://localhost:3000"],
//   method: ["GET", "POST", "PUT", "DELETE"],
// });

// //Routes
// const routes = require("./routes/route.js");
// const {
//   addTopicDataAndPublish,
// } = require("./src/controller/topicController.js");

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
// //   .connect("mongodb://mongo:27017/cricketInfo", {
//     // ON DOCKER
//     .connect("mongodb://localhost:27017/cricketInfo", {
//     // ON LOCAL
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
