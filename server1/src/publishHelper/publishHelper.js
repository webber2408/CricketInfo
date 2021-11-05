const amqplib = require("amqplib");
const { RabbitMQURL } = require("../../rendezvousConfig");
const User = require("../model/user");

const getGlobalConnection = () => {
  return {
    connection: global.amqplConnection,
    channel: global.channel,
  };
};

const publishMessageHelper = async (topicId, message) => {
  try {
    const users = await User.find({
      subscribedTopicIds: topicId,
    }).exec();
    console.log("USERS", users);
    if (!users) {
      console.log("Error fetching users, users got undefined");
      return;
    }
    let arrayOfPromises = [];
    users.forEach((user) => {
      return (arrayOfPromises = [
        ...arrayOfPromises,
        new Promise((resolve, reject) => {
          let queueId = user.email + "_" + topicId;
          resolve(publishMessage(queueId, message));
        }),
      ]);
    });
    return Promise.all(arrayOfPromises).then(() => {
      console.log("MESSAGE PUSHED TO ALL SUBSCRIBER QUEUES!");
    });
  } catch (err) {
    console.log("Error fetching users for the given topicId", err);
    return;
  }
};

const publishMessage = async (queueId, message) => {
  let { connection, channel } = getGlobalConnection();
  if (!connection || !channel) {
    connection = await amqplib.connect(RabbitMQURL, "heartbeat=60");
    channel = await connection.createChannel();
    global.amqplConnection = connection;
  }

  try {
    console.log("Publishing");
    const exchange = "cricketQueue";
    const queue = "queue." + queueId;
    const routingKey = queueId;

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    await channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message))
    );

    console.log("Message published");
  } catch (err) {
    console.error("Error in publishing message", e);
  } finally {
    console.info("Closing channel and connection if available");
    await channel.close();
    await connection.close();
    console.info("Channel and connection closed");
  }
};

module.exports = {
  publishMessage,
  publishMessageHelper,
};
