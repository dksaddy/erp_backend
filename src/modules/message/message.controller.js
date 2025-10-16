import Message from "./message.model.js";

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
