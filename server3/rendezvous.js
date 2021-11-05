const io = require("socket.io")(3003);
const ioClient = require("socket.io-client");
const {
  APIS,
  BN1URL_SOCKET,
  BN2URL_SOCKET,
  PUBLISHER3_URL,
} = require("./rendezvousConfig");
const { register } = require("./src/controller/authenticationController");
const { isTopicPresent } = require("./src/controller/topicController");
const { addTopicDataAndPublish } = require("./src/controller/topicController");

const NEIGHBOURS = {
  server1: {
    addr: BN1URL_SOCKET,
    title: "server1",
    socket: null,
  },
  server2: {
    addr: BN2URL_SOCKET,
    title: "server2",
    socket: null,
  },
  publisher3: {
    addr: PUBLISHER3_URL,
    title: "publisher3",
    socket: null,
  },
};

global.NEIGHBOUR3_SOCKETS = [];

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
        let status = await isTopicPresent(topicId);
        if (cycleCount <= 3) {
          if (!status) {
            // Rendezvous to neighbours as topic not present in server3
            console.log("RENDEZVOUS TO SERVER 1 & SERVER 2");
            cycleCount += 1;
            global?.NEIGHBOUR3_SOCKETS?.forEach((socket) => {
              socket.emit("push_from_neighbour", {
                topicId,
                topicData,
                isAdvertisement,
                cycleCount,
              });
            });
          } else {
            console.log("FOUND @ SERVER 3");
            if (!isAdvertisement) {
              addTopicDataAndPublish(topicId, topicData);
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
              console.log("Did not register user on Server-3");
            } else {
              console.log("User registered on Server-3");
            }
            break;
        }
      }
    );
  });

  // Receive other neighbour connections as server
  io.on("connection", function (socket) {
    console.log("CONNECTED RECEIVED FROM => ", socket.client.id);
    global.NEIGHBOUR3_SOCKETS.push(socket);
  });
  //
};

module.exports = { Rendezvous };
