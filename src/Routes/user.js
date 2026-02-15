const express = require("express");
const userRoute = express.Router();
const ConnectionRequest = require("../Models/connectionRequest.js");
const { userAuth } = require("../Middleware/auth.js");
const User = require("../Models/user.js");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Create GET /user/requests/received get all the pending connection request for the login user
userRoute.get("/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User Not found");
    }
    console.log(user._id);

    const Request_recevied = await ConnectionRequest.find({
      toUserId: user._id,
      status: "Interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);
    if (
      Request_recevied.length === 0 ||
      Request_recevied == null ||
      Request_recevied == undefined
    ) {
      throw new Error("Their is not Request!!!!");
    }

    res.status(200).json({
      message: "Successfull fetch the request received",
      data: Request_recevied,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

// Create GET /user/connections
userRoute.get("/connection", userAuth, async (req, res) => {
  try {
    const Loginuser = req.user;
    if (!Loginuser) {
      return res.status(400).send("Invalid login user");
    }
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: Loginuser._id, status: "Accepted" },
        { fromUserId: Loginuser._id, status: "Accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    console.log(connectionRequest);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === Loginuser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(400).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error :" + error.message);
  }
});

userRoute.get("/feed", userAuth, async (req, res) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers.authorization);
    // User should see all the user cards except
    // 0. his own card
    // 1. his connections
    // 2. ignored people
    // 3. already sent the connection request

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    console.log(`${page} ${limit}`);
    const skip = (page - 1) * limit;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // console.log(connectionRequest

    const hideUsersFromfeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromfeed.add(req.fromUserId.toString());
      hideUsersFromfeed.add(req.toUserId.toString());
    });

    // console.log(hideUsersFromfeed);

    const user = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(hideUsersFromfeed),
          },
        },
        {
          _id: {
            $ne: loggedInUser._id,
          },
        },
      ],
    })
      .skip(skip)
      .limit(limit);

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error :" + error.message);
  }
});

module.exports = {
  userRoute,
};
