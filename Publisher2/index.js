const axios = require("axios");
const CONFIG = require("./config.json");
var leagueByCountry = {};
var countryCodeMap = {};

function getLeagueCountryData(countryRawData, leagueRawData) {
  leagueByCountry = {};
  countryCodeMap = {};
  for (i in countryRawData["data"]) {
    countryCodeMap[countryRawData["data"][i]["id"]] =
      countryRawData["data"][i]["name"];
  }
  for (i in leagueRawData["data"]) {
    country = countryCodeMap[leagueRawData["data"][i]["country_id"]];
    league = leagueRawData["data"][i]["name"];
    if (country in leagueByCountry) {
      leagueByCountry[country].push(league);
    } else {
      leagueByCountry[country] = [league];
    }
  }
}

const api_calls = async () => {
  var countriesAPI =
    CONFIG.PUBLISHER_DOMAIN + "countries?api_token=" + CONFIG.API_KEY;
  var leaguesAPI =
    CONFIG.PUBLISHER_DOMAIN + "leagues?api_token=" + CONFIG.API_KEY;
  var configCountries = {
    method: "get",
    url: countriesAPI,
    headers: {},
  };
  var configLeagues = {
    method: "get",
    url: leaguesAPI,
    headers: {},
  };

  try {
    var countryRawData = await axios(configCountries);
    var leagueRawData = await axios(configLeagues);
  } catch {}
  if (countryRawData != undefined && leagueRawData != undefined) {
    getLeagueCountryData(countryRawData.data, leagueRawData.data);
  }
};

// SOCKET CONNECTION
var io = require("socket.io-client");
var socket = io.connect("http://localhost:3004/", {
  reconnection: true,
});

socket.on("connect", function () {
  console.log("connected to localhost:3004");
  setInterval(function () {
    api_calls();
    console.log(leagueByCountry);
    if (Object.keys(leagueByCountry).length > 0) {
      // let data_format = {
      //   topicId: "d86e7021-b64e-442e-a905-fbca95d1544e",
      //   topicData: leagueByCountry,
      // };
      socket.emit("publisher_push", Math.random());
    }
  }, 10000);
});
