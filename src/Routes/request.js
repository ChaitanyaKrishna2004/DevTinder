const express = require("express");
const requestRoute = express.Router();

const { userAuth } = require("../Middleware/auth.js");

requestRoute.get("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " send the Connection Request");
  } catch (error) {
    res.status(400).send("Error :", error.message);
  }
});

module.exports = {
  requestRoute,
};
