import Stomp from "stompjs";
import store from "../store";
import { addSelectedTopicData, addAdvertisement } from "./topicSlice";

export function subscribeToTopic(topicId, isAdvertisement, callback) {
  var ws = new WebSocket("ws://localhost:15674/ws");
  var stompClient = Stomp.over(ws);
  stompClient.connect({}, function () {
    if (!isAdvertisement) {
      stompClient.subscribe("queue." + topicId, function (message) {
        store.dispatch(addSelectedTopicData(JSON.parse(message.body)));
        if (callback) callback();
      });
    } else {
      stompClient.subscribe("queue.advertisement", function (message) {
        store.dispatch(addAdvertisement(JSON.parse(message.body)));
        if (callback) callback();
      });
    }
  });
}

// export function unsubscribeToTopic(topicId, isAdvertisement) {
//   if (isAdvertisement) {
//     stompClient.unsubscribe("queue.advertisement");
//   }
// }
