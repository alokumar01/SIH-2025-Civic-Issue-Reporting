import express from "express";
import authRouter from "./auth.js";
import department from "./department.js";
import employee from "./employee.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/departments", department);
router.use("/employees", employee);

export default router;