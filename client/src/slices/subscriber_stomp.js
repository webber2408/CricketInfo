import Stomp from "stompjs";
import store from "../store";
import socketIOClient from "socket.io-client";
import { addSelectedTopicData, addAdvertisement } from "./topicSlice";
import { END_POINT_SOCKET_IO } from "../apiClient/httpConfig";

var decoder = new TextDecoder("utf-8");

function ab2str(buf) {
  return decoder.decode(new Uint8Array(buf));
}

export function subscribeToTopic(topicId, isAdvertisement, callback) {
  // Project - 1 Phase - 2
  // var ws = new WebSocket("ws://localhost:15674/ws");
  // var stompClient = Stomp.over(ws);
  // stompClient.connect({}, function () {
  //   if (!isAdvertisement) {
  //     stompClient.subscribe("queue." + topicId, function (message) {
  //       store.dispatch(addSelectedTopicData(message.body));
  //       if (callback) callback();
  //     });
  //   } else {
  //     stompClient.subscribe("queue.advertisement", function (message) {
  //       store.dispatch(addAdvertisement(JSON.parse(message.body)));
  //       if (callback) callback();
  //     });
  //   }
  // });
  // Project 2
  const socket = socketIOClient(END_POINT_SOCKET_IO);
  // Request particular topic
  socket.emit("subscribe-topic", {
    topicId: topicId,
  });
  socket.on("kafka-message-" + topicId, ({ message }) => {
    // console.log(
    //   "KAFKA RESPONSE for Topic ID " + topicId,
    //   JSON.parse(ab2str(message))
    // );
    store.dispatch(addSelectedTopicData(ab2str(message)));
  });
}

// export function unsubscribeToTopic(topicId, isAdvertisement) {
//   if (isAdvertisement) {
//     stompClient.unsubscribe("queue.advertisement");
//   }
// }
