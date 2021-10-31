const io = require("socket.io")(3002);
const ioClient = require("socket.io-client");
const { APIS } = require("./rendezvousConfig");
const { register } = require("./src/controller/authenticationController");
const { isTopicPresent } = require("./src/controller/topicController");
const { addTopicDataAndPublish } = require("./src/controller/topicController");

const NEIGHBOURS = {
  server1: {
    addr: "http://localhost:3001/", // ON LOCAL
    // addr: "http://docker-name:3001/", // ON DOCKER
    title: "server1",
    socket: null,
  },
  server3: {
    addr: "http://localhost:3003/", // ON LOCAL
    // addr: "http://docker-name:3003/", // ON DOCKER
    title: "server3",
    socket: null,
  },
};

global.NEIGHBOUR2_SOCKETS = [];

const Rendezvous = () => {
  // Connect to other servers as client
  Object.values(NEIGHBOURS).forEach((neighbour) => {
    NEIGHBOURS[neighbour.title].socket = ioClient.connect(neighbour.addr, {
      reconnection: true,
    });
  });
  Object.values(NEIGHBOURS).forEach(({ socket }) => {
    // PUBLISHER PUSH
    socket.on(
      "push_from_neighbour",
      async ({ topicId, topicData, isAdvertisement }) => {
        console.log("TOPICID", topicId);
        let status = await isTopicPresent(topicId);
        if (!status) {
          // Rendezvous to neighbours as topic not present in server2
          console.log("RENDEZVOUS TO SERVER 1 & SERVER 3");
          global?.NEIGHBOUR2_SOCKETS?.forEach((socket) => {
            socket.emit("push_from_neighbour", {
              topicId,
              topicData,
              isAdvertisement,
            });
          });
        } else {
          console.log("FOUND @ SERVER 2");
          addTopicDataAndPublish(topicId, topicData);
        }
      }
    );

    // SUBSCRIBER PUSH
    socket.on(
      "push_from_neighbour_for_subscriber",
      async ({ apiCall, apiReq }) => {
        switch (apiCall) {
          case APIS.REGISTER:
            const result = await register(apiReq);
            if (result && result.success != 200) {
              console.log("Did not register user on Server-2");
            } else {
              console.log("User registered on Server-2");
            }
            break;
        }
      }
    );
  });

  // Receive other neighbour connections as server
  io.on("connection", function (socket) {
    console.log("CONNECTED RECEIVED FROM => ", socket.client.id);
    global.NEIGHBOUR2_SOCKETS.push(socket);
  });
  //
};

module.exports = { Rendezvous };
