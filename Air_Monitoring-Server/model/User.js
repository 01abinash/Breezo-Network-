const mongoose = require("mongoose");
const { any } = require("zod");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  device_ids: [{ type: String, required: false }],
  points: {
    type: Number,
    default: 10.23, //For dummy purpose
  },
});

module.exports = mongoose.model("User", userSchema);
