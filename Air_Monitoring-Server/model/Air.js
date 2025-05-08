const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const airSchema = new Schema({
  lat: {
    type: String,
    required: false,
  },
  mac_address: {
    type: String,
    required: false,
  },
  lon: {
    type: String,
    required: false,
  },
  utc: { type: Date, required: false },
  city: { type: String, required: false },
  city_district: { type: String, required: false },
  pm25: {
    type: Number,
    required: true,
  },
  pm10: {
    type: Number,
    required: true,
  },

  temperature: {
    type: Number,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  // co2_ppm: { type: String, required: true },
});

module.exports = mongoose.model("Air", airSchema);
