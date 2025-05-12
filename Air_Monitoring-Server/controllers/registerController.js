const User = require("../model/User");
const Device = require("../model/Device");

const Air = require("../model/Air");

const NodeGeocoder = require("node-geocoder");

const bcrypt = require("bcrypt");
const allRoles = require("../config/roles_list");

const options = {
  provider: "openstreetmap",
};
function getRandomDeviceId() {
  return Math.random().toString(36).substring(2, 20).toUpperCase();
}
// const postLiveAirQuality = async (req, res) => {
//   try {
//     console.log("asdjf");
//     const { lat, lon, utc, pm2, deviceId } = req.body;
//     const geocoder = NodeGeocoder(options);
//     console.log("asdf ----", lat, lon);
//     const geoRes = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
//     );
//     console.log("geores");
//     const geoResJson = await geoRes.json();
//     const result = await Air.findOneAndUpdate(
//       { lat, lon },
//       {
//         utc,
//         city: geoResJson.address.city,
//         city_district: geoResJson.address.city_district,
//         pm2,
//         country: geoResJson.address.country,
//         deviceId: deviceId,
//       },
//       { upsert: true, new: true }
//     );

//     return res.json({ success: true, message: "hello world", data: result });
//   } catch (err) {
//     console.error("err", err);
//     return res.json({
//       success: false,
//       message: "hello world",
//       data: err?.message,
//     });
//   }
// };
const postLiveAirQuality = async (req, res) => {
  const userId = req.userInfo.id || req.userInfo._id;

  // console.log("reqreq", req.body);
  const {
    pm25,
    mac_address,
    pm10,
    temperature,
    time,
    humidity,
    co2_ppm,
    aqi_status,
    city,
  } = req.body;

  try {
    // if (userId) {
    //   const user = await User.findById(userId);
    //   console.log("user", user);
    //   if (!user) return res.status(404).json({ message: "User not found" });
    //   user.points = user.points + 1;
    //   await user.save();
    // }
    const device = await Device.findOne({ mac_address });
    const user = await User.findById(device.owned_by);
    user.points = user.points + 1;
    await user.save();

    const result = await Air.create({
      pm25,
      pm10,
      mac_address,
      temperature,
      time,
      city,
      humidity,
      co2_ppm,
      aqi_status,
      utc: new Date(),
    });

    console.log("db res", result);

    return res.json({
      success: true,
      message: "Successfully inserted Air data",
      data: req.body,
    });
  } catch (err) {
    console.log("err in postliveairquality", err);
    return res.json({
      success: false,
      message: "Something went wrong",
      data: err,
    });
  }
};

