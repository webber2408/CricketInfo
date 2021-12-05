const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
const express = require("express");
const { Kafka } = require("kafkajs");

const PORT = 7002;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Publisher-2");
});

var winLossPercentage = {
  // india: winloss,
};
var teamIdMap = {
  // teamId: teamName
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getWinLossPercentage(standingsRawData, teamRawData) {
  winLossPercentage = {};
  teamIdMap = {};
  for (let i in teamRawData) {
    teamIdMap[teamRawData[i]["id"]] = teamRawData[i]["name"];
  }

  for (let i in standingsRawData) {
    let team = teamIdMap[standingsRawData[i]["team_id"]];
    if (!team) continue;
    winLossPercentage[team] =
      (standingsRawData[i]["won"] * 100) /
      (standingsRawData[i]["won"] + standingsRawData[i]["lost"]);
  }
}

const api_calls = async () => {
  var standingsAPI =
    CONFIG.PUBLISHER_DOMAIN +
    "standings/season/525?api_token=" +
    CONFIG.API_KEY;
  var teamsAPI = CONFIG.PUBLISHER_DOMAIN + "teams?api_token=" + CONFIG.API_KEY;
  var configStandings = {
    method: "get",
    url: standingsAPI,
    headers: {},
  };
  var configTeams = {
    method: "get",
    url: teamsAPI,
    headers: {},
  };

  try {
    var standingsRawData = await axios(configStandings);
    var teamRawData = await axios(configTeams);
  } catch (err) {
    console.log("Error", err);
  }

  if (!_.isEmpty(standingsRawData) && !_.isEmpty(teamRawData)) {
    getWinLossPercentage(standingsRawData.data?.data, teamRawData.data?.data);
  }
};

app.listen(PORT, async () => {
  // Connect Producer
  try {
    var kafka = new Kafka({
      clientId: "myapp",
      // brokers: ["localhost:19092"], // ON LOCAL
      brokers: ["kafka-2:9092"], // ON DOCKER
    });

    // Create topic
    // var admin = kafka.admin();
    // await admin.connect();
    // await admin.createTopics({
    //   topics: [
    //     {
    //       topic: "Publisher-2Topic",
    //       numPartitions: 2,
    //     },
    //   ],
    // });
    // await admin.disconnect();

    // Connect producer
    var producer = kafka.producer();
    await producer.connect();
  } catch (error) {
    process.exit(0);
  }

  console.log("PRODUCER-RAHUL", producer);

  // await api_calls();

  let finalArr = [];
  for (const [key, value] of Object.entries(winLossPercentage)) {
    let topicData = {
      teamName: key,
      winLossPercentage: value,
    };
    var dataFormat = {
      topicId: "e296ce0a-d87d-48c9-89ac-f7e40fbbbef6",
      topicData: topicData,
      isAdvertisement: false,
    };
    finalArr.push(dataFormat);
    dataFormat = {
      topicId: "e296ce0a-d87d-48c9-89ac-f7e40fbbbef6",
      topicData: topicData,
      isAdvertisement: true,
    };
    finalArr.push(dataFormat);
  }

  // for (var i = 0; i < finalArr.length + 100; i++) {
  //   let local = i % finalArr.length;
  //   if (!finalArr[local].isAdvertisement) {
  //     setTimeout(function () {
  //       socket.emit("publisher_push", finalArr[local]);
  //     }, local * 4000);
  //   } else if (finalArr[local].isAdvertisement) {
  //     setTimeout(function () {
  //       socket.emit("publisher_push", finalArr[local]);
  //     }, local * 1000);
  //   }
  // }

  let arrayOfPromises = [];

  for (let i = 0; i < 10000; i++) {
    arrayOfPromises = [
      ...arrayOfPromises,
      new Promise(async (resolve, reject) => {
        try {
          const partition = getRandomInt(2);
          const result = await producer.send({
            topic: "Publisher-2Topic",
            messages: [
              {
                value: "Hello from publisher 2",
                // partition: 1,
              },
            ],
          });
          resolve(result);
        } catch (err) {
          reject("Error sending message from publisher 2 " + err);
        }
      }),
    ];
  }

  Promise.all(arrayOfPromises)
    .then(() => {
      console.log("ALL MESSAGES SENT FROM PUBLISHER 2");
    })
    .catch((err) => {
      console.log("ERROR FROM PUB-2 " + err);
    });

  console.log("Reached end in pub-2");
});
