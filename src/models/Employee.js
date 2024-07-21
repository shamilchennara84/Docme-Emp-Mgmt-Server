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
    type: String,
    required: true,
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
    type: String,
    required: true,
  },
});
const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
