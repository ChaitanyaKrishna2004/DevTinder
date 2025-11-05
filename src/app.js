const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello welcome to the learning nodejs");
});

app.listen(3000, () => {
  console.log("Server is successfull listen on the port 3000");
});
