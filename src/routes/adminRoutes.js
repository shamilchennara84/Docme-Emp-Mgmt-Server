const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getEmployeeById ,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  listEmployees,
//   filterEmployees,
} = require("../controllers/adminController");
const { protect } = require("../middleware.js/auth");

router.post("/login",adminLogin);
router.post("/employees", protect, createEmployee);
router.put("/employees/:id", protect, updateEmployee);
router.delete("/employees/:id", protect, deleteEmployee);
router.get("/employees", protect, listEmployees);
router.get("/employees/:id", protect, getEmployeeById);
// router.get("/employees/filter", protect, filterEmployees);

module.exports = router;
