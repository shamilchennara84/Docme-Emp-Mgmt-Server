const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// ====================================================================

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ====================================================================

// Employee Login

exports.employeeLogin = async (req, res) => {
  const { employeeId, password } = req.body;
  console.log(req.body);

  try {
    const employee = await Employee.findOne({
      employeeId: employeeId,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const match = await bcrypt.compare(password, employee.password);
    if (match) {
      const token = generateToken(employee._id, "employee");

      res.json({ success: true, message: "Login successful", token });
    } else {
      res.json({ success: false, message: "Password did not match" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while checking the password",
    });
  }
};

exports.getEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user._id;
    console.log(employeeId);

    const result = await Employee.aggregate([
      {
        $match: {
          _id: employeeId,
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
      message: "Employee profile fetched successfully",
      data: result[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving the employee profile.",
    });
  }
};

exports.updateEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updates = req.body;

    const filteredUpdates = {
      phone: updates.phone || undefined,
      email: updates.email || undefined, // Only update if email is not empty
    };
       console.log(filteredUpdates);

    if (String(req.user._id) !== String(employeeId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this profile.",
      });
    }
    console.log(updates);
    const result = await Employee.findByIdAndUpdate(
      employeeId,
      { $set: filteredUpdates },
      { new: true, runValidators: true } 
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee profile updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the employee profile.",
    });
  }
};
