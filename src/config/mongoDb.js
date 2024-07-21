const mongoose = require("mongoose");
const dotenv = require("./dotenv");

// MongoDB Connection Function
const connectMongo = async () => {
  try {
    await mongoose.connect(dotenv.MONGO_URI);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectMongo;
