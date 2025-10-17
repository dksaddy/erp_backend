import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import { sendMessage, getMessages, markAsRead, getChatList, getRecieiver} from "./message.controller.js";

const router = express.Router();

router.get("/reciever/:id", protect, getRecieiver);
router.get("/user", protect, getChatList);
router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessages);
router.put("/read", protect, markAsRead);
    
export default router;
