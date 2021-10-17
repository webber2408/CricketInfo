import Stomp from "stompjs";
import store from "../store";
import { addSelectedTopicData } from "./topicSlice";

export function subscribeToTopic(topicId) {
  var ws = new WebSocket("ws://localhost:15674/ws");
  let stompClient = Stomp.over(ws);
  stompClient.connect({}, function () {
    stompClient.subscribe("queue." + topicId, function (message) {
      store.dispatch(addSelectedTopicData(message.body));
    });
  });
}
