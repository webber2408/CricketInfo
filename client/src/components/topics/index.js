import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAvailableTopics,
  getMyTopics,
  subscribeTopic,
  unsubscribeTopic,
} from "../../slices/topicSlice";

import TopicCard from "./topicCard";

import "./topics.css";

const Topics = () => {
  const dispatch = useDispatch();
  const availableTopics = useSelector((state) => state.topic.availableTopics);
  const myTopics = useSelector((state) => state.topic.myTopics);
  const userEmail = localStorage.getItem("USER_EMAIL");

  if (!localStorage.getItem("TOKEN") || !localStorage.getItem("USER_EMAIL")) {
    window.location.href = "/";
  }

  useEffect(() => {
    dispatch(getAvailableTopics(userEmail));
    dispatch(getMyTopics(userEmail));
  }, []);

  return (
    <div className="topics">
      {availableTopics && !!availableTopics.length && (
        <>
          <div className="topics_heading">
            <h2>Available Subscriptions</h2>
          </div>
          <div className="topics_wrapper">
            {availableTopics.map((topic, index) => (
              <TopicCard
                topic={topic}
                key={index}
                onSubscribe={() => {
                  dispatch(
                    subscribeTopic({ email: userEmail, topicId: topic.topicId })
                  );
                }}
              />
            ))}
          </div>
        </>
      )}

      {myTopics && !!myTopics.length && (
        <>
          <div className="topics_heading">
            <h2>Your Subscriptions</h2>
          </div>
          <div className="topics_wrapper">
            {myTopics.map((topic, index) => (
              <TopicCard
                topic={topic}
                key={index}
                isSubscribed
                onUnsubscribe={() => {
                  dispatch(
                    unsubscribeTopic({
                      email: userEmail,
                      topicId: topic.topicId,
                    })
                  );
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Topics;
