import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToTopic } from "../../slices/subscriber_stomp";
import { addSelectedTopicData, selectTopic } from "../../slices/topicSlice";

import "./topicDetail.css";

const TopicDetail = () => {
  const dispatch = useDispatch();
  const topic = useSelector((state) => state.topic.selectedTopic);
  const topicLiveData = useSelector((state) => state.topic.selectedTopicData);

  useEffect(() => {
    if (topic) {
      subscribeToTopic(topic.topicId);
    }
    return () => {
      dispatch(addSelectedTopicData(null));
      dispatch(selectTopic(null));
    };
  }, []);

  useEffect(() => {
    console.log("SELECTED TOPIC DATA", topicLiveData);
  }, [topicLiveData]);

  if (!topic) return <></>;

  return (
    <div className="topicDetail">
      <div className="topicDetail__heading">
        <h2>{topic.topicName}</h2>
      </div>
      <p>{topic.topicDescription}</p>
    </div>
  );
};

export default TopicDetail;
