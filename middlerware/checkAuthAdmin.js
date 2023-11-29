const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
const Auth = require("../models/authModel");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const key = process.env.SECRET_KEY;
    const decoded = await JWT.verify(token, key);

    // Fetch user information from the database based on the email or user identifier
    const user = await Auth.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Decoded Token:", decoded);
    console.log("User from Database:", user);
    
    // Check if the user has the role of 'admin'
    if (user.role !== "admin") {
      return res.status(403).json( { message: "Access forbidden. Admin only." });
    }

    req.user = {
      email: user.email,
      role: user.role, // Include the user's role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
