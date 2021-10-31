const io = require("socket.io")(3003);
const ioClient = require("socket.io-client");
const { isTopicPresent } = require("./src/controller/topicController");
const { addTopicDataAndPublish } = require("./src/controller/topicController");

const NEIGHBOURS = {
  server1: {
    addr: "http://localhost:3001/", // ON LOCAL
    // addr: "http://docker-name:3001/", // ON DOCKER
    title: "server1",
    socket: null,
  },
  server2: {
    addr: "http://localhost:3002/", // ON LOCAL
    // addr: "http://docker-name:3002/", // ON DOCKER
    title: "server2",
    socket: null,
  },
};

module.exports.Rendezvous = () => {
  // Make Connections
  Object.values(NEIGHBOURS).forEach((neighbour) => {
    NEIGHBOURS[neighbour.title].socket = ioClient.connect(neighbour.addr, {
      reconnection: true,
    });
  });

  io.on("connection", function (socket) {
    console.log("CONNECTED RECEIVED FROM => ", socket.client.id);
    socket.on(
      "push_from_neighbour",
      async ({ topicId, topicData, isAdvertisement }) => {
        let status = await isTopicPresent(topicId);
        if (!status) {
          // Rendezvous to neighbours as topic not present in server3
          console.log("RENDEZVOUS TO SERVER 1 & SERVER 2");
          Object.values(NEIGHBOURS).forEach((neighbour) => {
            neighbour.socket &&
              neighbour.socket.emit("push_from_neighbour", {
                topicId,
                topicData,
                isAdvertisement,
              });
          });
        } else {
          console.log("FOUND @ SERVER 3");
          addTopicDataAndPublish(topicId, topicData);
        }
      }
    );
  });

  var dummy = {
    topicId: "e2bb856b-90e0-4242-9cd6-f702450dbae6",
    topicData: "I am from server 3",
    isAdvertisement: true,
  };
  NEIGHBOURS.server1?.socket?.emit("push_from_neighbour", dummy);
};
