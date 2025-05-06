//CORS
const whitelist = [
  "http://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:3001",

  "http://127.0.0.1:5501",
  "http://localhost:3501",
  "https://www.google.com",
  "http://localhost:5174",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