const getAqiWithMac = async (req, res) => {
  try {
    const { mac_address } = req.params;

    const result = await Air.find({ mac_address }).sort({ utc: -1 }).limit(60);

    console.log("result", result);

    return res.json({ success: true, message: "hit", data: result });
  } catch (err) {
    console.error("err", err);
    return res.json({
      success: false,
      message: "Something went wrong",
      data: err,
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const userId = req.userInfo.id || req.userInfo._id;

    // console.log("asdjf", req.params.userId);
    const user = await User.findById(req.params.userId);
    console.log("user", user);

    return res.json({ success: true, message: "User Data", data: user });
  } catch (err) {
    console.error("err", err);
    return res.json({
      success: false,
      message: "hello world",
      data: err?.message,
    });
  }
};

const getDevicesOfUser = async (req, res) => {
  try {
    const userId = req.userInfo.id || req.userInfo._id;

    console.log("user Id", req.userInfo.id);

    const devices = await Device.find({ owned_by: userId });

    console.log("devices --- ", devices);

    // let devicesWithLocation = [];

    // devices.forEach(async (device) => {
    //   let latestAir = await Air.findOne({
    //     mac_address: device.mac_address,
    //   });

    //   devicesWithLocation.push({
    //     ...device,
    //     location: latestAir?.city || "N/A",
    //   });
    // });
    // console.log("devicesWithLocation --- ", devicesWithLocation);

    return res.json({
      success: true,
      message: "Successfully found devices.",
      data: devices,
    });
  } catch (err) {
    console.error("err", err);
    return res.json({
      success: false,
      message: "hello world",
      data: err?.message,
    });
  }
};

const getAllAirData = async (req, res) => {
  try {
    const result = await Air.find().exec();
    return res.json({
      success: true,
      message: "Successfully retrieved all air quality data",
      data: result,
    });
  } catch (err) {
    console.error("err", err);
    return res.json({
      success: false,
      message: "Something went wrong",
      data: err,
    });
  }
};

const putDevicesInUsers = async (req, res) => {
  try {
    const userId = req.userInfo._id || req.userInfo.id;
    console.log("req.userInfo", req.userInfo);

    const { sensorId } = req.body;

    const user = await User.findById(userId);

    console.log("userId", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    const device = await Device.findOneAndUpdate(
      { mac_address: sensorId },
      {
        owned_by: userId,
      },
      { new: true }
    );

    console.log("device 1231 1231", device);

    // device.owned_by = userId;
    // const result = await device.save();

    return res.json({
      success: true,
      message: "Successfully assigned device.",
      data: device,
    });
  } catch (err) {
    console.error("err", err);

    return res.json({
      success: false,
      message: "Something went wrong when assiging device.",
      data: err,
    });
  }
};
const insertDevice = async (req, res) => {
  const { deviceId } = req.body;
  console.log("deviceId", deviceId);

  try {
    const device = await Device.find({ mac_address: deviceId });
    console.log("device ", device);

    if (device?.length && device.length > 0) {
      return res.json({
        success: false,
        message: "Device with the ID already exists",
        data: null,
      });
    }

    const result = await Device.create({
      mac_address: deviceId,
      registered_at: new Date(),
    });
    console.log("result", result);

    return res.json({
      success: true,
      message: "Successfully inserted device.",
      data: result,
    });
  } catch (err) {
    console.error("err", err);

    return res.json({
      success: false,
      message: "Something went wrong when inserting device.",
      data: err,
    });
  }
};
const echoIot = async (req, res) => {
  try {
    console.log("req.body", req.body);
    // const result = await Air.find().exec();
    return res.json({
      success: true,
      message: "Successfully retrieved all air quality data",
      data: req.body,
    });
  } catch (err) {
    console.error("err", err);
    return res.json({
      success: false,
      message: "Something went wrong",
      data: err,
    });
  }
};
const getUniqueDistrictInformation = async (req, res) => {
  try {
    const uniqueDistricts = await Air.aggregate([
      {
        $group: {
          _id: "$city_district",
        },
      },
      {
        $project: {
          city_district: "$_id",
          _id: 0,
        },
      },
    ]);

    return res.json({
      success: true,
      message: "Successfully retrieved unique districts",
      data: uniqueDistricts,
    });
  } catch (err) {
    console.error("err", err);
    return res.json({
      success: false,
      message: "Something went wrong",
      data: err,
    });
  }
};

const getAverageFromCityDistrict = async (req, res) => {
  const { city_district } = req.params;
  console.log("city_district", city_district);
  try {
    const average = await Air.aggregate([
      {
        $match: {
          city_district: city_district,
        },
      },
      {
        $group: {
          _id: null,
          averagePM2: { $avg: { $toDouble: "$pm2" } },
        },
      },
    ]);

    console.log("average", average);

    return res.json({
      success: true,
      message: `Found average AQI for ${city_district} district`,
      data: average,
    });
  } catch (err) {
    console.error("err", err);
    return res.json({
      success: false,
      message: `Something went wrong when averaging for ${city_distrcit}`,
      data: err,
    });
  }
};

// const handleNewDriver = async (req, res) => {
//   const { username, password, roles, email, companyId } = req.body;
//   const hashedPwd = await bcrypt.hash(password, 10);
//   if (!username || !password || !roles || !email)
//     return res
//       .status(400)
//       .json({ message: "Username | password | email | roles are required" });

//   //check for duplicate emails in database;
//   const duplicate = await User.findOne({ email }).exec();
//   if (duplicate)
//     return res.status(409).json({ error: "User email Already Exists!" }); //Conflict
//   // console.log("comid --------------------", companyId);

//   if (companyId) {
//     const companyExists = await Company.findById(companyId).exec();

//     console.log("does compnay exist?? ====\n", companyExists, "nnsadfdsf");

//     if (companyExists) {
//       const result = await User.create({
//         username,
//         email,
//         password: hashedPwd,
//         companyId,
//         roles,
//       });
//       if (result) {
//         companyExists.drivers = [...companyExists.drivers, result._id];
//         const companyData = await companyExists.save();
//         return res
//           .status(201)
//           .json({ success: `New Driver ${username} created ` });
//       }
//     } else {
//       return res.status(400).json({
//         error: "Cannot create driver because company does not exist.",
//       });
//     }
//     console.log("result", result);
//   } else {
//     return res.status(400).json({
//       error: "CompanyID is required.",
//     });
//   }
// };

const handleNewCompany = async (req, res) => {
  const { name, password, roles, email, location, contact, insurance } =
    req.body;
  // console.log("reqbody", req.body);
  if (!name || !password || !roles || !email || !location || !contact)
    return res.status(400).json({ message: "Not all required fields are met" });

  console.log("req.body", req.body);
  //check for duplicate usernames in database;
  const duplicate = await Company.findOne({ name }).exec();
  if (duplicate)
    return res.status(409).json({ error: "Company name Already Exists!" }); //Conflict
  try {
    //encrypted passwrod
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await Company.create({
      name,
      email,
      passwordHash: hashedPwd,
      roles,
      contact,
      insurance,
      location,
    });
    console.log("result", result);

    res
      .status(201)
      .json({ success: true, message: `New Company ${name} created ` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleNewCompany,
  postLiveAirQuality,
  getAverageFromCityDistrict,
  getAllAirData,
  echoIot,
  getDevicesOfUser,
  putDevicesInUsers,
  getUniqueDistrictInformation,
  getUserData,
  getAqiWithMac,
  insertDevice,
};
