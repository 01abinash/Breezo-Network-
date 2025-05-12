const mongoose = require("mongoose");
const { any } = require("zod");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  mac_address: {
    type: String,
    required: true,
  },
  registered_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  owned_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: null,
  },
  total_transmissions: {
    type: Number,
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("Device", deviceSchema);
