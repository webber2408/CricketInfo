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

  getLeagueCountryData(countryRawData.data, leagueRawData.data);
};

var io = require("socket.io")(3001);
io.on("connection", function (socket) {
  console.log("connected:", socket.client.id);
  setInterval(function () {
    api_calls();
    socket.emit("publisher2", "hello i am from publisher 2");
  }, 5000);
});
