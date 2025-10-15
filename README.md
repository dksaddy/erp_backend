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

## Project Structure

erp_backend/
- ├── src/
- │   ├── app.js               # Express app setup
- │   ├── server.js            # Server entry point
- │   ├── config/
- │   │   └── db.js            # MongoDB connection
- │   ├── middlewares/
- │   │   └── authMiddleware.js # Authentication middleware
- │   ├── models/              # Mongoose models
- │   ├── modules/             # Feature modules
- │   │   ├── auth/            # Authentication module
- │   │   └── requisition/     # Requisition module
- │   └── utils/
- │       └── generateToken.js # JWT token generator
- ├── .env                     # Environment variables
- ├── package.json             # Project metadata and scripts
- └── README.md                # Project documentation

---


