const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  status: Number,
  subscribedTopicIds: Array,
  receiveAdvertisements: Boolean,
});

module.exports = mongoose.model("User", userSchema);
