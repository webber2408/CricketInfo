const axios = require("axios");
const CONFIG = require("./config.json");

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
  console.log(leagueByCountry);
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
api_calls();
// setInterval(api_calls, 1 * 1000);
