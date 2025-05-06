const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const upcommingTripsSchema = new Schema({
  companyId: {
    type: String,
    required: true,
  },
  driverId: {
    type: String,
    required: false,
  },
  pickUpPoint: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  banner: String,
  passengerIds: [String],
  Status: String,
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  ticket: {
    type: String
  }
});

// Create text index
upcommingTripsSchema.index({ destination: "text", pickUpPoint: "text" });

module.exports = mongoose.model("UpcommingTrips", upcommingTripsSchema);
