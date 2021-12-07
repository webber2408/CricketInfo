const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
const express = require("express");
const { Kafka } = require("kafkajs");

const PORT = 7001;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Publisher-1");
});

var teamsByCountry = {
  // india: [],
};
var countryCodeMap = {
  // indiaId: india
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getTeamCountryData(countryRawData, teamRawData) {
  teamsByCountry = {};
  countryCodeMap = {};
  for (let i in countryRawData) {
    countryCodeMap[countryRawData[i]["id"]] = countryRawData[i]["name"];
  }

  for (i in teamRawData) {
    let country = countryCodeMap[teamRawData[i]["country_id"]];
    let team = teamRawData[i]["name"];
    if (!country) continue;
    if (country in teamsByCountry) {
      teamsByCountry[country].push(team);
    } else {
      teamsByCountry[country] = [country];
    }
  }
}

const api_calls = async () => {
  var countriesAPI =
    CONFIG.PUBLISHER_DOMAIN + "countries?api_token=" + CONFIG.API_KEY;
  var teamsAPI = CONFIG.PUBLISHER_DOMAIN + "teams?api_token=" + CONFIG.API_KEY;
  var configCountries = {
    method: "get",
    url: countriesAPI,
    headers: {},
  };
  var configTeams = {
    method: "get",
    url: teamsAPI,
    headers: {},
  };

  try {
    var countryRawData = await axios(configCountries);
    var teamRawData = await axios(configTeams);
  } catch (err) {
    console.log("Error", err);
  }

  if (!_.isEmpty(countryRawData) && !_.isEmpty(teamRawData)) {
    getTeamCountryData(countryRawData.data?.data, teamRawData.data?.data);
  }
};

app.listen(PORT, async () => {
  // Connect Producer
  try {
    var kafka = new Kafka({
      clientId: "myapp",
      // brokers: ["localhost:19092"], // ON LOCAL
      brokers: ["kafka-1:9092"], // ON DOCKER
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

  // console.log("PRODUCER-ARUVANSH", producer);

  // Make API Calls
  await api_calls();

  // Final Array
  let finalArr = [];
  for (const [key, value] of Object.entries(countryCodeMap)) {
    if (Object.keys(teamsByCountry).find((x) => x == value)) {
      let topicData = {
        countryId: key,
        countryName: value,
        countryTeams: teamsByCountry[value],
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
  }

  let arrayOfPromises = [];

  for (let i = 0; i < 1000; i++) {
    let local = i % finalArr.length;
    arrayOfPromises = [
      ...arrayOfPromises,
      new Promise(async (resolve, reject) => {
        try {
          setTimeout(async () => {
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
          }, local * 4000);
        } catch (err) {
          reject("Error sending message from publisher 1 " + err);
        }
      }),
    ];
  }

  Promise.all(arrayOfPromises)
    .then(() => {
      console.log("ALL MESSAGES SENT FROM PUBLISHER 1");
    })
    .catch((err) => {
      console.log("ERROR FROM PUB-1 " + err);
    });

  console.log("Reached end in pub-1");
});
