const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
const express = require("express");
const { Kafka } = require("kafkajs");

const PORT = 7003;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Publisher-3");
});

var officialsByCountry = {
  // india: [],
};
var countryCodeMap = {
  // indiaId: india
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getOfficialCountryData(countryRawData, officialRawData) {
  officialsByCountry = {};
  countryCodeMap = {};
  for (let i in countryRawData) {
    countryCodeMap[countryRawData[i]["id"]] = countryRawData[i]["name"];
  }

  for (i in officialRawData) {
    let country = countryCodeMap[officialRawData[i]["country_id"]];
    let official =
      officialRawData[i]["firstname"] + " " + officialRawData[i]["lastname"];
    if (!country) continue;
    if (official in officialsByCountry) {
      officialsByCountry[country].push(official);
    } else {
      officialsByCountry[country] = [official];
    }
  }
}

const api_calls = async () => {
  var countriesAPI =
    CONFIG.PUBLISHER_DOMAIN + "countries?api_token=" + CONFIG.API_KEY;
  var officialsAPI =
    CONFIG.PUBLISHER_DOMAIN + "officials?api_token=" + CONFIG.API_KEY;
  var configCountries = {
    method: "get",
    url: countriesAPI,
    headers: {},
  };
  var configOficials = {
    method: "get",
    url: officialsAPI,
    headers: {},
  };

  try {
    var countryRawData = await axios(configCountries);
    var officialsRawData = await axios(configOficials);
  } catch (err) {
    console.log("Error", err);
  }

  if (!_.isEmpty(countryRawData) && !_.isEmpty(officialsRawData)) {
    getOfficialCountryData(
      countryRawData.data?.data,
      officialsRawData.data?.data
    );
  }
};

app.listen(PORT, async () => {
  // Connect Producer
  try {
    var kafka = new Kafka({
      clientId: "myapp",
      // brokers: ["localhost:19092"], // ON LOCAL
      brokers: ["kafka-3:9094"], // ON DOCKER
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

  await api_calls();

  let finalArr = [];
  for (const [key, value] of Object.entries(countryCodeMap)) {
    if (Object.keys(officialsByCountry).find((x) => x == value)) {
      let topicData = {
        countryId: key,
        countryName: value,
        officials: officialsByCountry[value],
        noOfOfficials: officialsByCountry[value].length,
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
          reject("Error sending message from publisher 3 " + err);
        }
      }),
    ];
  }

  Promise.all(arrayOfPromises)
    .then(() => {
      console.log("ALL MESSAGES SENT FROM PUBLISHER 3");
    })
    .catch((err) => {
      console.log("ERROR FROM PUB-3 " + err);
    });

  console.log("Reached end in pub-3");
});
