const express = require("express");
const { Kafka } = require("kafkajs");

const PORT = 8001;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Consumer-1");
});

app.listen(PORT, async () => {
  try {
    var publisher1Promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        var kafka = new Kafka({
          clientId: "myapp-1",
          brokers: ["kafka-1:9092"],
        });

        var consumer = kafka.consumer({ groupId: "test-1" + Date.now() });
        await consumer.connect();

        await consumer.subscribe({
          topic: "Publisher-1Topic",
          fromBeginning: true,
        });

        await consumer.run({
          eachMessage: async (result) => {
            console.log(
              `RCVD Msg ${result.message.value} on partition ${result.partition}`
            );
          },
        });
      }, 10000);
    });

    var publisher2Promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        var kafka = new Kafka({
          clientId: "myapp-2",
          brokers: ["kafka-2:9093"],
        });

        var consumer = kafka.consumer({ groupId: "test-2" + Date.now() });
        await consumer.connect();

        await consumer.subscribe({
          topic: "Publisher-2Topic",
          fromBeginning: true,
        });

        await consumer.run({
          eachMessage: async (result) => {
            console.log(
              `RCVD Msg ${result.message.value} on partition ${result.partition}`
            );
          },
        });
      }, 10000);
    });

    var publisher3Promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        var kafka = new Kafka({
          clientId: "myapp-3",
          brokers: ["kafka-3:9094"],
        });

        var consumer = kafka.consumer({ groupId: "test-3" + Date.now() });
        await consumer.connect();

        await consumer.subscribe({
          topic: "Publisher-3Topic",
          fromBeginning: true,
        });

        await consumer.run({
          eachMessage: async (result) => {
            console.log(
              `RCVD Msg ${result.message.value} on partition ${result.partition}`
            );
          },
        });
      }, 10000);
    });

    Promise.all([publisher1Promise, publisher2Promise, publisher3Promise])
      .then((res) => {
        console.log(" ALL PROMISES ARE COMPLETED !!");
      })
      .catch(() => {
        console.log("ERROR SENDING MESSAGES");
      });
  } catch (error) {
    console.log("ERROR FROM CONSUMER SIDE " + error);
  }
});
