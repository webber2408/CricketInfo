import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import {
  subscribeToTopic,
  unsubscribeToTopic,
} from "../../slices/subscriber_stomp";
import {
  addSelectedTopicData,
  resetAdvertisement,
  selectTopic,
} from "../../slices/topicSlice";
import { toggleAdvertisement } from "../../slices/userSlice";

import "./topicDetail.css";

const TopicDetail = () => {
  const dispatch = useDispatch();
  const topic = useSelector((state) => state.topic.selectedTopic);
  const topicLiveData = useSelector((state) => state.topic.selectedTopicData);
  const allTopicData = useSelector((state) => state.topic.allTopicData);
  const userEmail = sessionStorage.getItem("USER_EMAIL");
  const advertisement = useSelector((state) => state.topic.advertisement);

  if (
    !sessionStorage.getItem("USER_EMAIL") ||
    !sessionStorage.getItem("TOKEN")
  ) {
    sessionStorage.removeItem("TOKEN");
    window.location.href = "/";
  }

  useEffect(() => {
    if (topic) {
      subscribeToTopic(userEmail + "_" + topic.topicId, false);
      subscribeToTopic(null, true);
    }

    return () => {
      dispatch(addSelectedTopicData(null));
      dispatch(selectTopic(null));
    };
  }, [topic]);

  useEffect(() => {
    console.log("ALL TOPIC DATA", allTopicData);
  }, [allTopicData]);

  if (!topic) return <></>;

  const getEntryData = (data) => {
    if (Array.isArray(data)) return data.join(", ");
    return data;
  };

  const getEntryTitle = (title) => {
    const result = title.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  const unsubscribeFromAds = () => {
    // unsubscribeToTopic(null, true);
    dispatch(
      toggleAdvertisement({
        email: userEmail,
        value: false,
      })
    );
    dispatch(resetAdvertisement());
  };

  return (
    <div className="topicDetail">
      <div className="topicDetail__heading">
        <h2>{topic.topicName}</h2>
      </div>
      <p>{topic.topicDescription}</p>
      {advertisement && sessionStorage.getItem("showAds") == "true" && (
        <div className="newTopic" style={{ backgroundColor: "#dedede" }}>
          {Object.entries(advertisement).map((entry) => {
            return (
              <div className="newTopic__heading">
                <b>
                  <span>{getEntryTitle(entry[0])}</span>
                </b>
                &nbsp; &nbsp;
                <span>{getEntryData(entry[1])}</span>
              </div>
            );
          })}
          <Button size="large" color="secondary" onClick={unsubscribeFromAds}>
            Stop Receiving Ads?
          </Button>
        </div>
      )}
      <br />
      <br />
      {/* {topicLiveData &&
        Object.entries(topicLiveData.newData).map((entry) => {
          return (
            <div className="newTopic">
              <div className="newTopic__heading">
                <b>
                  <span>{getEntryTitle(entry[0])}</span>
                </b>
                &nbsp; &nbsp;
                <span>{getEntryData(entry[1])}</span>
              </div>
            </div>
          );
        })} */}
      {allTopicData &&
        allTopicData.map((x) => {
          return (
            <div style={{ marginBottom: "20px", width: "90%" }}>
              {Object.entries(topicLiveData.newData).map((entry) => {
                return (
                  <div className="newTopic">
                    <div className="newTopic__heading">
                      <b>
                        <span>{getEntryTitle(entry[0])}</span>
                      </b>
                      &nbsp; &nbsp;
                      <span>{getEntryData(entry[1])}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default TopicDetail;
