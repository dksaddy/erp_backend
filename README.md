# ERP Backend

Backend API for an **Enterprise Resource Planning (ERP)** system.  
Provides user authentication, requisition management, and multi-step approval workflows.

---

## Features

- **User Authentication**: Register and login users with role-based access.
- **Requisition Management**: Create, view, and update requisitions.
- **Approval Workflow**: Multi-step approval process (`dept_head`, `reviewer`, `approver`, `finance`, `admin`).
- **Role-Based Access**: Different permissions for different roles.

---

## Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dksaddy/erp_backend.git
cd erp_backend

```

## Setup .env

- PORT=5000
- MONGO_URI=your_secret
- JWT_SECRET=your_jwt_secret

```bash
npm install
npm run dev

```

### Registration

- /api/auth/register

```bash
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "password123",
  "role": "requester",
  "department": "IT"
}
```

### Login

- /api/auth/login

```bash
{
  "email": "alice@example.com",
  "password": "password123"
}
```

---

### Requisition

- POST
- /api/requisitions

```bash
{
  "title": "Laptop Purchase",
  "description": "10 Dell laptops for the IT team",
  "department": "IT",
  "totalAmount": 2500,
  "items": [
    {
      "name": "Laptop",
      "qty": 10,
      "unitPrice": 250
    }
  ],
  "labels": ["priority:high", "vendor:Dell"]
}
```

### Requisition Update

- /api/requisitions/:id
- PUT

```bash
{
  "decision": "approve",
  "comment": "Approved by department head"
}
```

---

### Message with Socket IO

#### Send message
- /api/messages
- POST

```bash
{
  "receiverId": "68efd930ecb073ac87a0c5df",
  "message": "Hello, how are you?"
}
```

#### Get chat between two users
- /api/messages/68efd930ecb073ac87a0c5df [reciver id]
- GET

```bash
No Body needed
```

#### Mark messages as read
- /api/messages/read
- PUT

```bash
{
  "senderId": "68efd930ecb073ac87a0c5df"
}

```

---

#### Socket Testing
```bash
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Socket.IO Test</title>
  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
</head>
<body>
  <h1>Socket.IO Test</h1>
  <script>
    const socket = io("http://localhost:5000");

    socket.emit("registerUser", "68efd930ecb073ac87a0c5df");

    socket.on("receiveMessage", (msg) => {
      console.log("📩 Message received:", msg);
    });

    socket.emit("sendMessage", {
      senderId: "68efd930ecb073ac87a0c5df",
      receiverId: "68efca76c10482d639132cb5",
      message: "Test! saddy",
    });
  </script>
</body>
</html>
```
---

#### Frontend Socket Events (React Native sender + receiver integration)

- Install socket.io-client:

```bash
npm install socket.io-client
```
- Then import it
```bash
import { io } from "socket.io-client";
```
-Make sure your backend Socket.IO server runs on something like
```bash
http://192.168.x.x:5000
```
- (Replace with your local IP address, not localhost, since RN runs on a device/emulator.)

- ChatScreen.js — Full Example

- This single screen works for both sender and receiver (based on logged-in user).

```bash
import React, { useEffect, useState, useRef } from "react";
import { View, TextInput, FlatList, Text, Button, StyleSheet } from "react-native";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://192.168.0.105:5000"; // change this
const API_URL = "http://192.168.0.105:5000/api/messages"; // your REST API base

export default function ChatScreen({ route }) {
  const { userId, receiverId, token } = route.params; // e.g. logged in user & chat partner
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // ✅ Connect socket and register user
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket:", socketRef.current.id);
      socketRef.current.emit("registerUser", userId);
    });

    // 🔥 Listen for new messages
    socketRef.current.on("receiveMessage", (newMsg) => {
      console.log("📩 Received message:", newMsg);
      setMessages((prev) => [...prev, newMsg]);
    });

    // cleanup
    return () => socketRef.current.disconnect();
  }, []);

  // ✅ Load chat history via REST API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };
    fetchMessages();
  }, [receiverId]);

  // ✅ Send message (emit + optional REST save)
  const handleSend = () => {
    if (!message.trim()) return;

    const msgData = {
      senderId: userId,
      receiverId,
      message,
    };

    // emit to socket server
    socketRef.current.emit("sendMessage", msgData);

    // optimistic update (instantly show message)
    setMessages((prev) => [...prev, { ...msgData, self: true }]);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msgBubble,
              item.senderId === userId ? styles.sent : styles.received,
            ]}
          >
            <Text style={styles.msgText}>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type message..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  msgBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    maxWidth: "80%",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
  msgText: { fontSize: 16 },
});
```
```
| Event                    | Who Triggers        | What Happens                                     |
| ------------------------ | ------------------- | ------------------------------------------------ |
| `registerUser`           | Each logged-in user | Registers socket in server memory                |
| `sendMessage`            | Sender              | Emits to server → saved in DB → sent to receiver |
| `receiveMessage`         | Receiver            | Listens & updates UI instantly                   |
| REST API (`getMessages`) | On screen load      | Fetches chat history from DB                     |
```

#### Example Usage
-When you navigate to this screen
```bash
navigation.navigate("ChatScreen", {
  userId: "68efd930ecb073ac87a0c5df",  // logged in user
  receiverId: "68efca76c10482d639132cb5",
  token: userToken
});
```

---

## Project Structure

erp_backend/

- ├── src/
- │ ├── app.js # Express app setup
- │ ├── server.js # Server entry point
- │ ├── config/
- │ │ └── db.js # MongoDB connection
- │ ├── middlewares/
- │ │ └── authMiddleware.js # Authentication middleware
- │ ├── models/ # Mongoose models
- │ ├── modules/ # Feature modules
- │ │ ├── auth/ # Authentication module
- │ │ └── requisition/ # Requisition module
- │ └── utils/
- │ └── generateToken.js # JWT token generator
- ├── .env # Environment variables
- ├── package.json # Project metadata and scripts
- └── README.md # Project documentation

---
