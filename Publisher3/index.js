const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
const express = require("express");

const PORT = 5003;
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
var status = {};

var upcomingSchedules = {};

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
function getMatchStatus(scoreRawData) {
  status = {};
  for (let i in scoreRawData) {
    status[scoreRawData[i]["id"]] = scoreRawData[i]["note"];
  }
}
function getSchedules(schedulesRawData) {
  upcomingSchedules = {};
  for (let i in schedulesRawData) {
    upcomingSchedules[schedulesRawData[i]["id"]] = schedulesRawData[i]["name"];
  }
}
const api_calls = async () => {
  var countriesAPI =
    CONFIG.PUBLISHER_DOMAIN + "countries?api_token=" + CONFIG.API_KEY;
  var officialsAPI =
    CONFIG.PUBLISHER_DOMAIN + "officials?api_token=" + CONFIG.API_KEY;
  var fixtures =
    CONFIG.PUBLISHER_DOMAIN + "fixtures?api_token=" + CONFIG.API_KEY;
  var matches = CONFIG.PUBLISHER_DOMAIN + "stages?api_token=" + CONFIG.API_KEY;
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
  var configFixturesOfficial = {
    method: "get",
    url: fixtures,
    headers: {},
  };
  var configSchedules = {
    method: "get",
    url: matches,
    headers: {},
  };

  try {
    var countryRawData = await axios(configCountries);
    var officialsRawData = await axios(configOficials);
    var scoreRawData = await axios(configFixturesOfficial);
    var schedulesRawData = await axios(configSchedules);
  } catch (err) {
    console.log("Error", err);
  }

  if (!_.isEmpty(countryRawData) && !_.isEmpty(officialsRawData)) {
    getOfficialCountryData(
      countryRawData.data?.data,
      officialsRawData.data?.data
    );
    getMatchStatus(scoreRawData);
    getSchedules(schedulesRawData);
  }
};

var io = require("socket.io-client");

app.listen(PORT, () => {
  console.log(`Publisher 3 started on port: ${PORT}`);

  // var socket = io.connect("http://cricket-api:3004/", {
  // DOCKER
  var socket = io.connect("http://localhost:3004/", {
    // LOCAL
    reconnection: true,
  });

  socket.on("connect", async () => {
    console.log("connected to cricket-api:3004");

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
          topicId: CONFIG.T7_UMPIRES,
          topicData: topicData,
          isAdvertisement: false,
          cycleCount: 0,
        };
        finalArr.push(dataFormat);
        dataFormat.isAdvertisement = true;
        finalArr.push(dataFormat);
      }
    }
    for (const [key, value] of Object.entries(status)) {
      let topicData = {
        id: key,
        result: value,
      };
      var dataFormat = {
        topicId: CONFIG.T8_CRICKET_STATUS,
        topicData: topicData,
        isAdvertisement: false,
        cycleCount: 0,
      };
      finalArr.push(dataFormat);
      dataFormat.isAdvertisement = true;
      finalArr.push(dataFormat);
    }
    for (const [key, value] of Object.entries(upcomingSchedules)) {
      let topicData = {
        id: key,
        scheduleName: value,
      };
      var dataFormat = {
        topicId: CONFIG.T9_SCHEDULES,
        topicData: topicData,
        isAdvertisement: false,
        cycleCount: 0,
      };
      finalArr.push(dataFormat);
      dataFormat.isAdvertisement = true;
      finalArr.push(dataFormat);
    }
    for (var i = 0; i < finalArr.length + 100; i++) {
      let local = i % finalArr.length;
      if (!finalArr[local].isAdvertisement) {
        setTimeout(function () {
          socket.emit("publisher_push", finalArr[local]);
        }, local * 4000);
      } else if (finalArr[local].isAdvertisement) {
        setTimeout(function () {
          socket.emit("publisher_push", finalArr[local]);
        }, local * 1000);
      }
    }
  });
});
