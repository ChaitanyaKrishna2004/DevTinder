require('dotenv').config()
const express = require("express");
const connectDB = require("./src/config/database.js");
const app = express();
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const { authRoute } = require("./src/Routes/auth.js");
const { profileRoute } = require("./src/Routes/profile.js");
const { requestRoute } = require("./src/Routes/request.js");
const { userRoute } = require("./src/Routes/user.js");

app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/request", requestRoute);
app.use("/user", userRoute);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT, () => {
      console.log("The server is listing on the port 7000");
    });
  })
  .catch((error) => {
    console.error("Database can not be connected!!", error);
  });
