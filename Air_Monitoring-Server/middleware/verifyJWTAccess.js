const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWTAccess = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Bearer missing in authorization header." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("\n Error:", err);
      return res.sendStatus(403);
    }
    // req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    req.email = decoded.UserInfo.email;

    if(req.roles == Admin) next();
    else return res.sendStatus(403); 

  });
};


const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);
        const result = req.roles
        .map((role) => rolesArray.includes(role))
        .find((val) => val == true);
        console.log("result", result);
        if (!result) return res.sendStatus(403); //Forbidden
        next();
    };
};

module.exports = verifyRoles;
  

module.exports = { verifyJWTAccess };