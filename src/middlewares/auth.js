import jwt from "jsonwebtoken";

import config from "../../config/config.js";

const auth = (req, res, next) => {
  // get token from header
  const token = req.header("Authorization");

  // check if not token
  if (!token) {
    console.log("Token Not found!!");
    return res.status(401).json({ msg: "No token, authorization denied!" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.decoded = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    console.log(token);
    console.log("Token is not valid");
    res.status(401).json({ msg: "Token is not valid!" });
  }
};

export default auth;
