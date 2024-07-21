const mongoose = require("mongoose");

const DesignationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const Designation = mongoose.model("Designation", DesignationSchema);

module.exports = Designation;
