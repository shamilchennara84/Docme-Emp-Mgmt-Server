const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
  },
  phone: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
});
const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
