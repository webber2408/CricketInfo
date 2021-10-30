const mongoose = require("mongoose");

const topicNodeSchema = new mongoose.Schema({
  name: String,
  topicId: String,
  player_of_match: String,
  team1: String,
  team2: String,
  winner: String,
  matchId: String,
});

module.exports = mongoose.model("TopicNodes", topicNodeSchema);
