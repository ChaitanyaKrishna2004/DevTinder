const jwt = require("jsonwebtoken");
const User = require("../Models/user.js");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    var decoded = await jwt.verify(token, "DevTinder@123");
    if (!decoded) {
      throw new Error("Invalid Token");
    }
    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Invalid user");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("Error :" + error.message);
  }
};

module.exports = {
  userAuth,
};
