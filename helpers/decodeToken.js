import jwt from "jsonwebtoken";

import config from "../config/config.js";

const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (err) {
    return new Error("token is not valid");
  }
};

export default decodeToken;
