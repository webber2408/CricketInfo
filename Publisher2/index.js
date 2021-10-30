const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
const express = require("express");

const PORT = 5002;
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

var io = require("socket.io-client");

app.listen(PORT, () => {
  console.log(`Publisher 2 started on port: ${PORT}`);

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
