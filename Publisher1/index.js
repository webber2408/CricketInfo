const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
const express = require("express");

const PORT = 6001;
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

var io = require("socket.io")(7001);

app.listen(PORT, () => {
  console.log(`Publisher 1 started on port: ${PORT}`);
  // var socket = io.connect("http://cricket-api:3004/", {
  // DOCKER
  // var socket = io.connect("http://localhost:3001/", {
  //   // LOCAL
  //   reconnection: true,
  // });

  io.on("connection", async (socket) => {
    console.log("connected to cricket-api:3004");

    await api_calls();

    let finalArr = [];

    for (const [key, value] of Object.entries(countryCodeMap)) {
      if (Object.keys(teamsByCountry).find((x) => x == value)) {
        let topicData = {
          countryId: key,
          countryName: value,
          countryTeams: teamsByCountry[value],
        };
        var dataFormat = {
          topicId: "340ad8f0-340d-42a3-ac32-c513f7c2822a",
          topicData: topicData,
          isAdvertisement: false,
        };
        finalArr.push(dataFormat);
        dataFormat = {
          topicId: "340ad8f0-340d-42a3-ac32-c513f7c2822a",
          topicData: topicData,
          isAdvertisement: true,
        };
        finalArr.push(dataFormat);
      }
    }
    for (var i = 0; i < finalArr.length + 100; i++) {
      let local = i % finalArr.length;
      if (!finalArr[local].isAdvertisement) {
        setTimeout(function () {
          socket.emit("push_from_neighbour", finalArr[local]);
        }, local * 4000);
      } else if (finalArr[local].isAdvertisement) {
        setTimeout(function () {
          socket.emit("push_from_neighbour", finalArr[local]);
        }, local * 1000);
      }
    }
  });
});
