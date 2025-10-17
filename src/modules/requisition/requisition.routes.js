import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  createRequisition,
  getMyRequisitions,
  getALLRequisitions,
  updateRequisitionStatus,
} from "./requisition.controller.js";

const router = express.Router();

router.post("/", protect, createRequisition);
router.get("/", protect, getMyRequisitions);
router.get("/all", protect, getALLRequisitions);
router.put("/:id", protect, updateRequisitionStatus);

export default router;
