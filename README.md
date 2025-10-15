# ERP Backend

This is the backend for an Enterprise Resource Planning (ERP) system. It provides APIs for user authentication, requisition management, and workflow approvals.

## Features

- **User Authentication**: Register and login users with role-based access control.
- **Requisition Management**: Create, view, and update requisitions.
- **Approval Workflow**: Multi-step approval process for requisitions.
- **Role-Based Access**: Different roles like `requester`, `dept_head`, `reviewer`, etc.

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dksaddy/erp_backend.git
   cd erp_backend

npm install
PORT=5000
MONGO_URI=mongodb://localhost:27017/erp
JWT_SECRET=your_jwt_secret
npm run devnpm start

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "password123",
  "role": "requester",
  "department": "IT"
}{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "password123",
  "role": "requester",
  "department": "IT"
}

{
  "message": "Registration successful",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "requester",
    "department": "IT"
  }
}

{
  "email": "alice@example.com",
  "password": "password123"
}

{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "requester",
    "department": "IT"
  }
}

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

{
  "decision": "approve",
  "comment": "Approved by department head"
}


{
  "message": "Requisition updated",
  "requisition": {
    "id": "requisition_id",
    "status": "Completed",
    ...
  }
}


erp_backend/
├── src/
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── middlewares/
│   │   └── authMiddleware.js # Authentication middleware
│   ├── models/              # Mongoose models
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication module
│   │   └── requisition/     # Requisition module
│   └── utils/
│       └── generateToken.js # JWT token generator
├── .env                     # Environment variables
├── package.json             # Project metadata and scripts
└── README.md                # Project documentation

