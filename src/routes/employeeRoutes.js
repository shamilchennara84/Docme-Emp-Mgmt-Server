const express = require("express");
const router = express.Router();
const {
  employeeLogin,
  getEmployeeProfile,
  updateEmployeeProfile,
} = require("../controllers/employeeController");
const { protect} = require("../middleware.js/auth");

router.post("/login", employeeLogin);
router.get("/profile", protect, getEmployeeProfile); 
router.put("/profile/:id", protect, updateEmployeeProfile);

module.exports = router;
