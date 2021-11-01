const { v4: uuidv4 } = require("uuid");
const Topic = require("../model/topic");
const User = require("../model/user");
const PublishHelper = require("../publishHelper/publishHelper");

const isTopicPresent = async (topicId) => {
  try {
    // const {topicId} = req.params;
    const results = await Topic.find({ topicId: topicId }).exec();
    if (results && results[0]) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

const getAllTopics = async (req, res) => {
  try {
    const results = await Topic.find({}).exec();
    if (results[0]) {
      return {
        success: 200,
        message: "Topic fetched successfully",
        data: results,
      };
    } else {
      return {
        success: 404,
        message: "No topics found",
        data: null,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: 500,
      message: "Error fetching topics",
    };
  }
};

const getAllAvailableTopics = async (req, res) => {
  try {
    const { email } = req.params;
    const existingUser = await User.find({ email: email }).exec();
    if (existingUser[0]) {
      const subscribedTopicIds = existingUser[0].subscribedTopicIds;
      const availableTopics = await Topic.find({
        topicId: { $nin: subscribedTopicIds },
      }).exec();
      return {
        success: 200,
        message: "Topics fetched",
        data: availableTopics,
      };
    } else {
      return {
        success: 404,
        message: "User with the given email not found",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: 500,
      message: "Error fetching available topics",
    };
  }
};

const getUserTopics = async (req, res) => {
  try {
    const { email } = req.params;
    const existingUser = await User.find({ email: email }).exec();
    if (existingUser[0]) {
      const subscribedTopicIds = existingUser[0].subscribedTopicIds;
      const availableTopics = await Topic.find({
        topicId: { $in: subscribedTopicIds },
      }).exec();
      return {
        success: 200,
        message: "Topics fetched",
        data: availableTopics,
      };
    } else {
      return {
        success: 404,
        message: "User with the given email not found",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: 500,
      message: "Error fetching user topics",
    };
  }
};

const addTopic = async (req, res) => {
  try {
    const topic = req.body;
    topic.topicId = uuidv4();
    topic.topicStatus = 1;
    const query = await new Topic(topic).save();
    if (query) {
      return {
        success: 200,
        message: "Topic saved successfully",
        data: topic,
      };
    } else {
      return {
        success: 500,
        message: "Error adding topic",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: 500,
      message: "Error adding topic",
    };
  }
};

// PUBLISH
const addTopicDataAndPublish = async (topicId, topicData) => {
  try {
    if (!topicId || !topicData) return;
    const existingTopic = await Topic.find({
      topicId: topicId,
    }).exec();
    if (!existingTopic[0]) return;

    let existingDataString = JSON.stringify(existingTopic[0].topicData);
    let toAddDataString = JSON.stringify(topicData);

    if (!existingDataString.includes(toAddDataString)) {
      await Topic.findOneAndUpdate(
        {
          topicId: topicId,
        },
        {
          $push: {
            topicData: {
              ...topicData,
            },
          },
        }
      );
    }

    // Publish
    let toPublishItem = {
      topicId: existingTopic[0].topicId,
      topicName: existingTopic[0].topicName,
      newData: topicData,
    };
    PublishHelper.publishMessageHelper(toPublishItem.topicId, toPublishItem);

    return {
      success: 200,
      message: "Topic data updated successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: 500,
      message: "Error adding topic data",
    };
  }
};

const subscribeToTopic = async (req, res) => {
  try {
    const { topicId, userEmail } = req.params;
    if (await isTopicPresent(topicId)) {
      console.log("TOPIC PRESENT on 3");
      const existingUser = await User.find({ email: userEmail }).exec();
      if (existingUser[0]) {
        if (!existingUser[0].subscribedTopicIds) {
          existingUser[0].subscribedTopicIds = [];
        }
        if (existingUser[0].subscribedTopicIds.find((x) => x == topicId)) {
          return {
            success: 422,
            message: "You are already subscribed!",
            data: existingUser[0],
          };
        }
        existingUser[0].subscribedTopicIds.push(topicId);
        const query = await User(existingUser[0]).save();
        if (query) {
          return {
            success: 200,
            message: "User subscribed to the topic successfully",
            data: existingUser[0],
          };
        } else {
          return {
            success: 500,
            message: "Unable to save the user subscription",
          };
        }
      } else {
        return {
          success: 404,
          message: "No user with the supplied email found",
        };
      }
    } else {
      console.log("TOPIC NOT PRESENT on 3");
      return {
        success: 411,
        message: "Topic Not Present",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: 500,
      message: "Unable to subscribe to the topic",
    };
  }
};

const unsubscribeToTopic = async (req, res) => {
  try {
    const { topicId, userEmail } = req.params;
    if (await isTopicPresent(topicId)) {
      const existingUser = await User.find({ email: userEmail }).exec();
      if (existingUser[0]) {
        existingUser[0].subscribedTopicIds =
          existingUser[0].subscribedTopicIds.filter((x) => x != topicId);
        const query = await User(existingUser[0]).save();
        if (query) {
          return {
            success: 200,
            message: "User unsubscribed to the topic successfully",
            data: existingUser[0],
          };
        } else {
          return {
            success: 422,
            message: "Unable to remove the user subscription",
          };
        }
      } else {
        return {
          success: 404,
          message: "No user with the supplied email found",
        };
      }
    } else {
      console.log("TOPIC NOT PRESENT on 3");
      return {
        success: 411,
        message: "Topic Not Present",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: 500,
      message: "Unable to unsubscribe to the topic",
    };
  }
};

module.exports = {
  isTopicPresent,
  addTopic,
  getAllTopics,
  subscribeToTopic,
  unsubscribeToTopic,
  getAllAvailableTopics,
  getUserTopics,
  addTopicDataAndPublish,
};
