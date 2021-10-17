const PublishHelper = require("../publishHelper/publishHelper");

const publishMessage = async (req, res) => {
  try {
    const { topicId, message } = req.body;
    return new Promise((resolve, reject) => {
      resolve(PublishHelper.publishMessage(topicId, message));
    })
      .then(() => {
        return {
          success: 200,
          message: "Message Published",
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          success: 422,
          message: "Error publishing message",
          error: err,
        };
      });
  } catch (err) {
    console.log(err);
    return {
      success: 500,
      message: "Error publishing message",
    };
  }
};

module.exports = {
  publishMessage,
};
