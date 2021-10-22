const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
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

var io = require("socket.io-client");
var socket = io.connect("http://localhost:3004/", {
  reconnection: true,
});

socket.on("connect", async () => {
  console.log("connected to localhost:3004");

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
  }
  for (var i in finalArr) {
    let local = i;
    if (!finalArr[local].isAdvertisement) {
      setTimeout(function () {
        socket.emit("publisher_push", finalArr[local]);
      }, local * 10000);
    } else if (finalArr[local].isAdvertisement) {
      setTimeout(function () {
        socket.emit("publisher_push", "Testing that this is advertisement");
      }, local * 1000);
    }
  }
});
