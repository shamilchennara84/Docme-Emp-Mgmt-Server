const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  listEmployees,
} = require("../controllers/adminController");
const { protect } = require("../middleware.js/auth");

router.post("/login", adminLogin);
router.post("/employees", protect, createEmployee);
router.put("/employees/:id", protect, updateEmployee);
router.delete("/employees/:id", protect, deleteEmployee);
router.get("/employees", protect, listEmployees);
router.get("/employees/:id", protect, getEmployeeById);

module.exports = router;
