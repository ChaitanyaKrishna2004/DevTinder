const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./Models/user.js");

app.post("/singup", async (req, res) => {
  const user = new User({
    firstName: "Trilokesh",
    lastelName: "Venkata",
    emailId: "Trilokesh@Venkata.com",
    age: 35,
  });

  try {
    await user.save();
    res.send("User Added Successfully!!!");
  } catch (error) {
    res
      .status(400)
      .send("Error occured when saving the user data", error.message);
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
