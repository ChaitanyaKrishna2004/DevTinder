const express = require("express");
const profileRoute = express.Router();
const { userAuth } = require("../Middleware/auth.js");
const { validteProfileEdit } = require("../utils/validateuser.js");
const user = require("../Models/user.js");

profileRoute.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send("Error :", error.message);
  }
});

profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validteProfileEdit(req);

    const loginuser = req.user;
    console.log(loginuser);

    Object.keys(req.body).forEach((key) => (loginuser[key] = req.body[key]));
    console.log(loginuser);
    await loginuser.save();

    res.send("Profile was successful updated");
  } catch (error) {
    console.log(error);
    res.status(404).send("Error :", error.message);
  }
});

module.exports = {
  profileRoute,
};
