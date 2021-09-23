const CricketController = require("../src/controller/cricketController");

const routes = [
  {
    method: "POST",
    url: "/api/cricket",
    handler: CricketController.addMatch,
  },
  {
    method: "GET",
    url: "/api/cricket/all",
    handler: CricketController.getAllMatches,
  },
  {
    method: "GET",
    url: "/api/cricket/teamStatistics",
    handler: CricketController.getAllTeamsStats,
  },
  {
    method: "PUT",
    url: "/api/cricket/:matchId",
    handler: CricketController.updateMatchDetails,
  },
  {
    method: "DELETE",
    url: "/api/cricket/:matchId",
    handler: CricketController.deleteMatchDetails,
  },
];

module.exports = {
  routes,
};
