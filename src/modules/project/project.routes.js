import express from "express";
import { getProjects, createProject } from "./project.controller.js";
import { protect } from "../../middlewares/authMiddleware.js"; // optional if auth required

const router = express.Router();

router.get("/", protect, getProjects);  // GET /api/projects
router.post("/", protect, createProject); // POST /api/projects

export default router;
