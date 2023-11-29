const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json("No token found");
  }
  try {
    const key = process.env.SECRET_KEY;
    let user = await JWT.verify(token, key);
    req.user = user.email;
    next();
  } catch (error) {
    return res.status(400).json("Invalid token");
  }
};
