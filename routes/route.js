const CricketController = require("../src/controller/cricketController");
const AuthenticationController = require("../src/controller/authenticationController");
const UserController = require("../src/controller/userController");

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

const authenticationRoutes = [
  {
    method: "POST",
    url: "/api/login",
    handler: AuthenticationController.login,
  },
  {
    method: "POST",
    url: "/api/register",
    handler: AuthenticationController.register,
  },
];

const userRoutes = [
  {
    method: "GET",
    url: "/api/user/profile",
    handler: UserController.getUserProfile,
  },
];

module.exports = {
  routes,
  userRoutes,
  authenticationRoutes,
};
