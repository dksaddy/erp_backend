import Message from "./message.model.js";
import User from "../../models/user.model.js";

// ✅ Send message (API)
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ message: "Receiver and message required" });
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// ✅ Get chat messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// ✅ Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { senderId } = req.body;

    await Message.updateMany(
      { senderId, receiverId: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};


export const getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users data" });
  }
};


// GET /api/messages/unread-count
export const getUnreadCounts = async (req, res) => {
  try {
    const counts = await Message.aggregate([
      { $match: { receiverId: req.user._id, read: false } },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(counts);
  } catch (error) {
    console.error("Unread Count Error:", error);
    res.status(500).json({ message: "Failed to fetch unread counts" });
  }
};

// GET /api/messages/last-preview/:userId
export const getLastMessagePreview = async (req, res) => {
  try {
    const { userId } = req.params;
    const lastMessage = await Message.findOne({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(lastMessage);
  } catch (error) {
    console.error("Last Preview Error:", error);
    res.status(500).json({ message: "Failed to fetch last message preview" });
  }
};