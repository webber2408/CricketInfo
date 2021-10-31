const io = require("socket.io")(3001);
const ioClient = require("socket.io-client");
const { isTopicPresent } = require("./src/controller/topicController");
const { addTopicDataAndPublish } = require("./src/controller/topicController");

const NEIGHBOURS = {
  server2: {
    addr: "http://localhost:3002/", // ON LOCAL
    // addr: "http://docker-name:3002/", // ON DOCKER
    title: "server2",
    socket: null,
  },
  server3: {
    addr: "http://localhost:3003/", // ON LOCAL
    // addr: "http://docker-name:3003/", // ON DOCKER
    title: "server3",
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
          // Rendezvous to neighbours as topic not present in server1
          console.log("RENDEZVOUS TO SERVER 2 & SERVER 3");
          Object.values(NEIGHBOURS).forEach((neighbour) => {
            neighbour.socket &&
              neighbour.socket.emit("push_from_neighbour", {
                topicId,
                topicData,
                isAdvertisement,
              });
          });
        } else {
          console.log("FOUND @ SERVER 1");
          addTopicDataAndPublish(topicId, topicData);
        }
      }
    );
  });
};
