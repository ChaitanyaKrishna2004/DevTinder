const express = require("express");
const authRoute = express.Router();
const { validateSignUpdata } = require("../utils/validateuser.js");
const User = require("../Models/user.js");
const bcrypt = require("bcrypt");

authRoute.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    console.log(`${firstName} ${lastName} ${emailId} ${password}`);
    //validation of data
    validateSignUpdata(req);

    //hashing the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully!!!");
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("Error occured when saving the user data" + error.message);
  }
});

authRoute.post("/login", async (req, res) => {
  console.log("this is the login api");
  try {
    const { emailId, password } = req.body;
    // getting the user data
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid details");
    }

    const isPasswordValid = await user.isPasswordValid(password, user.password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log(token);
      if (!token) {
        throw new Error("Token is Invalid");
      }
      res
        .status(200)
        .cookie("token", token, { expiresIn: Date.now() + 5 * 1000 })
        .send("Login was successful");
    } else {
      throw new Error("Invalid details");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error:" + err.message);
  }
});

authRoute.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User Successfully Logout");
});

module.exports = {
  authRoute,
};
