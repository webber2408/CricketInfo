const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  topicName: String,
  topicDescription: String,
  topicId: String,
  topicData: Array,
  topicStatus: Number,
});

module.exports = mongoose.model("Topic", topicSchema);
