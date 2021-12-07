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
      brokers: ["kafka-2:9093"], // ON DOCKER
    });

    // Create topic
    var admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: CONFIG.TOPIC_ID,
          numPartitions: 2,
        },
      ],
    });
    await admin.disconnect();

    // Connect producer
    var producer = kafka.producer();
    await producer.connect();
  } catch (error) {
    process.exit(0);
  }

  console.log("PRODUCER", producer);

  await api_calls();

  let finalArr = [];
  for (const [key, value] of Object.entries(winLossPercentage)) {
    let topicData = {
      teamName: key,
      winLossPercentage: value,
    };
    var dataFormat = {
      topicId: "",
      topicData: topicData,
      isAdvertisement: false,
    };
    finalArr.push(dataFormat);
    dataFormat = {
      topicId: "",
      topicData: topicData,
      isAdvertisement: true,
    };
    finalArr.push(dataFormat);
  }

  let arrayOfPromises = [];

  for (let i = 0; i < 1000; i++) {
    let local = i % finalArr.length;
    arrayOfPromises = [
      ...arrayOfPromises,
      new Promise(async (resolve, reject) => {
        try {
          const result = await producer.send({
            topic: CONFIG.TOPIC_ID,
            messages: [
              {
                value: JSON.stringify(finalArr[local]),
                partition: 1,
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
