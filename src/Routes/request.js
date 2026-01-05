const express = require("express");
const requestRoute = express.Router();
const { userAuth } = require("../Middleware/auth.js");
const ConnectionRequestModel = require("../Models/connectionRequest.js");
const validator = require("validator");
const User = require("../Models/user.js");

requestRoute.get("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    // console.log(`${fromUserId} ${toUserId} ${status}`);

    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(404).send("user is not fount");
    }

    if (!["Ignored", "Interested"].includes(status)) {
      return res.status.json({ message: "Invalid status type: " + status });
    }

    // IF their existing connection request
    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error("the connection request is already exist");
    }

    const ConnectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await ConnectionRequest.save();

    res.json({
      message: "Connection Request Sent Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error :" + error.message);
  }
});

module.exports = {
  requestRoute,
};
