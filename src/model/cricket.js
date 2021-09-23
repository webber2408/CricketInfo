const mongoose = require('mongoose');

const cricketSchema = new mongoose.Schema({
  city: String,
  date: String,
  player_of_match: String,
  team1: String,
  team2: String,
  winner: String,
  matchId: String
});

module.exports = mongoose.model('Cricket', cricketSchema);
