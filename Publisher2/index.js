const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
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
var socket = io.connect("http://localhost:3004/", {
  reconnection: true,
});

socket.on("connect", async () => {
  console.log("connected to localhost:3004");

  await api_calls();

  let finalArr = [];

  for (const [key, value] of Object.entries(winLossPercentage)) {
    let topicData = {
      teamName: key,
      winLossPercentage: value,
    };
    var dataFormat = {
      topicId: "d86e7021-b64e-442e-a905-fbca95d1544e",
      topicData: topicData,
      isAdvertisement: false,
    };
    finalArr.push(dataFormat);
    dataFormat = {
      topicId: "d86e7021-b64e-442e-a905-fbca95d1544e",
      topicData: topicData,
      isAdvertisement: true,
    };
    finalArr.push(dataFormat);
  }
  for (var i in finalArr) {
    let local = i;
    if (!finalArr[local].isAdvertisement) {
      setTimeout(function () {
        socket.emit("publisher_push", finalArr[local]);
      }, local * 10000);
    } else if (finalArr[local].isAdvertisement) {
      setTimeout(function () {
        socket.emit("publisher_push", finalArr[local]);
      }, local * 40000);
    }
  }
});
