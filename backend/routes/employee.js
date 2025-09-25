import express from "express";
import {
	protect,
	adminOnly,
	staffAndAbove,
	departmentHeadAndAdmin
} from "../middleware/auth.js";
import {
	createEmployee,
	getAllEmployees,
	getEmployeeById,
	updateEmployee,
	deactivateEmployee
} from "../controllers/employee.js";

const router = express.Router();

// Protected routes
router.use(protect); // All routes after this require authentication

// Create employee (admin, department_head)
router.post("/", departmentHeadAndAdmin, createEmployee);

// Get all employees (admin, municipal_admin)
router.get("/", adminOnly, getAllEmployees);

// Get single employee (admin, municipal_admin)
router.get("/:id", adminOnly, getEmployeeById);

// Update employee (admin, municipal_admin, department_head, self)
router.put("/:id", staffAndAbove, updateEmployee);

// Deactivate employee (admin, municipal_admin, department_head)
router.delete("/:id", departmentHeadAndAdmin, deactivateEmployee);

export default router;