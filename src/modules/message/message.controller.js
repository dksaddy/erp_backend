import Message from "./message.model.js";
import User from "../../models/user.model.js";
import {onlineUsers} from "./message.socket.js";


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



function formatTime(date) {
  if (!date) return "";
  const now = new Date();
  const d = new Date(date);
  const isToday = d.toDateString() === now.toDateString();

  if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const diff = now.getDate() - d.getDate();
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString();
}

export const getChatList = async (req, res) => {
  try {
    const userId = req.user._id;

    const participants = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId",
            ],
          },
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: "$otherUser",
          lastTimestamp: { $max: "$createdAt" },
        },
      },
      { $sort: { lastTimestamp: -1 } },
    ]);

    const chatList = await Promise.all(
      participants.map(async (p) => {
        const otherUser = await User.findById(p._id).select("name");
        const lastMsg = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: p._id },
            { senderId: p._id, receiverId: userId },
          ],
        })
          .sort({ createdAt: -1 })
          .select("message createdAt");

        const unreadCount = await Message.countDocuments({
          senderId: p._id,
          receiverId: userId,
          read: false,
        });

        return {
          userId: p._id,
          name: otherUser.name,
          lastMessage: lastMsg?.message || "",
          time: formatTime(lastMsg?.createdAt),
          timestamp: lastMsg?.createdAt || new Date(0),
          unread: unreadCount,
          online: onlineUsers.has(p._id.toString()), // ✅ real-time status
        };
      })
    );

    res.status(200).json(chatList);
  } catch (error) {
    console.error("Chat List Error:", error);
    res.status(500).json({ message: "Failed to fetch chat list" });
  }
};
