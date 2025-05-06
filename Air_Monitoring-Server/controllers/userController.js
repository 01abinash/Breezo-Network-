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

    await Users.findOneAndUpdate({ email: id }, { ...user, device_ids:  });

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

const bookTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const { return_url, website_url } = req.body;
    const result = await UpcommingTrips.findOne({ _id: tripId }).exec();

    if (!return_url && !website_url)
      res
        .status(400)
        .json({ message: "return_url and website_url are required." });
    else if (!result)
      res.status(400).json({ message: "Upcomming trip does not exist" });

    const amount = result.price;

    const payload = {
      return_url,
      website_url,
      amount: amount * 100,
      purchase_order_id: crypto.randomBytes(16).toString("hex"),
      purchase_order_name: result.pickUpPoint + "_to_" + result.destination,
    };

    const user = await Users.findOne({ email: req.email }).exec();
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // console.log("user", user);

    try {
      // console.log("payload", payload);
      const khaltiResponse = await fetch(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // if (khaltiResponse.ok) {
      console.log("khaltiResponse", { ...khaltiResponse });
      const resData = await khaltiResponse.json();
      console.log("khalti response", resData);

      // Generate a random seat number between 1 to 50
      const seatNumber = Math.floor(Math.random() * 50) + 1;

      // Create a ticket object with unique ID and seat number
      const ticket = {
        id: crypto.randomBytes(8).toString("hex"),
        seatNumber,
      };

      // Add the ticket to the user's booked trips
      user.booked_trips.push({ ...result.toObject(), ticket });
      // user.booked_trips.push(result);

      // Save the updated user
      const userSaved = await user.save();
      console.log("usersaved", userSaved);

      return res.status(200).json(resData);
      // }
    } catch (err) {
      console.error("Khalti Payment Err:", err);
      return res.status(500).json({ message: "Internal server error." });
    }

    // return res
    //   .status(200)
    //   .json({ message: "successfully updated booked Trips" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get company ID from request parameters
    const updateData = req.body; // Get update data from request body

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
  bookTrip,
  updateUser,
  viewBookedTrips,
  deleteBookedTrips,
  updateBookedTrips,
  getUserDetails,
};
