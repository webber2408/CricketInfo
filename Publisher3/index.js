const axios = require("axios");
const CONFIG = require("./config.json");
const _ = require("lodash");
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
var socket = io.connect("http://localhost:3004/", {
  reconnection: true,
});

socket.on("connect", async () => {
  console.log("connected to localhost:3004");

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
      }, local * 40000);
    }
  }
});
