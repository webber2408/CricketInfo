const io = require("socket.io")(3001);
const ioClient = require("socket.io-client");
const {
  APIS,
  BN2URL_SOCKET,
  BN3URL_SOCKET,
  PUBLISHER1_URL,
} = require("./rendezvousConfig");
const { register } = require("./src/controller/authenticationController");
const { isTopicPresent } = require("./src/controller/topicController");
const { addTopicDataAndPublish } = require("./src/controller/topicController");
const { publishMessage } = require("./src/publishHelper/publishHelper");

// Keeps a list of all the neighbours
const NEIGHBOURS = {
  server2: {
    addr: BN2URL_SOCKET,
    title: "server2",
    socket: null,
  },
  server3: {
    addr: BN3URL_SOCKET,
    title: "server3",
    socket: null,
  },
  publisher1: {
    addr: PUBLISHER1_URL,
    title: "publisher1",
    socket: null,
  },
};

global.NEIGHBOUR1_SOCKETS = [];

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
        console.log("RECEIVED", topicId);
        if (cycleCount <= 3) {
          let status = await isTopicPresent(topicId);
          if (!status) {
            // Rendezvous to neighbours as topic not present in server1
            console.log("RENDEZVOUS TO SERVER 2 & SERVER 3");
            cycleCount += 1;
            global?.NEIGHBOUR1_SOCKETS?.forEach((socket) => {
              socket.emit("push_from_neighbour", {
                topicId,
                topicData,
                isAdvertisement,
                cycleCount,
              });
            });
          } else {
            console.log("FOUND @ SERVER 1");
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
              console.log("Did not register user on Server-1");
            } else {
              console.log("User registered on Server-1");
            }
            break;
        }
      }
    );
  });

  // Receive other neighbour connections as server
  io.on("connection", function (socket) {
    console.log("CONNECTED RECEIVED FROM => ", socket.client.id);
    global.NEIGHBOUR1_SOCKETS.push(socket);

    // global.NEIGHBOUR1_SOCKETS[0].emit("push_from_neighbour", {
    //   topicId: "80390cfe-7342-4af0-9e7b-27200bbefe21",
    //   topicData: null,
    //   isAdvertisement: false,
    // });
  });
  //
};

module.exports = { Rendezvous };
