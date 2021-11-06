const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
const express = require("express");

const PORT = 6002;
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
var seasons = {
  // seasonId:seasonName
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

function getAllSeasons(seasonRawData) {
  seasons = {};
  for (let i in seasonRawData) {
    seasons[seasonRawData[i]["id"]] = seasonRawData[i]["name"];
  }
}
function shuffle(sourceArray) {
  for (var i = 0; i < sourceArray.length - 1; i++) {
    var j = i + Math.floor(Math.random() * (sourceArray.length - i));

    var temp = sourceArray[j];
    sourceArray[j] = sourceArray[i];
    sourceArray[i] = temp;
  }
  return sourceArray;
}
const api_calls = async () => {
  var standingsAPI =
    CONFIG.PUBLISHER_DOMAIN +
    "standings/season/525?api_token=" +
    CONFIG.API_KEY;
  var teamsAPI = CONFIG.PUBLISHER_DOMAIN + "teams?api_token=" + CONFIG.API_KEY;
  var seasonsAPI =
    CONFIG.PUBLISHER_DOMAIN + "seasons?api_token=" + CONFIG.API_KEY;
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
  var seasons = {
    method: "get",
    url: seasonsAPI,
    headers: {},
  };

  try {
    var standingsRawData = await axios(configStandings);
    var teamRawData = await axios(configTeams);
    var seasonRawData = await axios(seasons);
  } catch (err) {
    console.log("Error", err);
  }

  if (!_.isEmpty(standingsRawData) && !_.isEmpty(teamRawData)) {
    getWinLossPercentage(standingsRawData.data?.data, teamRawData.data?.data);
    getAllSeasons(seasonRawData.data?.data);
  }
};

var io = require("socket.io")(7002);

app.listen(PORT, () => {
  console.log(`Publisher 2 started on port: ${PORT}`);

  io.on("connection", async (socket) => {
    console.log("connected to broker socket node");

    await api_calls();

    let finalArr = [];
    for (const [key, value] of Object.entries(winLossPercentage)) {
      let topicData = {
        teamName: key,
        winLossPercentage: value,
      };
      var dataFormat = {
        topicId: CONFIG.T4_WIN_LOSS,
        topicData: topicData,
        isAdvertisement: false,
        cycleCount: 0,
      };
      finalArr.push(dataFormat);
      finalArr.push({ ...dataFormat, isAdvertisement: true });
    }
    for (const [key, value] of Object.entries(teamIdMap)) {
      let topicData = {
        teamName: value,
        teamId: key,
      };
      var dataFormat = {
        topicId: CONFIG.T5_TOP_TEAMS,
        topicData: topicData,
        isAdvertisement: false,
        cycleCount: 0,
      };
      finalArr.push(dataFormat);
      finalArr.push({ ...dataFormat, isAdvertisement: true });
    }
    for (const [key, value] of Object.entries(seasons)) {
      let topicData = {
        seasonName: value,
        seasonId: key,
      };
      var dataFormat = {
        topicId: CONFIG.T6_SEASONS,
        topicData: topicData,
        isAdvertisement: false,
        cycleCount: 0,
      };
      finalArr.push(dataFormat);
      finalArr.push({ ...dataFormat, isAdvertisement: true });
    }
    // finalArr = shuffle(finalArr);
    for (var i = 0; i < finalArr.length * 10; i++) {
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
