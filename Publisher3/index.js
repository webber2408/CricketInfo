const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
const express = require("express");

const PORT = 5003;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Publisher-3");
});

var officialsByCountry = {
  // india: [],
};
var countryCodeMap = {
  // indiaId: india
};

function getOfficialCountryData(countryRawData, officialRawData) {
  officialsByCountry = {};
  countryCodeMap = {};
  for (let i in countryRawData) {
    countryCodeMap[countryRawData[i]["id"]] = countryRawData[i]["name"];
  }

  for (i in officialRawData) {
    let country = countryCodeMap[officialRawData[i]["country_id"]];
    let official =
      officialRawData[i]["firstname"] + " " + officialRawData[i]["lastname"];
    if (!country) continue;
    if (official in officialsByCountry) {
      officialsByCountry[country].push(official);
    } else {
      officialsByCountry[country] = [official];
    }
  }
}

const api_calls = async () => {
  var countriesAPI =
    CONFIG.PUBLISHER_DOMAIN + "countries?api_token=" + CONFIG.API_KEY;
  var officialsAPI =
    CONFIG.PUBLISHER_DOMAIN + "officials?api_token=" + CONFIG.API_KEY;
  var configCountries = {
    method: "get",
    url: countriesAPI,
    headers: {},
  };
  var configOficials = {
    method: "get",
    url: officialsAPI,
    headers: {},
  };

  try {
    var countryRawData = await axios(configCountries);
    var officialsRawData = await axios(configOficials);
  } catch (err) {
    console.log("Error", err);
  }

  if (!_.isEmpty(countryRawData) && !_.isEmpty(officialsRawData)) {
    getOfficialCountryData(
      countryRawData.data?.data,
      officialsRawData.data?.data
    );
  }
};

var io = require("socket.io-client");

app.listen(PORT, () => {
  console.log(`Publisher 3 started on port: ${PORT}`);

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

    for (const [key, value] of Object.entries(countryCodeMap)) {
      if (Object.keys(officialsByCountry).find((x) => x == value)) {
        let topicData = {
          countryId: key,
          countryName: value,
          officials: officialsByCountry[value],
          noOfOfficials: officialsByCountry[value].length,
        };
        var dataFormat = {
          topicId: "f56af9f5-a3da-4ffc-bae0-7a410a88732a",
          topicData: topicData,
          isAdvertisement: false,
        };
        finalArr.push(dataFormat);
        dataFormat = {
          topicId: "f56af9f5-a3da-4ffc-bae0-7a410a88732a",
          topicData: topicData,
          isAdvertisement: true,
        };
        finalArr.push(dataFormat);
      }
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
