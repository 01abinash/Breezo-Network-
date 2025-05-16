const UpcommingTrips = require("../model/UpcommingTrips");
const User = require("../model/User");
const Users = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");

const handleGetAllUsers = async (req, res) => {
  try {
    // console.log("\nhello");
    const allUsers = await Users.find({}).exec();
    return res.status(200).json(allUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json(allUsers);
  }
};
const handle = async (req, res) => {
  const { id } = req.params;
  const { device_ids } = req.body;
  try {
    const user = await Users.find({ email: id }).exec();

    await Users.findOneAndUpdate({ email: id }, { ...user, device_ids });

    return res.status(200).json(allUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json(allUsers);
  }
};

const deleteUser = async (req, res) => {
  console.log(req.body.id);
  try {
    const UserId = req.body.id;
    const result = await Users.findOneAndDelete({ _id: UserId });
    if (result) {
      return res.status(200).json({
        success: true,
        message: "User succesfully deleted.",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updateObject = { $set: updateData };

    // Find the company by ID and update
    const updatedUser = await User.findByIdAndUpdate(userId, updateObject, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const viewBookedTrips = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const bookedTrips = user.booked_trips;

    return res.status(200).json({ success: true, bookedTrips });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteBookedTrips = async (req, res) => {
  try {
    const tripId = req.params.id;
    const result = await UpcommingTrips.findOne({ _id: tripId }).exec();

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    if (result) {
      const user = await Users.findOne({ email: req.email }).exec();
      console.log("user", user);

      user.booked_trips.pull(tripId); // Remove trip with given ID
      const bookedTrips = user.booked_trips;
      await user.save();
      return res.status(200).json({ success: true, bookedTrips });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateBookedTrips = async (req, res) => {
  try {
    const tripId = req.params.id;
    const updatedTripData = req.body;
    // Find the trip by its ID
    const trip = await UpcommingTrips.findById(tripId);

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    // Find the user by email
    const user = await Users.findOne({ email: req.email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the index of the trip in the user's booked_trips array
    const tripIndex = user.booked_trips.findIndex(
      (trips) => trips._id.toString() === tripId
    );

    if (tripIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Trip not found in user's booked trips",
      });
    }

    // Update the trip with the new data
    user.booked_trips[tripIndex] = {
      ...user.booked_trips[tripIndex],
      ...updatedTripData,
    };

    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      bookedTrips: user.booked_trips,
    });
    // if (!result) {
    //   return res.status(404).json({ success: false, message: 'Trip not found' });
    // }
    // const user = await Users.findOne({ email: req.email }).exec();
    // console.log("user", user);

    // // const updateData = req.body; // Get update data from request body

    // // const updateObject = { $set: updateData };

    // // Find the company by ID and update
    // // const updatedUser = await User.findByIdAndUpdate(req.email, updateObject, { new: true });

    // // Find the trip inside the user's array
    // const tripIndex = user.booked_trips.findIndex(trip => trip._id === tripId);
    // if (tripIndex === -1) {
    //   return res.status(404).json({ success: false, message: 'Trip not found' });
    // }

    // const trip = user.booked_trips[tripIndex];
    // const bookedTrips = user.booked_trips;
    // user.booked_trips[tripIndex] = { ...user.booked_trips[tripIndex], ...updatedTrip };
    // await user.save();

    // return res.status(200).json({ success: true, bookedTrips });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getUserDetails = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Bearer missing in authorization header." });
  }

  const token = authHeader.split(" ")[1];
  // console.log("TOKEN ",token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error("\n Error:", err);
      return res.sendStatus(403);
    }

    const foundUser = await User.findOne({
      email: decoded.UserInfo.email,
    }).exec();
    // console.log(foundUser);
    if (!foundUser) {
      console.log("401:", email, "User does not exist");
      return res
        .status(401)
        .json({ error: "Unauthorized: User does not exist." });
    }

    res.status(200).json({ success: foundUser }); // Attach result to req object
  });
};

module.exports = {
  handleGetAllUsers,
  deleteUser,
  updateUser,
  viewBookedTrips,
  deleteBookedTrips,
  updateBookedTrips,
  getUserDetails,
};
