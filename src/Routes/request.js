const express = require("express");
const requestRoute = express.Router();
const { userAuth } = require("../Middleware/auth.js");
const ConnectionRequestModel = require("../Models/connectionRequest.js");
const validator = require("validator");
const User = require("../Models/user.js");

requestRoute.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    console.log("This is a send api");
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const Requeststatus = req.params.status;

    // console.log(`${fromUserId} ${toUserId} ${status}`);

    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(404).send("user is not fount");
    }

    if (!["Ignored", "Interested"].includes(Requeststatus)) {
      return res
        .status(400)
        .json({ message: "Invalid status type: " + Requeststatus });
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
      status: Requeststatus,
    });

    const data = await ConnectionRequest.save();

    res.status(200).json({
      message: "Connection Request Sent Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error :" + error.message);
  }
});

requestRoute.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    console.log("This is a review api");
    const loginUser = req.user;
    const Requeststatus = req.params.status;
    const requestedId = req.params.requestId;
    console.log(`${Requeststatus} ${requestedId} ${loginUser._id}`);
    const validstatus = ["Accepted", "Rejected"];
    if (!validstatus.includes(Requeststatus)) {
      return res.status(400).send("Invalid status");
    }
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestedId,
      toUserId: loginUser._id,
      status: "Interested",
    });

    console.log(connectionRequest);

    if (!connectionRequest) {
      return res.status(404).send("connection Request is not found!");
    }

    connectionRequest.status = Requeststatus;
    const data = await connectionRequest.save();
    res.status(200).json({
      message: "Match the connection",
      data: data,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

module.exports = {
  requestRoute,
};
