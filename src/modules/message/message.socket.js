import Message from "./message.model.js";

const onlineUsers = new Map();

export const initMessageSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // Register a user when they join
    socket.on("registerUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // Send a message
    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message) return;

      const newMessage = await Message.create({ senderId, receiverId, message });

      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", newMessage);
      }

      io.to(socket.id).emit("messageSent", newMessage);
    });

    // Typing indicator
    socket.on("typing", (receiverId) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) io.to(receiverSocket).emit("typing", true);
    });

    // Disconnect event
    socket.on("disconnect", () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) onlineUsers.delete(userId);
      }
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};
