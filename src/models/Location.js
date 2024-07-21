// src/models/Location.js
const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Location = mongoose.model("Location", LocationSchema);

module.exports = Location;
