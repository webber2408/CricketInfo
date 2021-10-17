const CricketController = require("../src/controller/cricketController");
const AuthenticationController = require("../src/controller/authenticationController");
const UserController = require("../src/controller/userController");
const TopicController = require("../src/controller/topicController");
const PublishController = require("../src/controller/publishController");

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

const topicRoutes = [
  {
    method: "GET",
    url: "/api/topic/all",
    handler: TopicController.getAllTopics,
  },
  {
    method: "POST",
    url: "/api/topic/",
    handler: TopicController.addTopic,
  },
  {
    method: "GET",
    url: "/api/user/:userEmail/topic/:topicId/subscribe",
    handler: TopicController.subscribeToTopic,
  },
  {
    method: "GET",
    url: "/api/user/:userEmail/topic/:topicId/unsubscribe",
    handler: TopicController.unsubscribeToTopic,
  },
  {
    method: "GET",
    url: "/api/user/:email/topic/available",
    handler: TopicController.getAllAvailableTopics,
  },
  {
    method: "GET",
    url: "/api/user/:email/topic/subscribed",
    handler: TopicController.getUserTopics,
  },
];

const publishRoutes = [
  {
    method: "POST",
    url: "/api/publish",
    handler: PublishController.publishMessage,
  },
];

module.exports = {
  routes,
  userRoutes,
  topicRoutes,
  authenticationRoutes,
  publishRoutes,
};
