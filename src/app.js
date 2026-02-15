const express = require("express");
const connectDB = require("./config/database.js");
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

const { authRoute } = require("./Routes/auth.js");
const { profileRoute } = require("./Routes/profile.js");
const { requestRoute } = require("./Routes/request.js");
const { userRoute } = require("./Routes/user.js");

app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/request", requestRoute);
app.use("/user", userRoute);

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
