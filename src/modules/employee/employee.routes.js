import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import { getEmployees, createEmployee } from "./employee.controller.js";

const router = express.Router();

// 👇 Protect these routes using the middleware
router.get("/", protect, getEmployees);
router.post("/", protect, createEmployee);

export default router;
