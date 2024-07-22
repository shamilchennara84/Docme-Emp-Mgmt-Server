const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const Location = require("../models/Location");
const Designation = require("../models/Designation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// ====================================================================

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ====================================================================

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log(password, admin.password);
    const match = await bcrypt.compare(password, admin.password);
    if (match) {
      const token = generateToken(admin._id, "admin");
      res.json({ success: true, message: "Login successful", token });
    } else {
      res.json({ success: false, message: "Password did not match" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while checking the password" });
  }
};

// =====================================================

// List employees

exports.listEmployees = async (req, res) => {
  try {
    const result = await Employee.aggregate([
      {
        $lookup: {
          from: "designations",
          localField: "designation",
          foreignField: "_id",
          as: "designationInfo",
        },
      },
      {
        $unwind: {
          path: "$designationInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          designationTitle: "$designationInfo.title",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locationInfo",
        },
      },
      {
        $unwind: {
          path: "$locationInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          city: "$locationInfo.city",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          age: 1,
          //   designation: 1,
          designationTitle: 1,
          phone: 1,
          employeeId: 1,
          email: 1,
          address: 1,
          //   location: 1,
          city: 1,
        },
      },
    ]);

    res.json({
      success: true,
      message: "Employees fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching employees",
    });
  }
};

// =====================================================

// get employee by id

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = mongoose.Types.ObjectId.createFromHexString(id);
    const result = await Employee.aggregate([
      {
        $match: {
          _id: objectId,
        },
      },
      {
        $lookup: {
          from: "designations",
          localField: "designation",
          foreignField: "_id",
          as: "designationInfo",
        },
      },
      {
        $unwind: {
          path: "$designationInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          designationTitle: "$designationInfo.title",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locationInfo",
        },
      },
      {
        $unwind: {
          path: "$locationInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          city: "$locationInfo.city",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          age: 1,
          designationTitle: 1,
          phone: 1,
          employeeId: 1,
          email: 1,
          address: 1,
          city: 1,
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee fetched successfully",
      data: result[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the employee",
    });
  }
};

// =====================================================

// update employee by id

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  console.log(req.body, "body");
  const { location, designation, ...otherUpdates } = req.body;

  const locationData = await Location.findOne({ city: location });
  if (!location) {
    return res.status(404).json({
      success: false,
      message: "Location not found",
    });
  }

  console.log(location);
  const designationData = await Designation.findOne({ title: designation });
  if (!designation) {
    return res.status(404).json({
      success: false,
      message: "Designation not found",
    });
  }

  const updates = {
    ...otherUpdates,
    location: locationData._id,
    designation: designationData._id,
  };
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the employee",
    });
  }
};

// =====================================================

// delete employee by id

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
      data: deletedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the employee",
    });
  }
};

// =====================================================

// create Emplloyee

exports.createEmployee = async (req, res) => {
  try {
    const { location, designation, ...otherUpdates } = req.body;

    const existingEmployee = await Employee.findOne({
      employeeId: otherUpdates.employeeId,
    });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    const locationData = await Location.findOne({ city: location });
    if (!locationData) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    const designationData = await Designation.findOne({ title: designation });
    if (!designationData) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    const updates = {
      ...otherUpdates,
      location: locationData._id,
      designation: designationData._id,
    };

    const newEmployee = new Employee(updates);

    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: savedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the employee",
    });
  }
};
