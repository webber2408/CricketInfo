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
var stadiumsByVenue = {
  //  stadiums: venue
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

function getStadiumVenueData(stadiumRawData) {
  stadiumsByVenue = {};
  for (i in stadiumRawData) {
    stadiumsByVenue[stadiumRawData[i]["name"]] = stadiumRawData[i]["city"];
  }
}

const api_calls = async () => {
  var countriesAPI =
    CONFIG.PUBLISHER_DOMAIN + "countries?api_token=" + CONFIG.API_KEY;
  var teamsAPI = CONFIG.PUBLISHER_DOMAIN + "teams?api_token=" + CONFIG.API_KEY;
  var venuesAPI =
    CONFIG.PUBLISHER_DOMAIN + "venues?api_token=" + CONFIG.API_KEY;
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
  var configStadiums = {
    method: "get",
    url: venuesAPI,
    headers: {},
  };
  try {
    var countryRawData = await axios(configCountries);
    var teamRawData = await axios(configTeams);
    var stadiumRawData = await axios(configStadiums);
  } catch (err) {
    console.log("Error", err);
  }

  if (!_.isEmpty(countryRawData) && !_.isEmpty(teamRawData)) {
    getTeamCountryData(countryRawData.data?.data, teamRawData.data?.data);
    getStadiumVenueData(stadiumRawData.data?.data);
  }
};

var io = require("socket.io")(7001);

app.listen(PORT, () => {
  console.log(`Publisher 1 started on port: ${PORT}`);

  io.on("connection", async (socket) => {
    console.log("connected to cricket-api:3004");

    await api_calls();

    let finalArr = [];

    for (const [key, value] of Object.entries(countryCodeMap)) {
      let topicData = {
        countryId: key,
        countryName: value,
      };
      var dataFormat = {
        topicId: CONFIG.T3_COUNTRY_CRICKET,
        topicData: topicData,
        isAdvertisement: false,
        cycleCount: 0,
      };
      finalArr.push(dataFormat);
      dataFormat.isAdvertisement = true;
      finalArr.push(dataFormat);
      if (Object.keys(teamsByCountry).find((x) => x == value)) {
        let topicData = {
          countryId: key,
          countryName: value,
          countryTeams: teamsByCountry[value],
        };
        var dataFormat = {
          topicId: CONFIG.T1_TEAMS_BY_COUNTRY,
          topicData: topicData,
          isAdvertisement: false,
          cycleCount: 0,
        };
        finalArr.push(dataFormat);
        dataFormat.isAdvertisement = true;
        finalArr.push(dataFormat);
      }
    }
    for (const [key, value] of Object.entries(stadiumRawData)) {
      let topicData = {
        stadium: key,
        venue: value,
      };
      var dataFormat = {
        topicId: CONFIG.T2_STAD_BY_VENUE,
        topicData: topicData,
        isAdvertisement: false,
        cycleCount: 0,
      };
      finalArr.push(dataFormat);
      dataFormat.isAdvertisement = true;
      finalArr.push(dataFormat);
    }
    console.log(finalArr);
    for (var i = 0; i < 100; i++) {
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
