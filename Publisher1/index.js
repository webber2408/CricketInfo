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

var io = require("socket.io")(3004);

io.on("connection", async (socket) => {
  console.log("connected:", socket.client.id);
  socket.on("serverEvent", function (data) {
    console.log("new message from client:", data);
  });

  await api_calls();

  let finalArr = [];

  for (const [key, value] of Object.entries(countryCodeMap)) {
    if (Object.keys(teamsByCountry).find((x) => x == value)) {
      // callBroker(key, value, socket);
      let topicData = {
        countryId: key,
        countryName: value,
        countryTeams: teamsByCountry[value],
      };
      let dataFormat = {
        topicId: "d86e7021-b64e-442e-a905-fbca95d1544e",
        topicData: topicData,
      };
      finalArr.push(dataFormat);
    }
  }

  for (var i in finalArr) {
    let local = i;
    setTimeout(function () {
      socket.emit("publisher1", finalArr[local]);
    }, local * 10000);
  }
});
