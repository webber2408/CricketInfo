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
  var kafka = new Kafka({
    clientId: "myapp",
    // brokers: ["localhost:19093"], // ON LOCAL
    brokers: ["kafka-1:19092"], // ON DOCKER
  });
  const producer = kafka.producer();
  await producer.connect();

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
        topicId: "406dc390-7342-4880-b2ba-6ab64306bea1",
        topicData: topicData,
        isAdvertisement: false,
      };
      finalArr.push(dataFormat);
      dataFormat = {
        topicId: "406dc390-7342-4880-b2ba-6ab64306bea1",
        topicData: topicData,
        isAdvertisement: true,
      };
      finalArr.push(dataFormat);
    }
  }

  // for (var i = 0; i < 10; i++) {
  //   let local = i % finalArr.length;
  //   if (!finalArr[local].isAdvertisement) {
  //     setTimeout(function () {
  //       const partition = getRandomInt(2);
  //       producer.send({
  //         topic: "406dc390-7342-4880-b2ba-6ab64306bea1",
  //         messages: [
  //           {
  //             value: "Hello from publisher 1",
  //             partition: partition,
  //           },
  //         ],
  //       });
  //     }, local * 4000);
  //   }
  //   // Ads
  //   // else if (finalArr[local].isAdvertisement) {
  //   //   setTimeout(function () {
  //   //     socket.emit("publisher_push", finalArr[local]);
  //   //   }, local * 1000);
  //   // }
  // }

  const partition = getRandomInt(2);
  await producer.send({
    topic: "Publisher-1Topic",
    messages: [
      {
        value: "Hello from publisher 1",
        partition: partition,
      },
    ],
  });

  console.log("Message sent successfully from Pub-1!");
});
