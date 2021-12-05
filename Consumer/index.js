const express = require("express");
const { Kafka } = require("kafkajs");

const PORT = 8001;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Consumer-1");
});

app.listen(PORT, async () => {
  try {
    setTimeout(async () => {
      var kafka = new Kafka({
        clientId: "myapp",
        brokers: ["kafka-1:9092"],
      });

      const consumer = kafka.consumer({ groupId: "" + Date.now() });
      await consumer.connect();

      await consumer.subscribe({
        topic: "Publisher-1Topic",
        fromBeginning: true,
      });

      // await consumer.subscribe({
      //   topic: "Publisher-2Topic",
      //   fromBeginning: true,
      // });

      // await consumer.subscribe({
      //   topic: "Publisher-1Topic",
      //   fromBeginning: true,
      // });

      await consumer.run({
        eachMessage: async (result) => {
          console.log(
            `RCVD Msg ${result.message.value} on partition ${result.partition}`
          );
        },
      });
    }, 10000);
  } catch (error) {
    console.log("ERROR FROM CONSUMER SIDE " + error);
  }
});
