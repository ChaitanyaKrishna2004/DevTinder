const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello from the server");
});

app.listen(7000, () => {
  console.log("The server is listing on the port 7000");
});
