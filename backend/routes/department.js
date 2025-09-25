import express from "express";
import { protect, adminOnly, staffAndAbove, departmentHeadAndAdmin } from "../middleware/auth.js";
import { 
    createADepartment, 
    getAllDepartments, 
    getDepartmentById, 
    updateDepartment, 
    deleteDepartment,
    getDepartmentsByPincode,
    addStaff,
    removeStaff,
    getDepartmentStaff
} from "../controllers/department.js";

const router = express.Router();

// Public routes
router.get("/by-pincode/:pincode", getDepartmentsByPincode);

// Protected routes
router.use(protect); // All routes after this require authentication

router.get("/", staffAndAbove, getAllDepartments);
router.get("/:id", staffAndAbove, getDepartmentById);

// Staff management routes
router.get("/:id/staff", staffAndAbove, getDepartmentStaff);
router.post("/:id/staff", departmentHeadAndAdmin, addStaff);
router.delete("/:id/staff/:userId", departmentHeadAndAdmin, removeStaff);

// Admin only routes
router.post("/", adminOnly, createADepartment);
router.put("/:id", adminOnly, updateDepartment);
router.delete("/:id", adminOnly, deleteDepartment);

export default router;