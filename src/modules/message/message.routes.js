import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import { sendMessage, getMessages, markAsRead } from "./message.controller.js";

const router = express.Router();

router.post("/", protect, sendMessage);       // send a message
router.get("/:userId", protect, getMessages); // get messages between two users
router.put("/read", protect, markAsRead);     // mark messages as read

export default router;
