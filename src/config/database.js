const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://paruchurichaitanyakrishna6_db_user:kqecz3RkYrzvJ0qT@namastenode.hsu8vdo.mongodb.net/devTinder"
  );
};

module.exports = connectDB; 