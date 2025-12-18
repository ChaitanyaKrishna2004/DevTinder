const express = require("express");
const userRoute = express.Router();

const User = require("../Models/user.js");

userRoute.get("/user", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Error occured while geting the user", error.message);
  }
});

userRoute.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    res
      .status(400)
      .send("Error occured while geting the userbyid", error.message);
  }
});

userRoute.patch("/user/:userId", async (req, res) => {
  try {
    const Allowed_Update = [
      "_id",
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
      "updatedAt",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Update.includes(K)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const userId = req.params.userId.trim();
    // const userId = new mongoose.Types.ObjectId(userId1);
    console.log("Updating the user", userId);
    const user = await User.findByIdAndUpdate(userId, req.body);
    res.send(user);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("Error occured while updating the user", error.message);
  }
});

//find the user by id and delete
userRoute.delete("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    res.send(user);
  } catch (error) {
    res
      .status(400)
      .send("Error occured while geting the userdelete", error.message);
  }
});

module.exports = {
  userRoute,
};
