import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import { sendMessage, getMessages, markAsRead, getChatList, getUnreadCounts, getLastMessagePreview} from "./message.controller.js";

const router = express.Router();


router.get("/user", protect, getChatList);
router.get("/unread-count", protect, getUnreadCounts);
router.get("/last-preview/:userId", protect, getLastMessagePreview);
router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessages);
router.put("/read", protect, markAsRead);
    
export default router;
