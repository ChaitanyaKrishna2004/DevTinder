const express = require("express");
const profileRoute = express.Router();
const { userAuth } = require("../Middleware/auth.js");
const { validteProfileEdit } = require("../utils/validateuser.js");
const User = require("../Models/user.js");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRoute.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send("Error :" + error.message);
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

    res.json({
      "message" : "Profile was successful updated",
      "data" : loginuser
    });
  } catch (error) {
    console.log(error);
    res.status(404).send("Error :" + error.message);
  }
});

profileRoute.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, updatesPassword } = req.body;
    const isPasswordValid = bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("invalid user details");
    }

    if (!validator.isStrongPassword(updatesPassword)) {
      throw new Error("New Password was not stonge");
    }

    const passwordHash = await bcrypt.hash(updatesPassword, 10);
    console.log(passwordHash);

    const filter = { firstName: user.firstName };
    const update = { password: updatesPassword };

    // const doc = await User.findOneAndUpdate(filter, update);
    // doc;

    res.send("Password is updated");
  } catch (error) {
    console.log(error);
    res.status(404).send("Error :" + error.message);
  }
});

module.exports = {
  profileRoute,
};
