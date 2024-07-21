const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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


