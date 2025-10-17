import e from "express";
import Message from "./message.model.js";

const onlineUsers = new Map(); // userId (string) -> socketId

export const initMessageSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // Register a user when they join (expect a plain userId string)
    socket.on("registerUser", (rawUserId) => {
      try {
        const userId = String(rawUserId);
        // store mapping and join a room named by userId
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log("[socket] registerUser:", { userId, socketId: socket.id });
        // emit array of userIds (strings)
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      } catch (err) {
        console.error("[socket] registerUser error:", err);
      }
    });

    // Send a message
    socket.on("sendMessage", async (data) => {
      try {
        const { senderId, receiverId, message, tempId } = data;
        if (!senderId || !receiverId || !message) return;

        // create and persist message
        const newMessage = await Message.create({
          senderId,
          receiverId,
          message,
        });

        // ensure created message has id and createdAt
        const payload = {
          ...newMessage.toObject ? newMessage.toObject() : newMessage,
          tempId: tempId || null,
        };

        // notify receiver if online (use room emit to support multi-device)
        if (receiverId) {
          io.to(String(receiverId)).emit("receiveMessage", payload);
          io.to(String(receiverId)).emit("refreshChatList");
        }

        // Notify sender(s)
        // If sender may be connected from multiple devices, emit to their room as well
        io.to(String(senderId)).emit("messageSent", payload);
        io.to(String(senderId)).emit("refreshChatList");

        // Send back delivery ack to sender containing tempId and messageId
        io.to(String(senderId)).emit("messageDelivered", {
          tempId: tempId || null,
          messageId: payload._id,
          delivered: !!receiverId && onlineUsers.has(String(receiverId)),
        });

      } catch (err) {
        console.error("[socket] sendMessage error:", err);
      }
    });

    // Typing indicator: expect receiverId (userId string)
    socket.on("typing", (receiverId) => {
      try {
        if (!receiverId) return;
        io.to(String(receiverId)).emit("typing", socket.id); // send sender socket id so receiver can ignore if needed
      } catch (err) {
        console.error("[socket] typing error:", err);
      }
    });

    // markAsRead: notify sender that messages were seen
    socket.on("markAsRead", ({ senderId, receiverId }) => {
      try {
        if (!senderId || !receiverId) return;
        // emit messageSeen to sender's room; client can decide which message(s) to mark
        io.to(String(senderId)).emit("messageSeen", { senderId, receiverId });
      } catch (err) {
        console.error("[socket] markAsRead error:", err);
      }
    });

    // Clean up on disconnect: remove any user entries mapped to this socket id
    socket.on("disconnect", () => {
      try {
        for (const [userId, sockId] of onlineUsers.entries()) {
          if (sockId === socket.id) {
            onlineUsers.delete(userId);
            console.log("[socket] removed mapping for userId:", userId, "socket:", socket.id);
            break;
          }
        }
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        console.log("🔴 Socket disconnected:", socket.id);
      } catch (err) {
        console.error("[socket] disconnect error:", err);
      }
    });
  });
};

export { onlineUsers };