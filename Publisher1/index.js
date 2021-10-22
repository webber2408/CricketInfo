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
  // return leagueByCountry;
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

var io = require("socket.io")(3000);
io.on("connection", function (socket) {
  console.log("connected:", socket.client.id);
  socket.on("serverEvent", function (data) {
    console.log("new message from client:", data);
  });
  setInterval(function () {
    api_calls();
    if (Object.keys(leagueByCountry).length > 0) {
      socket.emit("publisher1", leagueByCountry);
    }
  }, 10000);
});
