const io = require("socket.io")(3002);
const ioClient = require("socket.io-client");
const {
  APIS,
  BN1URL_SOCKET,
  BN3URL_SOCKET,
  PUBLISHER2_URL,
} = require("./rendezvousConfig");
const { register } = require("./src/controller/authenticationController");
const { isTopicPresent } = require("./src/controller/topicController");
const { addTopicDataAndPublish } = require("./src/controller/topicController");
const { publishMessage } = require("./src/publishHelper/publishHelper");

// Keeps a list of all the neighbours
const NEIGHBOURS = {
  server1: {
    addr: BN1URL_SOCKET,
    title: "server1",
    socket: null,
  },
  server3: {
    addr: BN3URL_SOCKET,
    title: "server3",
    socket: null,
  },
  publisher2: {
    addr: PUBLISHER2_URL,
    title: "publisher2",
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
      async ({ topicId, topicData, isAdvertisement, cycleCount }) => {
        console.log("TOPICID", topicId);
        let status = await isTopicPresent(topicId);
        if (cycleCount <= 3) {
          if (!status) {
            // Rendezvous to neighbours as topic not present in server2
            console.log("RENDEZVOUS TO SERVER 1 & SERVER 3");
            cycleCount += 1;
            global?.NEIGHBOUR2_SOCKETS?.forEach((socket) => {
              socket.emit("push_from_neighbour", {
                topicId,
                topicData,
                isAdvertisement,
                cycleCount,
              });
            });
          } else {
            console.log("CYCLECOUNT => ", cycleCount);
            console.log("FOUND @ SERVER 2");
            if (!isAdvertisement) {
              addTopicDataAndPublish(topicId, topicData);
            } else {
              publishMessage("advertisement", topicData);
            }
          }
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
