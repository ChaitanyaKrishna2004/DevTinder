const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./Models/user.js");
const { default: mongoose } = require("mongoose");
const { validateSignUpdata } = require("./utils/validateuser.js");
const bcrypt = require("bcrypt");
const { use } = require("react");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/singup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // getting the user data
    const user = await User.findOne({ emailId: emailId });
    console.log(user);
    if (!user) {
      throw new Error("Invalid details");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, "DevTinder@123");
      res.status(200).cookie("token", token);

      res.send("Login was successful");
    } else {
      throw new Error("Invalid details");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error:" + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Error occured while geting the user", error.message);
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const userId = await req.params.userId;
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    res
      .status(400)
      .send("Error occured while geting the userbyid", error.message);
  }
});

// app.post("/user", async (req, res) => {
//   const user = new User(req.body);
//   try {
//     await user.save();
//     res.status(200).send("user was added successfully!");
//   } catch (error) {
//     console.log(error);
//     res.status(404).send("Error occured while adding the user", error);
//   }
// });

// app.get("/user", async (req, res) => {
//   try {
//     const user = await User.findOne({
//       emailId: "paruchurichaitanyakrishna6@gmail.com",
//     });
//     res.send(user);
//   } catch (error) {
//     res.status(400).send("Error occured while geting the user", error.message);
//   }
// });

app.patch("/user/:userId", async (req, res) => {
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
app.delete("/user/:userId", async (req, res) => {
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

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decoded = jwt.verify(token, "DevTinder@123");
    console.log(decoded._id);
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("Invalid Token");
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send("Error :", error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7000, () => {
      console.log("The server is listing on the port 7000");
    });
  })
  .catch((error) => {
    console.error("Database can not be connected!!", error);
  });
