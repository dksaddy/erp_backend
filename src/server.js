import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initMessageSocket } from "./modules/message/message.socket.js";

dotenv.config();
connectDB();

// ✅ Create HTTP server from Express
const server = http.createServer(app);

// ✅ Attach socket.io to the same server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Initialize message socket events
initMessageSocket(io);

const PORT = process.env.PORT || 5000;

// ✅ Listen with server (not app)
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
