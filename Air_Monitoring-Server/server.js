require("dotenv").config();
const path = require("path");
const express = require("express");
// const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { verifyJWT } = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const verifyRoles = require("./middleware/verifyRoles");

//Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3501;

//custom middleware logger
// app.use(logger);

app.use(cors());
app.use(cookieParser());

// built in middleware to handle urlencoded data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//built in middleware to extract json data from req
app.use(express.json());

//serve static files || use public directory for specific routes
app.use(express.static(path.join(__dirname, "/public"))); // '/' is the default when no first argument

app.use(cookieParser());
//Route Handlers

app.use(require("./routes/api/register"));
app.use(require("./routes/api/auth"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// app.use(errorHan dler);

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
